import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Validates that the required Supabase environment variables are available.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
      key &&
      url.trim() !== "" &&
      key.trim() !== "" &&
      !url.includes("your-project-id") &&
      !key.includes("your-supabase")
  );
}

/**
 * Creates a browser-side Supabase client using @supabase/ssr.
 * This client persists session tokens in browser cookies so that server-rendered
 * requests and server actions can authenticate requests.
 *
 * Missing environment variables are validated gracefully with informative error messages.
 */
export function createClient<Database = any>(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase configuration is incomplete. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are defined in .env.local."
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
