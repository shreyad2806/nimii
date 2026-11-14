import { apiResponse } from "@/lib/api/response";
import { getPaginationInput, readJsonBody } from "@/lib/api/request";
import { createAuthenticatedServices } from "@/lib/services/server/create-authenticated-services";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: RouteContext) {
  const authenticated = await createAuthenticatedServices();
  if (authenticated.error) {
    return apiResponse(authenticated);
  }

  const { id } = await context.params;
  const result = await authenticated.data.conversations.getConversationWithMessages(
    id,
    getPaginationInput(request)
  );
  return apiResponse(result);
}

export async function PATCH(request: Request, context: RouteContext) {
  const authenticated = await createAuthenticatedServices();
  if (authenticated.error) {
    return apiResponse(authenticated);
  }

  const { id } = await context.params;
  const body = await readJsonBody(request);
  if (body.error) {
    return apiResponse(body);
  }

  const result = await authenticated.data.conversations.updateConversationTitle(
    id,
    body.data
  );
  return apiResponse(result);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authenticated = await createAuthenticatedServices();
  if (authenticated.error) {
    return apiResponse(authenticated);
  }

  const { id } = await context.params;
  const result = await authenticated.data.conversations.deleteConversation(id);
  return apiResponse(result);
}
