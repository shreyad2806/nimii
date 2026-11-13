-- ==============================================================================
-- NIMII - ROW LEVEL SECURITY (RLS) HARDENING MIGRATION
-- Migration: 20261114014500_row_level_security.sql
-- Description: Comprehensive, zero-trust RLS policies for all application tables
-- ==============================================================================

-- Ensure RLS is strictly enabled on every public application table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.open_loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- CLEANUP: Remove any existing legacy or preliminary policies
-- ------------------------------------------------------------------------------

-- Profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Conversations
DROP POLICY IF EXISTS "Users can read own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;
DROP POLICY IF EXISTS "conversations_select_own" ON public.conversations;
DROP POLICY IF EXISTS "conversations_insert_own" ON public.conversations;
DROP POLICY IF EXISTS "conversations_update_own" ON public.conversations;
DROP POLICY IF EXISTS "conversations_delete_own" ON public.conversations;

-- Messages
DROP POLICY IF EXISTS "Users can read messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages into own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can delete messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "messages_select_own" ON public.messages;
DROP POLICY IF EXISTS "messages_insert_own" ON public.messages;
DROP POLICY IF EXISTS "messages_update_own" ON public.messages;
DROP POLICY IF EXISTS "messages_delete_own" ON public.messages;

-- Memories
DROP POLICY IF EXISTS "Users can read own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can insert own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can update own memories" ON public.memories;
DROP POLICY IF EXISTS "Users can delete own memories" ON public.memories;
DROP POLICY IF EXISTS "memories_select_own" ON public.memories;
DROP POLICY IF EXISTS "memories_insert_own" ON public.memories;
DROP POLICY IF EXISTS "memories_update_own" ON public.memories;
DROP POLICY IF EXISTS "memories_delete_own" ON public.memories;

-- Sources
DROP POLICY IF EXISTS "Users can read sources for own messages" ON public.sources;
DROP POLICY IF EXISTS "Users can insert sources for own messages" ON public.sources;
DROP POLICY IF EXISTS "Users can update sources for own messages" ON public.sources;
DROP POLICY IF EXISTS "Users can delete sources for own messages" ON public.sources;
DROP POLICY IF EXISTS "sources_select_own" ON public.sources;
DROP POLICY IF EXISTS "sources_insert_own" ON public.sources;
DROP POLICY IF EXISTS "sources_update_own" ON public.sources;
DROP POLICY IF EXISTS "sources_delete_own" ON public.sources;

-- Open Loops
DROP POLICY IF EXISTS "Users can read own open loops" ON public.open_loops;
DROP POLICY IF EXISTS "Users can insert own open loops" ON public.open_loops;
DROP POLICY IF EXISTS "Users can update own open loops" ON public.open_loops;
DROP POLICY IF EXISTS "Users can delete own open loops" ON public.open_loops;
DROP POLICY IF EXISTS "open_loops_select_own" ON public.open_loops;
DROP POLICY IF EXISTS "open_loops_insert_own" ON public.open_loops;
DROP POLICY IF EXISTS "open_loops_update_own" ON public.open_loops;
DROP POLICY IF EXISTS "open_loops_delete_own" ON public.open_loops;

-- Search Logs
DROP POLICY IF EXISTS "Users can read own search logs" ON public.search_logs;
DROP POLICY IF EXISTS "Users can insert own search logs" ON public.search_logs;
DROP POLICY IF EXISTS "Users can update own search logs" ON public.search_logs;
DROP POLICY IF EXISTS "Users can delete own search logs" ON public.search_logs;
DROP POLICY IF EXISTS "search_logs_select_own" ON public.search_logs;
DROP POLICY IF EXISTS "search_logs_insert_own" ON public.search_logs;
DROP POLICY IF EXISTS "search_logs_update_own" ON public.search_logs;
DROP POLICY IF EXISTS "search_logs_delete_own" ON public.search_logs;

-- ==============================================================================
-- 1. PROFILES POLICIES
-- ==============================================================================
-- Rules:
-- 1. SELECT: Only the user whose auth.uid() matches the profile ID.
-- 2. INSERT: Only allowed with matching auth.uid() (e.g. self-registration fallback).
-- 3. UPDATE: Users may only update their own profile; cannot alter the primary ID.
-- 4. DELETE: Disallowed directly. Deletions cascade from auth.users.
-- ------------------------------------------------------------------------------

CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- ==============================================================================
-- 2. CONVERSATIONS POLICIES
-- ==============================================================================
-- Rules:
-- Full CRUD restricted strictly to user_id = auth.uid().
-- Frontend-supplied user_id is validated against auth.uid() on INSERT & UPDATE.
-- ------------------------------------------------------------------------------

CREATE POLICY "conversations_select_own"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "conversations_insert_own"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "conversations_update_own"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "conversations_delete_own"
  ON public.conversations
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ==============================================================================
-- 3. MESSAGES POLICIES
-- ==============================================================================
-- Rules:
-- Access is granted ONLY when the parent conversation is owned by auth.uid().
-- Prevents cross-user message reads, tampering, or inserting messages into
-- another user's conversation.
-- ------------------------------------------------------------------------------

CREATE POLICY "messages_select_own"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "messages_insert_own"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "messages_update_own"
  ON public.messages
  FOR UPDATE
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
  ON public.messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

-- ==============================================================================
-- 4. MEMORIES POLICIES
-- ==============================================================================
-- Rules:
-- 1. Full CRUD restricted to user_id = auth.uid().
-- 2. When source_message_id is supplied, verify that the referenced message belongs
--    to a conversation owned by the same auth.uid(). This prevents users from
--    associating memories with private messages from other users.
-- ------------------------------------------------------------------------------

CREATE POLICY "memories_select_own"
  ON public.memories
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "memories_insert_own"
  ON public.memories
  FOR INSERT
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
  ON public.memories
  FOR UPDATE
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
  ON public.memories
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ==============================================================================
-- 5. SOURCES POLICIES
-- ==============================================================================
-- Rules:
-- Full CRUD permitted ONLY when the associated message belongs to a conversation
-- owned by auth.uid().
-- ------------------------------------------------------------------------------

CREATE POLICY "sources_select_own"
  ON public.sources
  FOR SELECT
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
  ON public.sources
  FOR INSERT
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
  ON public.sources
  FOR UPDATE
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
  ON public.sources
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.conversations c ON c.id = m.conversation_id
      WHERE m.id = sources.message_id
        AND c.user_id = (SELECT auth.uid())
    )
  );

-- ==============================================================================
-- 6. OPEN_LOOPS POLICIES
-- ==============================================================================
-- Rules:
-- Full CRUD restricted strictly to user_id = auth.uid().
-- Frontend cannot supply an arbitrary user_id on INSERT or UPDATE.
-- ------------------------------------------------------------------------------

CREATE POLICY "open_loops_select_own"
  ON public.open_loops
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "open_loops_insert_own"
  ON public.open_loops
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "open_loops_update_own"
  ON public.open_loops
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "open_loops_delete_own"
  ON public.open_loops
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ==============================================================================
-- 7. SEARCH_LOGS POLICIES
-- ==============================================================================
-- Rules:
-- 1. Full access restricted to user_id = auth.uid().
-- 2. When message_id is supplied, verify that the referenced message belongs
--    to a conversation owned by the same auth.uid(). Prevents associating search
--    telemetry with another user's chat message.
-- ------------------------------------------------------------------------------

CREATE POLICY "search_logs_select_own"
  ON public.search_logs
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "search_logs_insert_own"
  ON public.search_logs
  FOR INSERT
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
  ON public.search_logs
  FOR UPDATE
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
  ON public.search_logs
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
