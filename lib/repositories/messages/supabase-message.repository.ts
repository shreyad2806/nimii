import "server-only";
import { AppError, toAppError } from "@/lib/errors/app-error";
import { createPage, type Page, type Pagination } from "@/lib/domain/pagination";
import { failure, success, type Result } from "@/lib/errors/result";
import type { AuthenticatedSupabaseContext } from "@/lib/repositories/server/context";
import type { Message, MessageRepository, NewMessage } from "./message.repository";

export class SupabaseMessageRepository implements MessageRepository {
  constructor(private readonly context: AuthenticatedSupabaseContext) {}

  async createMessage(input: NewMessage): Promise<Result<Message>> {
    const ownership = await this.getOwnedConversation(input.conversationId);
    if (ownership.error) {
      return failure(ownership.error);
    }
    if (!ownership.data) {
      return failure(new AppError("NOT_FOUND", "Conversation not found."));
    }

    try {
      const { data, error } = await this.context.client
        .from("messages")
        .insert({
          conversation_id: input.conversationId,
          role: input.role,
          content: input.content,
        })
        .select("*")
        .single();

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not save the message.")
        );
      }

      return success(data);
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not save the message.")
      );
    }
  }

  async getMessagesByConversation(
    conversationId: string,
    pagination: Pagination
  ): Promise<Result<Page<Message> | null>> {
    const ownership = await this.getOwnedConversation(conversationId);
    if (ownership.error) {
      return failure(ownership.error);
    }
    if (!ownership.data) {
      return success(null);
    }

    try {
      const { data, error, count } = await this.context.client
        .from("messages")
        .select("*", { count: "exact" })
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(pagination.offset, pagination.offset + pagination.limit - 1);

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not load conversation messages.")
        );
      }

      return success(createPage(data ?? [], count ?? 0, pagination));
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not load conversation messages.")
      );
    }
  }

  async getMessageById(id: string): Promise<Result<Message | null>> {
    try {
      const { data, error } = await this.context.client
        .from("messages")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not load the message.")
        );
      }
      if (!data) {
        return success(null);
      }

      const ownership = await this.getOwnedConversation(data.conversation_id);
      if (ownership.error) {
        return failure(ownership.error);
      }

      return success(ownership.data ? data : null);
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not load the message.")
      );
    }
  }

  async deleteMessage(id: string): Promise<Result<boolean>> {
    const messageResult = await this.getMessageById(id);
    if (messageResult.error) {
      return failure(messageResult.error);
    }
    if (!messageResult.data) {
      return success(false);
    }

    try {
      const { data, error } = await this.context.client
        .from("messages")
        .delete()
        .eq("id", id)
        .eq("conversation_id", messageResult.data.conversation_id)
        .select("id")
        .maybeSingle();

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not delete the message.")
        );
      }

      return success(data !== null);
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not delete the message.")
      );
    }
  }

  private async getOwnedConversation(
    conversationId: string
  ): Promise<Result<boolean>> {
    try {
      const { data, error } = await this.context.client
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .eq("user_id", this.context.userId)
        .maybeSingle();

      if (error) {
        return failure(
          toAppError(error, "DATABASE_ERROR", "Could not verify conversation access.")
        );
      }

      return success(data !== null);
    } catch (cause) {
      return failure(
        toAppError(cause, "DATABASE_ERROR", "Could not verify conversation access.")
      );
    }
  }
}
