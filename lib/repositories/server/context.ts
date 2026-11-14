import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserId } from "@/lib/domain/types";
import type { Database } from "@/types/database.types";

export type AuthenticatedSupabaseContext = {
  client: SupabaseClient<Database>;
  userId: UserId;
};
