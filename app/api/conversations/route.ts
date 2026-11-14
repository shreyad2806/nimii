import { apiResponse } from "@/lib/api/response";
import { getPaginationInput, readJsonBody } from "@/lib/api/request";
import { createAuthenticatedServices } from "@/lib/services/server/create-authenticated-services";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authenticated = await createAuthenticatedServices();
  if (authenticated.error) {
    return apiResponse(authenticated);
  }

  const result = await authenticated.data.conversations.getUserConversations(
    getPaginationInput(request)
  );
  return apiResponse(result);
}

export async function POST(request: Request) {
  const authenticated = await createAuthenticatedServices();
  if (authenticated.error) {
    return apiResponse(authenticated);
  }

  const body = await readJsonBody(request);
  if (body.error) {
    return apiResponse(body);
  }

  const result = await authenticated.data.conversations.createConversation(
    body.data
  );
  return apiResponse(result, 201);
}
