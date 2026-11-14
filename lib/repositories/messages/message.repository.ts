import type { Page, Pagination } from "@/lib/domain/pagination";
import type { TableRow } from "@/lib/domain/types";
import type { MessageRole } from "@/types/database.types";
import type { Result } from "@/lib/errors/result";

export type Message = TableRow<"messages">;

export type NewMessage = {
  conversationId: string;
  role: MessageRole;
  content: string;
};

export interface MessageRepository {
  createMessage(input: NewMessage): Promise<Result<Message>>;
  getMessagesByConversation(
    conversationId: string,
    pagination: Pagination
  ): Promise<Result<Page<Message> | null>>;
  getMessageById(id: string): Promise<Result<Message | null>>;
  deleteMessage(id: string): Promise<Result<boolean>>;
}
