export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "VALIDATION_ERROR"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DATABASE_ERROR"
  | "EXTERNAL_SERVICE_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    options?: { cause?: unknown; details?: unknown }
  ) {
    super(message);
    this.name = "AppError";
    if (options && "cause" in options) {
      Object.defineProperty(this, "cause", {
        configurable: true,
        value: options.cause,
      });
    }
    this.details = options?.details;
  }

  public readonly details?: unknown;
}

export function toAppError(
  cause: unknown,
  code: AppErrorCode = "INTERNAL_ERROR",
  message = "The request could not be completed."
): AppError {
  if (cause instanceof AppError) {
    return cause;
  }

  return new AppError(code, message, { cause });
}
