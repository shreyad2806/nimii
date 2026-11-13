-- ==============================================================================
-- NIMII - INITIAL DATABASE SCHEMA MIGRATION
-- Migration: 20261113193843_initial_nimii_schema.sql
-- Description: Core tables, constraints, triggers, indexes, and RLS policies
-- ==============================================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. UTILITY FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Reusable trigger function for updating updated_at columns
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Trigger function to automatically manage open_loops completion timestamp
CREATE OR REPLACE FUNCTION public.handle_open_loop_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') AND NEW.completed_at IS NULL THEN
    NEW.completed_at = timezone('utc'::text, now());
  ELSIF NEW.status != 'completed' AND OLD.status = 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PROFILES: Extends Supabase auth.users with public identity data
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Explorer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_display_name_check CHECK (char_length(trim(display_name)) >= 1 AND char_length(display_name) <= 100)
);

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users with application display info.';
COMMENT ON COLUMN public.profiles.id IS 'Primary key referencing auth.users(id).';
COMMENT ON COLUMN public.profiles.display_name IS 'Sanitized user display name for UI rendering.';

-- ------------------------------------------------------------------------------
-- CONVERSATIONS: Top-level chat sessions owned by a profile
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT conversations_title_check CHECK (char_length(trim(title)) >= 1 AND char_length(title) <= 255)
);

COMMENT ON TABLE public.conversations IS 'Chat sessions created by users.';
COMMENT ON COLUMN public.conversations.user_id IS 'Owner profile ID.';

-- ------------------------------------------------------------------------------
-- MESSAGES: Sequential messages within a conversation
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT messages_role_check CHECK (role IN ('system', 'user', 'assistant', 'tool'))
);

COMMENT ON TABLE public.messages IS 'Individual conversation messages supporting LLM roles.';
COMMENT ON COLUMN public.messages.role IS 'Message role: system, user, assistant, or tool.';
COMMENT ON COLUMN public.messages.metadata IS 'Structured metadata: citations, highlights, agent execution info.';

-- ------------------------------------------------------------------------------
-- MEMORIES: Long-term declarative and episodic user memories
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  importance INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT memories_type_check CHECK (memory_type IN ('fact', 'preference', 'decision', 'research', 'project', 'other')),
  CONSTRAINT memories_importance_check CHECK (importance >= 1 AND importance <= 5),
  CONSTRAINT memories_content_check CHECK (char_length(trim(content)) >= 1)
);

COMMENT ON TABLE public.memories IS 'User memory store for personalized context retrieval.';
COMMENT ON COLUMN public.memories.source_message_id IS 'Optional reference to message that originated this memory.';
COMMENT ON COLUMN public.memories.importance IS 'Priority weighting between 1 (low) and 5 (critical).';

-- ------------------------------------------------------------------------------
-- SOURCES: Grounding citations and web search references attached to messages
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  snippet TEXT,
  domain TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT sources_position_check CHECK (position >= 0),
  CONSTRAINT sources_url_check CHECK (char_length(trim(url)) >= 1),
  CONSTRAINT sources_title_check CHECK (char_length(trim(title)) >= 1),
  CONSTRAINT sources_domain_check CHECK (char_length(trim(domain)) >= 1)
);

COMMENT ON TABLE public.sources IS 'Web sources and citation snippets associated with assistant responses.';

-- ------------------------------------------------------------------------------
-- OPEN_LOOPS: Follow-up tasks, unresolved items, and active workflows
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.open_loops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT open_loops_status_check CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
  CONSTRAINT open_loops_priority_check CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT open_loops_title_check CHECK (char_length(trim(title)) >= 1)
);

COMMENT ON TABLE public.open_loops IS 'Actionable tasks and open loops tracked by the Nimii companion.';
COMMENT ON COLUMN public.open_loops.status IS 'Lifecycle: pending, in_progress, completed, archived.';
COMMENT ON COLUMN public.open_loops.priority IS 'Priority level: low, medium, high.';

-- ------------------------------------------------------------------------------
-- SEARCH_LOGS: Audit trail of search executions for telemetry and analytics
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  duration_ms INTEGER NOT NULL,
  result_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT search_logs_duration_check CHECK (duration_ms >= 0),
  CONSTRAINT search_logs_result_count_check CHECK (result_count >= 0),
  CONSTRAINT search_logs_query_check CHECK (char_length(trim(query)) >= 1)
);

COMMENT ON TABLE public.search_logs IS 'Telemetry of web search queries and latency.';

-- ==============================================================================
-- 3. AUTOMATIC PROFILE CREATION TRIGGER (auth.users -> public.profiles)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_display_name text;
  v_avatar_url text;
BEGIN
  -- Safely extract display name from metadata with sensible fallbacks
  v_display_name := coalesce(
    nullif(trim(NEW.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(NEW.raw_user_meta_data->>'name'), ''),
    nullif(trim(NEW.raw_user_meta_data->>'display_name'), ''),
    nullif(trim(NEW.raw_user_meta_data->>'user_name'), ''),
    nullif(trim(split_part(NEW.email, '@', 1)), '')
  );

  -- Handle anonymous or metadata-less signups
  IF v_display_name IS NULL THEN
    IF COALESCE(NEW.is_anonymous, false) = true THEN
      v_display_name := 'Guest Explorer';
    ELSE
      v_display_name := 'Explorer';
    END IF;
  END IF;

  -- Enforce length constraint boundary
  IF char_length(v_display_name) > 100 THEN
    v_display_name := substring(v_display_name from 1 for 100);
  END IF;

  -- Extract avatar URL if provided in oauth or user metadata
  v_avatar_url := nullif(trim(NEW.raw_user_meta_data->>'avatar_url'), '');

  INSERT INTO public.profiles (
    id,
    display_name,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_display_name,
    v_avatar_url,
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE
    SET
      display_name = coalesce(EXCLUDED.display_name, public.profiles.display_name),
      avatar_url = coalesce(EXCLUDED.avatar_url, public.profiles.avatar_url),
      updated_at = timezone('utc'::text, now());

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log warning to PostgreSQL log and allow user creation to continue
    RAISE WARNING 'handle_new_user exception for user_id %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS 'Trigger function creating a public profile row upon auth.users insertion.';

-- Drop existing trigger if present and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. UPDATED_AT TRIGGERS
-- ==============================================================================

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_conversations_updated_at ON public.conversations;
CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_memories_updated_at ON public.memories;
CREATE TRIGGER set_memories_updated_at
  BEFORE UPDATE ON public.memories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_open_loops_updated_at ON public.open_loops;
CREATE TRIGGER set_open_loops_updated_at
  BEFORE UPDATE ON public.open_loops
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_open_loops_status_completion ON public.open_loops;
CREATE TRIGGER set_open_loops_status_completion
  BEFORE INSERT OR UPDATE ON public.open_loops
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_open_loop_status();

-- ==============================================================================
-- 5. PERFORMANCE & INTEGRITY INDEXES
-- ==============================================================================

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id
  ON public.conversations (user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_user_updated_at
  ON public.conversations (user_id, updated_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
  ON public.messages (conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created_at
  ON public.messages (conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_messages_role
  ON public.messages (conversation_id, role);

-- Memories indexes
CREATE INDEX IF NOT EXISTS idx_memories_user_id
  ON public.memories (user_id);

CREATE INDEX IF NOT EXISTS idx_memories_user_created_at
  ON public.memories (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_memories_source_message_id
  ON public.memories (source_message_id)
  WHERE source_message_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_memories_user_type
  ON public.memories (user_id, memory_type);

CREATE INDEX IF NOT EXISTS idx_memories_tags
  ON public.memories USING gin (tags);

-- Sources indexes
CREATE INDEX IF NOT EXISTS idx_sources_message_id
  ON public.sources (message_id);

CREATE INDEX IF NOT EXISTS idx_sources_message_position
  ON public.sources (message_id, position ASC);

CREATE INDEX IF NOT EXISTS idx_sources_domain
  ON public.sources (domain);

-- Open Loops indexes
CREATE INDEX IF NOT EXISTS idx_open_loops_user_id
  ON public.open_loops (user_id);

CREATE INDEX IF NOT EXISTS idx_open_loops_user_status
  ON public.open_loops (user_id, status);

CREATE INDEX IF NOT EXISTS idx_open_loops_user_due_date
  ON public.open_loops (user_id, due_date ASC)
  WHERE status != 'completed';

CREATE INDEX IF NOT EXISTS idx_open_loops_user_priority
  ON public.open_loops (user_id, priority);

-- Search Logs indexes
CREATE INDEX IF NOT EXISTS idx_search_logs_user_id
  ON public.search_logs (user_id);

CREATE INDEX IF NOT EXISTS idx_search_logs_message_id
  ON public.search_logs (message_id)
  WHERE message_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_search_logs_created_at
  ON public.search_logs (created_at DESC);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.open_loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles RLS Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- ------------------------------------------------------------------------------
-- Conversations RLS Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "conversations_select_own"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "conversations_insert_own"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "conversations_update_own"
  ON public.conversations FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "conversations_delete_own"
  ON public.conversations FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ------------------------------------------------------------------------------
-- Messages RLS Policies (scoped through conversation ownership)
-- ------------------------------------------------------------------------------
CREATE POLICY "messages_select_own"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "messages_insert_own"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "messages_update_own"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND c.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "messages_delete_own"
  ON public.messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

-- ------------------------------------------------------------------------------
-- Memories RLS Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "memories_select_own"
  ON public.memories FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "memories_insert_own"
  ON public.memories FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      source_message_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.messages m
        JOIN public.conversations c ON c.id = m.conversation_id
        WHERE m.id = memories.source_message_id
          AND c.user_id = (SELECT auth.uid())
      )
    )
  );

CREATE POLICY "memories_update_own"
  ON public.memories FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      source_message_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.messages m
        JOIN public.conversations c ON c.id = m.conversation_id
        WHERE m.id = memories.source_message_id
          AND c.user_id = (SELECT auth.uid())
      )
    )
  );

CREATE POLICY "memories_delete_own"
  ON public.memories FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ------------------------------------------------------------------------------
-- Sources RLS Policies (scoped through message and conversation ownership)
-- ------------------------------------------------------------------------------
CREATE POLICY "sources_select_own"
  ON public.sources FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE m.id = sources.message_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "sources_insert_own"
  ON public.sources FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE m.id = sources.message_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "sources_update_own"
  ON public.sources FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE m.id = sources.message_id
        AND c.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE m.id = sources.message_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "sources_delete_own"
  ON public.sources FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE m.id = sources.message_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

-- ------------------------------------------------------------------------------
-- Open Loops RLS Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "open_loops_select_own"
  ON public.open_loops FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "open_loops_insert_own"
  ON public.open_loops FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "open_loops_update_own"
  ON public.open_loops FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "open_loops_delete_own"
  ON public.open_loops FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ------------------------------------------------------------------------------
-- Search Logs RLS Policies
-- ------------------------------------------------------------------------------
CREATE POLICY "search_logs_select_own"
  ON public.search_logs FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "search_logs_insert_own"
  ON public.search_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      message_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.messages m
        JOIN public.conversations c ON c.id = m.conversation_id
        WHERE m.id = search_logs.message_id
          AND c.user_id = (SELECT auth.uid())
      )
    )
  );

CREATE POLICY "search_logs_update_own"
  ON public.search_logs FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      message_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.messages m
        JOIN public.conversations c ON c.id = m.conversation_id
        WHERE m.id = search_logs.message_id
          AND c.user_id = (SELECT auth.uid())
      )
    )
  );

CREATE POLICY "search_logs_delete_own"
  ON public.search_logs FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
