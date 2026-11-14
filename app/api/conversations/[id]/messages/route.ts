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
  const result = await authenticated.data.messages.getMessagesByConversation(
    id,
    getPaginationInput(request)
  );
  return apiResponse(result);
}

export async function POST(request: Request, context: RouteContext) {
  const authenticated = await createAuthenticatedServices();
  if (authenticated.error) {
    return apiResponse(authenticated);
  }

  const { id } = await context.params;
  const body = await readJsonBody(request);
  if (body.error) {
    return apiResponse(body);
  }

  const result = await authenticated.data.messages.createUserMessage(
    id,
    body.data
  );
  return apiResponse(result, 201);
}
