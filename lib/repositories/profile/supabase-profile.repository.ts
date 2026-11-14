import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { AppError, toAppError } from "@/lib/errors/app-error";
import { failure, success } from "@/lib/errors/result";
import type { ProfileRepository } from "./profile.repository";

export class SupabaseProfileRepository implements ProfileRepository {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async getForCurrentUser() {
    try {
      const {
        data: { user },
        error: authError,
      } = await this.client.auth.getUser();

      if (authError) {
        return failure<null>(
          toAppError(authError, "UNAUTHENTICATED", "Could not verify the current user.")
        );
      }

      if (!user) {
        return failure<null>(
          new AppError("UNAUTHENTICATED", "An authenticated session is required.")
        );
      }

      const { data, error } = await this.client
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        return failure<null>(
          toAppError(error, "DATABASE_ERROR", "Could not load the current user's profile.")
        );
      }

      return success(data);
    } catch (cause) {
      return failure<null>(
        toAppError(cause, "DATABASE_ERROR", "Could not load the current user's profile.")
      );
    }
  }
}
