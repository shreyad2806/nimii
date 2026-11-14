import { z } from "zod";
import type { MessageRole } from "@/types/database.types";

export const conversationTitleSchema = z.string().trim().min(1).max(255);
export const messageContentSchema = z.string().trim().min(1);
export const messageRoleSchema = z.enum([
  "system",
  "user",
  "assistant",
  "tool",
] satisfies [MessageRole, ...MessageRole[]]);

export const paginationSchema = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export const idSchema = z.uuid();

export const createConversationInputSchema = z.strictObject({
  title: conversationTitleSchema.optional(),
  firstMessage: messageContentSchema.optional(),
});

export const renameConversationInputSchema = z.strictObject({
  title: conversationTitleSchema,
});

export const createMessageInputSchema = z.strictObject({
  conversationId: z.uuid(),
  role: messageRoleSchema,
  content: messageContentSchema,
});

export const createUserMessageRequestSchema = z.strictObject({
  content: messageContentSchema,
});

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>;
