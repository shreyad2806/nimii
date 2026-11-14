CREATE OR REPLACE FUNCTION public.touch_conversation_updated_at_from_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_conversation_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_conversation_id := OLD.conversation_id;
  ELSE
    target_conversation_id := NEW.conversation_id;
  END IF;

  UPDATE public.conversations
  SET updated_at = timezone('utc'::text, now())
  WHERE id = target_conversation_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS messages_touch_conversation_updated_at
  ON public.messages;

CREATE TRIGGER messages_touch_conversation_updated_at
  AFTER INSERT OR DELETE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_conversation_updated_at_from_message();
