import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { apiResponse } from "@/lib/api/response";
import { AppError } from "@/lib/errors/app-error";
import { failure } from "@/lib/errors/result";
import { SupabaseConversationRepository } from "@/lib/repositories/conversations/supabase-conversation.repository";
import { SupabaseMessageRepository } from "@/lib/repositories/messages/supabase-message.repository";
import type { AuthenticatedSupabaseContext } from "@/lib/repositories/server/context";
import type { Database } from "@/types/database.types";
import { createAuthenticatedServices } from "@/lib/services/server/create-authenticated-services";
import { createClient } from "@/lib/supabase/server";
import { SupabaseQuerySpy, type QueryCall } from "./supabase-query-spy";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

function fakeContext(
  userId: string,
  queryOptions: {
    singleData?: (call: QueryCall) => unknown;
    listData?: (call: QueryCall) => unknown[];
    count?: number;
  } = {}
): { context: AuthenticatedSupabaseContext; calls: QueryCall[] } {
  const calls: QueryCall[] = [];
  const client = {
    from(table: string) {
      const query = new SupabaseQuerySpy(table, queryOptions);
      calls.push(query.call);
      return query;
    },
  };

  return {
    context: {
      client: client as unknown as SupabaseClient<Database>,
      userId,
    },
    calls,
  };
}

describe("Supabase repository ownership scope", () => {
  it("filters conversation reads by the authenticated owner", async () => {
    const foreignConversation = {
      id: "00000000-0000-4000-8000-000000000010",
      user_id: "another-user",
    };
    const { context, calls } = fakeContext("registered-user", {
      singleData: (call) =>
        call.filters.some(
          ([column, value]) =>
            column === "user_id" && value === "registered-user"
        )
          ? null
          : foreignConversation,
    });
    const messages = new SupabaseMessageRepository(context);
    const repository = new SupabaseConversationRepository(context, messages);

    const result = await repository.getConversationById(
      "00000000-0000-4000-8000-000000000010"
    );

    expect(result.data).toBeNull();
    expect(calls[0].filters).toEqual([
      ["id", "00000000-0000-4000-8000-000000000010"],
      ["user_id", "registered-user"],
    ]);
  });

  it("uses the current guest identity as the list owner", async () => {
    const { context, calls } = fakeContext("anonymous-guest");
    const messages = new SupabaseMessageRepository(context);
    const repository = new SupabaseConversationRepository(context, messages);

    await repository.getUserConversations({ limit: 10, offset: 20 });

    expect(calls[0].filters).toContainEqual(["user_id", "anonymous-guest"]);
    expect(calls[0].orders).toEqual([
      { column: "updated_at", ascending: false },
      { column: "id", ascending: false },
    ]);
    expect(calls[0].range).toEqual([20, 29]);
  });

  it("does not attempt message insertion when the conversation is not owned", async () => {
    const { context, calls } = fakeContext("user-a", {
      singleData: (call) =>
        call.filters.some(
          ([column, value]) => column === "user_id" && value === "user-a"
        )
          ? null
          : { id: "00000000-0000-4000-8000-000000000011" },
    });
    const repository = new SupabaseMessageRepository(context);

    const result = await repository.createMessage({
      conversationId: "00000000-0000-4000-8000-000000000011",
      role: "user",
      content: "Hello",
    });

    expect(result.error?.code).toBe("NOT_FOUND");
    expect(calls.map((call) => call.table)).toEqual(["conversations"]);
    expect(calls[0].filters).toContainEqual(["user_id", "user-a"]);
  });

  it("orders messages by timestamp and stable id while paginating", async () => {
    const { context, calls } = fakeContext("user-b", {
      singleData: (call) =>
        call.table === "conversations" ? { id: "conversation-id" } : null,
    });
    const repository = new SupabaseMessageRepository(context);

    const result = await repository.getMessagesByConversation(
      "conversation-id",
      { limit: 15, offset: 30 }
    );

    expect(result.data?.items).toEqual([]);
    expect(calls[0].filters).toContainEqual(["user_id", "user-b"]);
    expect(calls[1].orders).toEqual([
      { column: "created_at", ascending: true },
      { column: "id", ascending: true },
    ]);
    expect(calls[1].range).toEqual([30, 44]);
  });

  it("maps unauthenticated errors to HTTP 401 without leaking causes", async () => {
    const response = apiResponse(
      failure(new AppError("UNAUTHENTICATED", "Authentication is required."))
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      data: null,
      error: {
        code: "UNAUTHENTICATED",
        message: "Authentication is required.",
      },
    });
  });

  it("maps invalid input and missing resources to 400 and 404", async () => {
    const invalidInput = apiResponse(
      failure(new AppError("VALIDATION_ERROR", "Request validation failed."))
    );
    const missingResource = apiResponse(
      failure(new AppError("NOT_FOUND", "Conversation not found."))
    );

    expect(invalidInput.status).toBe(400);
    expect(missingResource.status).toBe(404);
  });

  it("rejects requests with no authenticated user", async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: async () => ({
          data: { user: null },
          error: null,
        }),
      },
    } as unknown as SupabaseClient<Database>);

    const result = await createAuthenticatedServices();

    expect(result.error?.code).toBe("UNAUTHENTICATED");
    expect(apiResponse(result).status).toBe(401);
  });

  it("does not expose internal database error messages", async () => {
    const response = apiResponse(
      failure(
        new AppError("DATABASE_ERROR", "private SQL and server details")
      )
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      data: null,
      error: {
        code: "DATABASE_ERROR",
        message: "The request could not be completed.",
      },
    });
  });
});
