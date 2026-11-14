import { AppError } from "@/lib/errors/app-error";
import { failure, success, type Result } from "@/lib/errors/result";
import type { Page } from "@/lib/domain/pagination";
import type {
  Conversation,
  ConversationRepository,
  ConversationWithMessages,
  Message,
} from "@/lib/repositories/conversations/conversation.repository";
import type { MessageService } from "@/lib/services/messages/message.service";
import { parseInput } from "@/lib/validators/parse";
import {
  createConversationInputSchema,
  idSchema,
  paginationSchema,
  renameConversationInputSchema,
} from "@/lib/validators/conversation";

export type CreatedConversation = {
  conversation: Conversation;
  firstMessage: Message | null;
};

export class ConversationService {
  constructor(
    private readonly conversations: ConversationRepository,
    private readonly messages: MessageService
  ) {}

  async createConversation(input: unknown): Promise<Result<CreatedConversation>> {
    const parsedInput = parseInput(createConversationInputSchema, input);
    if (parsedInput.error) {
      return failure(parsedInput.error);
    }

    const created = await this.conversations.createConversation({
      title: parsedInput.data.title,
    });
    if (created.error) {
      return failure(created.error);
    }

    if (parsedInput.data.firstMessage === undefined) {
      return success({ conversation: created.data, firstMessage: null });
    }

    const firstMessage = await this.messages.createUserMessage(created.data.id, {
      content: parsedInput.data.firstMessage,
    });
    if (firstMessage.error) {
      const cleanup = await this.conversations.deleteConversation(created.data.id);
      if (cleanup.error || !cleanup.data) {
        console.error("Could not roll back a conversation after its first message failed.", {
          messageErrorCode: firstMessage.error.code,
          cleanupErrorCode: cleanup.error?.code ?? "NOT_DELETED",
        });
        return failure(
          new AppError(
            "DATABASE_ERROR",
            "The first message could not be saved and the new conversation could not be removed.",
            {
              cause: {
                messageError: firstMessage.error,
                cleanupError: cleanup.error,
              },
            }
          )
        );
      }

      return failure(firstMessage.error);
    }

    return success({
      conversation: created.data,
      firstMessage: firstMessage.data,
    });
  }

  async getConversationById(id: unknown): Promise<Result<Conversation>> {
    const parsedId = parseInput(idSchema, id);
    if (parsedId.error) {
      return failure(parsedId.error);
    }

    const result = await this.conversations.getConversationById(parsedId.data);
    if (result.error) {
      return failure(result.error);
    }
    if (!result.data) {
      return failure(new AppError("NOT_FOUND", "Conversation not found."));
    }

    return success(result.data);
  }

  async getUserConversations(
    input: unknown
  ): Promise<Result<Page<Conversation>>> {
    const pagination = parseInput(paginationSchema, input);
    if (pagination.error) {
      return failure(pagination.error);
    }

    return this.conversations.getUserConversations(pagination.data);
  }

  async updateConversationTitle(
    id: unknown,
    input: unknown
  ): Promise<Result<Conversation>> {
    const parsedId = parseInput(idSchema, id);
    if (parsedId.error) {
      return failure(parsedId.error);
    }

    const parsedInput = parseInput(renameConversationInputSchema, input);
    if (parsedInput.error) {
      return failure(parsedInput.error);
    }

    const result = await this.conversations.updateConversationTitle(
      parsedId.data,
      parsedInput.data.title
    );
    if (result.error) {
      return failure(result.error);
    }
    if (!result.data) {
      return failure(new AppError("NOT_FOUND", "Conversation not found."));
    }

    return success(result.data);
  }

  async deleteConversation(id: unknown): Promise<Result<{ deleted: true }>> {
    const parsedId = parseInput(idSchema, id);
    if (parsedId.error) {
      return failure(parsedId.error);
    }

    const result = await this.conversations.deleteConversation(parsedId.data);
    if (result.error) {
      return failure(result.error);
    }
    if (!result.data) {
      return failure(new AppError("NOT_FOUND", "Conversation not found."));
    }

    return success({ deleted: true });
  }

  async getConversationWithMessages(
    id: unknown,
    input: unknown
  ): Promise<Result<ConversationWithMessages>> {
    const parsedId = parseInput(idSchema, id);
    if (parsedId.error) {
      return failure(parsedId.error);
    }

    const pagination = parseInput(paginationSchema, input);
    if (pagination.error) {
      return failure(pagination.error);
    }

    const result = await this.conversations.getConversationWithMessages(
      parsedId.data,
      pagination.data
    );
    if (result.error) {
      return failure(result.error);
    }
    if (!result.data) {
      return failure(new AppError("NOT_FOUND", "Conversation not found."));
    }

    return success(result.data);
  }
}
