import { apiResponse } from "@/lib/api/response";
import { createAuthenticatedServices } from "@/lib/services/server/create-authenticated-services";

type RouteContext = {
  params: Promise<{ id: string; messageId: string }>;
};

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, context: RouteContext) {
  const authenticated = await createAuthenticatedServices();
  if (authenticated.error) {
    return apiResponse(authenticated);
  }

  const { id, messageId } = await context.params;
  return apiResponse(
    await authenticated.data.messages.deleteMessageInConversation(id, messageId)
  );
}
