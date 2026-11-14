import { NextResponse } from "next/server";
import type { AppError } from "@/lib/errors/app-error";
import type { Result } from "@/lib/errors/result";

type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: ApiError };

function getStatusCode(error: AppError): number {
  switch (error.code) {
    case "VALIDATION_ERROR":
      return 400;
    case "UNAUTHENTICATED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    default:
      return 500;
  }
}

function getPublicMessage(error: AppError): string {
  switch (error.code) {
    case "UNAUTHENTICATED":
      return "Authentication is required.";
    case "FORBIDDEN":
      return "You do not have permission to perform this action.";
    case "NOT_FOUND":
      return "The requested resource was not found.";
    case "VALIDATION_ERROR":
      return error.message;
    case "CONFLICT":
      return error.message;
    default:
      return "The request could not be completed.";
  }
}

export function apiResponse<T>(
  result: Result<T>,
  successStatus = 200
): NextResponse<ApiResponse<T>> {
  if (result.error) {
    const error: ApiError = {
      code: result.error.code,
      message: getPublicMessage(result.error),
    };
    if (
      result.error.code === "VALIDATION_ERROR" &&
      result.error.details !== undefined
    ) {
      error.details = result.error.details;
    }

    return NextResponse.json(
      { data: null, error },
      { status: getStatusCode(result.error) }
    );
  }

  return NextResponse.json(
    { data: result.data, error: null },
    { status: successStatus }
  );
}
