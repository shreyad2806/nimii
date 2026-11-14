import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { AppError, toAppError } from "@/lib/errors/app-error";
import { failure, success, type Result } from "@/lib/errors/result";
import { SupabaseConversationRepository } from "@/lib/repositories/conversations/supabase-conversation.repository";
import { SupabaseMessageRepository } from "@/lib/repositories/messages/supabase-message.repository";
import type { AuthenticatedSupabaseContext } from "@/lib/repositories/server/context";
import { ConversationService } from "@/lib/services/conversations/conversation.service";
import { MessageService } from "@/lib/services/messages/message.service";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type AuthenticatedServices = {
  conversations: ConversationService;
  messages: MessageService;
};

export async function createAuthenticatedServices(): Promise<
  Result<AuthenticatedServices>
> {
  let client: SupabaseClient<Database>;
  try {
    client = await createClient();
  } catch (cause) {
    return failure(
      toAppError(cause, "INTERNAL_ERROR", "The backend is temporarily unavailable.")
    );
  }

  let user: User;
  try {
    const { data, error } = await client.auth.getUser();
    if (
      error?.status === 401 ||
      error?.status === 403 ||
      (!error && !data.user)
    ) {
      return failure(
        new AppError("UNAUTHENTICATED", "Authentication is required.", {
          cause: error,
        })
      );
    }
    if (error) {
      return failure(
        toAppError(
          error,
          "INTERNAL_ERROR",
          "The authenticated session could not be verified."
        )
      );
    }
    user = data.user;
  } catch (cause) {
    return failure(
      toAppError(
        cause,
        "INTERNAL_ERROR",
        "The authenticated session could not be verified."
      )
    );
  }

  const context: AuthenticatedSupabaseContext = {
    client,
    userId: user.id,
  };
  const messageRepository = new SupabaseMessageRepository(context);
  const conversationRepository = new SupabaseConversationRepository(
    context,
    messageRepository
  );
  const messageService = new MessageService(messageRepository);

  return success({
    conversations: new ConversationService(conversationRepository, messageService),
    messages: messageService,
  });
}
