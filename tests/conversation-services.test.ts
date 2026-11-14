import { describe, expect, it, vi } from "vitest";
import { createPage } from "@/lib/domain/pagination";
import { AppError } from "@/lib/errors/app-error";
import { failure, success } from "@/lib/errors/result";
import type {
  Conversation,
  ConversationRepository,
} from "@/lib/repositories/conversations/conversation.repository";
import type {
  Message,
  MessageRepository,
} from "@/lib/repositories/messages/message.repository";
import { ConversationService } from "@/lib/services/conversations/conversation.service";
import { MessageService } from "@/lib/services/messages/message.service";

const conversation: Conversation = {
  id: "00000000-0000-4000-8000-000000000001",
  user_id: "owner-id",
  title: "New Conversation",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const userMessage: Message = {
  id: "00000000-0000-4000-8000-000000000002",
  conversation_id: conversation.id,
  role: "user",
  content: "Remember this",
  metadata: {},
  created_at: "2026-01-01T00:00:01.000Z",
};

function makeServices() {
  const conversationRepository: ConversationRepository = {
    createConversation: vi.fn(async (input) =>
      success({ ...conversation, ...input })
    ),
    getConversationById: vi.fn(async () => success(conversation)),
    getUserConversations: vi.fn(async (pagination) =>
      success(createPage([conversation], 1, pagination))
    ),
    updateConversationTitle: vi.fn(async (_id, title) =>
      success({ ...conversation, title })
    ),
    deleteConversation: vi.fn(async () => success(true)),
    getConversationWithMessages: vi.fn(async (_id, pagination) =>
      success({
        conversation,
        messages: createPage<Message>([], 0, pagination),
      })
    ),
  };
  const messageRepository: MessageRepository = {
    createMessage: vi.fn(async (input) =>
      success({ ...userMessage, ...input })
    ),
    getMessagesByConversation: vi.fn(async (_id, pagination) =>
      success(createPage<Message>([], 0, pagination))
    ),
    getMessageById: vi.fn(async () => success(userMessage)),
    deleteMessage: vi.fn(async () => success(true)),
  };
  const messageService = new MessageService(messageRepository);
  return {
    conversationRepository,
    messageRepository,
    messageService,
    conversationService: new ConversationService(
      conversationRepository,
      messageService
    ),
  };
}

describe("ConversationService", () => {
  it("creates a conversation with only the first user message", async () => {
    const services = makeServices();

    const result = await services.conversationService.createConversation({
      title: "Planning",
      firstMessage: "Remember this",
    });

    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({
      conversation: { title: "Planning" },
      firstMessage: { role: "user", content: "Remember this" },
    });
    expect(services.conversationRepository.createConversation).toHaveBeenCalledWith(
      { title: "Planning" }
    );
    expect(services.messageRepository.createMessage).toHaveBeenCalledWith({
      conversationId: conversation.id,
      role: "user",
      content: "Remember this",
    });
  });

  it("removes a newly-created conversation if the first message cannot be saved", async () => {
    const services = makeServices();
    vi.mocked(services.messageRepository.createMessage).mockResolvedValue(
      failure(new AppError("DATABASE_ERROR", "Could not save the message."))
    );

    const result = await services.conversationService.createConversation({
      firstMessage: "Hello",
    });

    expect(result.error?.code).toBe("DATABASE_ERROR");
    expect(services.conversationRepository.deleteConversation).toHaveBeenCalledWith(
      conversation.id
    );
  });

  it("rejects invalid payloads before creating a conversation", async () => {
    const services = makeServices();

    const result = await services.conversationService.createConversation({
      title: " ",
      user_id: "untrusted-owner",
    });

    expect(result.error?.code).toBe("VALIDATION_ERROR");
    expect(services.conversationRepository.createConversation).not.toHaveBeenCalled();
  });

  it("returns empty message pages for an empty conversation", async () => {
    const services = makeServices();

    const result = await services.conversationService.getConversationWithMessages(
      conversation.id,
      { limit: 20, offset: 0 }
    );

    expect(result.error).toBeNull();
    expect(result.data?.messages.items).toEqual([]);
    expect(result.data?.messages.total).toBe(0);
    expect(result.data?.messages.hasMore).toBe(false);
  });

  it("renames a conversation and rejects blank titles", async () => {
    const services = makeServices();

    const renamed = await services.conversationService.updateConversationTitle(
      conversation.id,
      { title: "Updated title" }
    );
    const invalid = await services.conversationService.updateConversationTitle(
      conversation.id,
      { title: "   " }
    );

    expect(renamed.data?.title).toBe("Updated title");
    expect(invalid.error?.code).toBe("VALIDATION_ERROR");
    expect(services.conversationRepository.updateConversationTitle).toHaveBeenCalledTimes(
      1
    );
  });

  it("deletes a conversation through the repository", async () => {
    const services = makeServices();

    const result = await services.conversationService.deleteConversation(
      conversation.id
    );

    expect(result.data).toEqual({ deleted: true });
    expect(services.conversationRepository.deleteConversation).toHaveBeenCalledWith(
      conversation.id
    );
  });
});

describe("MessageService", () => {
  it("accepts user and assistant database roles for server-side message creation", async () => {
    const services = makeServices();

    const user = await services.messageService.createMessage({
      conversationId: conversation.id,
      role: "user",
      content: "Hi",
    });
    const assistant = await services.messageService.createMessage({
      conversationId: conversation.id,
      role: "assistant",
      content: "Hello",
    });

    expect(user.data?.role).toBe("user");
    expect(assistant.data?.role).toBe("assistant");
  });

  it("does not allow a public user-message request to choose its role", async () => {
    const services = makeServices();

    const result = await services.messageService.createUserMessage(
      conversation.id,
      { content: "Hello", role: "assistant" }
    );

    expect(result.error?.code).toBe("VALIDATION_ERROR");
    expect(services.messageRepository.createMessage).not.toHaveBeenCalled();
  });

  it("rejects blank message content", async () => {
    const services = makeServices();

    const result = await services.messageService.createUserMessage(
      conversation.id,
      { content: "  " }
    );

    expect(result.error?.code).toBe("VALIDATION_ERROR");
    expect(services.messageRepository.createMessage).not.toHaveBeenCalled();
  });
});
