import "server-only";
import { AppError, toAppError } from "@/lib/errors/app-error";
import { createPage, type Page, type Pagination } from "@/lib/domain/pagination";
import { failure, success, type Result } from "@/lib/errors/result";
import type { AuthenticatedSupabaseContext } from "@/lib/repositories/server/context";
import type { MessageRepository } from "@/lib/repositories/messages/message.repository";
import type {
  Conversation,
  ConversationRepository,
  ConversationWithMessages,
} from "./conversation.repository";

export class SupabaseConversationRepository implements ConversationRepository {
  constructor(
    private readonly context: AuthenticatedSupabaseContext,
    private readonly messageRepository: MessageRepository
  ) {}

  async createConversation(input: { title?: string }): Promise<Result<Conversation>> {
    try {
      const { data, error } = await this.context.client
        .from("conversations")
        .insert({
          user_id: this.context.userId,
          ...(input.title === undefined ? {} : { title: input.title }),
        })
        .select("*")
        .single();

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not create the conversation.")
        );
      }

      return success(data);
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not create the conversation.")
      );
    }
  }

  async getConversationById(id: string): Promise<Result<Conversation | null>> {
    try {
      const { data, error } = await this.context.client
        .from("conversations")
        .select("*")
        .eq("id", id)
        .eq("user_id", this.context.userId)
        .maybeSingle();

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not load the conversation.")
        );
      }

      return success(data);
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not load the conversation.")
      );
    }
  }

  async getUserConversations(
    pagination: Pagination
  ): Promise<Result<Page<Conversation>>> {
    try {
      const { data, error, count } = await this.context.client
        .from("conversations")
        .select("*", { count: "exact" })
        .eq("user_id", this.context.userId)
        .order("updated_at", { ascending: false })
        .order("id", { ascending: false })
        .range(pagination.offset, pagination.offset + pagination.limit - 1);

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not load conversations.")
        );
      }

      return success(createPage(data ?? [], count ?? 0, pagination));
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not load conversations.")
      );
    }
  }

  async updateConversationTitle(
    id: string,
    title: string
  ): Promise<Result<Conversation | null>> {
    try {
      const { data, error } = await this.context.client
        .from("conversations")
        .update({ title })
        .eq("id", id)
        .eq("user_id", this.context.userId)
        .select("*")
        .maybeSingle();

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not rename the conversation.")
        );
      }

      return success(data);
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not rename the conversation.")
      );
    }
  }

  async deleteConversation(id: string): Promise<Result<boolean>> {
    try {
      const { data, error } = await this.context.client
        .from("conversations")
        .delete()
        .eq("id", id)
        .eq("user_id", this.context.userId)
        .select("id")
        .maybeSingle();

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not delete the conversation.")
        );
      }

      return success(data !== null);
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not delete the conversation.")
      );
    }
  }

  async getConversationWithMessages(
    id: string,
    pagination: Pagination
  ): Promise<Result<ConversationWithMessages | null>> {
    const conversationResult = await this.getConversationById(id);
    if (conversationResult.error || !conversationResult.data) {
      return conversationResult.error
        ? failure(conversationResult.error)
        : success(null);
    }

    const messagesResult = await this.messageRepository.getMessagesByConversation(
      id,
      pagination
    );
    if (messagesResult.error) {
      return failure(messagesResult.error);
    }

    if (!messagesResult.data) {
      return failure(
        new AppError("NOT_FOUND", "The conversation is no longer available.")
      );
    }

    return success({
      conversation: conversationResult.data,
      messages: messagesResult.data,
    });
  }
}
