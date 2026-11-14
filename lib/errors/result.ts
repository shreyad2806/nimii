import type { AppError } from "./app-error";

export type Result<T> =
  | { data: T; error: null }
  | { data: null; error: AppError };

export function success<T>(data: T): Result<T> {
  return { data, error: null };
}

export function failure<T = never>(error: AppError): Result<T> {
  return { data: null, error };
}
