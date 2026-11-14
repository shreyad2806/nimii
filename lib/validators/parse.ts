import { z } from "zod";
import { AppError } from "@/lib/errors/app-error";
import { failure, success, type Result } from "@/lib/errors/result";

export function parseInput<T>(
  schema: z.ZodType<T>,
  input: unknown
): Result<T> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return failure(
      new AppError("VALIDATION_ERROR", "Request validation failed.", {
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.map(String).join("."),
          message: issue.message,
        })),
      })
    );
  }

  return success(parsed.data);
}
