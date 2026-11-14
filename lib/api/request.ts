import { AppError } from "@/lib/errors/app-error";
import { failure, success, type Result } from "@/lib/errors/result";

export async function readJsonBody(request: Request): Promise<Result<unknown>> {
  try {
    return success(await request.json());
  } catch (cause) {
    return failure(
      new AppError("VALIDATION_ERROR", "Request body must be valid JSON.", {
        cause,
      })
    );
  }
}

export function getPaginationInput(request: Request): Record<string, string> {
  const params = new URL(request.url).searchParams;
  const input: Record<string, string> = {};

  for (const key of ["limit", "offset"]) {
    const value = params.get(key);
    if (value !== null) {
      input[key] = value;
    }
  }

  return input;
}
