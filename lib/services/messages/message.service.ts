import { AppError } from "@/lib/errors/app-error";
import { failure, type Result } from "@/lib/errors/result";
import type { Page } from "@/lib/domain/pagination";
import type { Message, MessageRepository } from "@/lib/repositories/messages/message.repository";
import { parseInput } from "@/lib/validators/parse";
import {
  createMessageInputSchema,
  createUserMessageRequestSchema,
  idSchema,
  paginationSchema,
} from "@/lib/validators/conversation";

export class MessageService {
  constructor(private readonly messages: MessageRepository) {}

  async createMessage(input: unknown): Promise<Result<Message>> {
    const parsed = parseInput(createMessageInputSchema, input);
    if (parsed.error) {
      return failure(parsed.error);
    }

    return this.messages.createMessage(parsed.data);
  }

  async createUserMessage(
    conversationId: unknown,
    input: unknown
  ): Promise<Result<Message>> {
    const parsedConversationId = parseInput(idSchema, conversationId);
    if (parsedConversationId.error) {
      return failure(parsedConversationId.error);
    }

    const parsedInput = parseInput(createUserMessageRequestSchema, input);
    if (parsedInput.error) {
      return failure(parsedInput.error);
    }

    return this.createMessage({
      conversationId: parsedConversationId.data,
      role: "user",
      content: parsedInput.data.content,
    });
  }

  async getMessagesByConversation(
    conversationId: unknown,
    input: unknown
  ): Promise<Result<Page<Message>>> {
    const parsedConversationId = parseInput(idSchema, conversationId);
    if (parsedConversationId.error) {
      return failure(parsedConversationId.error);
    }

    const pagination = parseInput(paginationSchema, input);
    if (pagination.error) {
      return failure(pagination.error);
    }

    const result = await this.messages.getMessagesByConversation(
      parsedConversationId.data,
      pagination.data
    );
    if (result.error) {
      return failure(result.error);
    }
    if (!result.data) {
      return failure(new AppError("NOT_FOUND", "Conversation not found."));
    }

    return { data: result.data, error: null };
  }

  async getMessageById(id: unknown): Promise<Result<Message>> {
    const parsedId = parseInput(idSchema, id);
    if (parsedId.error) {
      return failure(parsedId.error);
    }

    const result = await this.messages.getMessageById(parsedId.data);
    if (result.error) {
      return failure(result.error);
    }
    if (!result.data) {
      return failure(new AppError("NOT_FOUND", "Message not found."));
    }

    return { data: result.data, error: null };
  }

  async deleteMessage(id: unknown): Promise<Result<{ deleted: true }>> {
    const parsedId = parseInput(idSchema, id);
    if (parsedId.error) {
      return failure(parsedId.error);
    }

    return this.deleteMessageRecord(parsedId.data);
  }

  private async deleteMessageRecord(
    id: string
  ): Promise<Result<{ deleted: true }>> {
    const result = await this.messages.deleteMessage(id);
    if (result.error) {
      return failure(result.error);
    }
    if (!result.data) {
      return failure(new AppError("NOT_FOUND", "Message not found."));
    }

    return { data: { deleted: true }, error: null };
  }

  async deleteMessageInConversation(
    conversationId: unknown,
    messageId: unknown
  ): Promise<Result<{ deleted: true }>> {
    const parsedConversationId = parseInput(idSchema, conversationId);
    if (parsedConversationId.error) {
      return failure(parsedConversationId.error);
    }

    const message = await this.getMessageById(messageId);
    if (message.error) {
      return failure(message.error);
    }
    if (message.data.conversation_id !== parsedConversationId.data) {
      return failure(new AppError("NOT_FOUND", "Message not found."));
    }

    return this.deleteMessageRecord(message.data.id);
  }
}
