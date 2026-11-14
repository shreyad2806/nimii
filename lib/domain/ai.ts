import type { MessageRole } from "@/types/database.types";

export type AIMessage = {
  role: Exclude<MessageRole, "tool">;
  content: string;
};

export type AIRequest = {
  messages: AIMessage[];
  signal?: AbortSignal;
};

export type AIStreamEvent =
  | { type: "delta"; text: string }
  | { type: "completed"; responseId?: string }
  | { type: "failed"; error: Error };

export interface AIProvider {
  stream(request: AIRequest): AsyncIterable<AIStreamEvent>;
}
