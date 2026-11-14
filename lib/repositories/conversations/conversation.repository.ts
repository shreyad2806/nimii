import type { Page, Pagination } from "@/lib/domain/pagination";
import type { TableRow } from "@/lib/domain/types";
import type { Result } from "@/lib/errors/result";

export type Conversation = TableRow<"conversations">;
export type Message = TableRow<"messages">;

export type ConversationWithMessages = {
  conversation: Conversation;
  messages: Page<Message>;
};

export interface ConversationRepository {
  createConversation(input: { title?: string }): Promise<Result<Conversation>>;
  getConversationById(id: string): Promise<Result<Conversation | null>>;
  getUserConversations(pagination: Pagination): Promise<Result<Page<Conversation>>>;
  updateConversationTitle(
    id: string,
    title: string
  ): Promise<Result<Conversation | null>>;
  deleteConversation(id: string): Promise<Result<boolean>>;
  getConversationWithMessages(
    id: string,
    pagination: Pagination
  ): Promise<Result<ConversationWithMessages | null>>;
}
