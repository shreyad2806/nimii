import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/app";
  const origin = requestUrl.origin;

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv || !forwardedHost) {
          return NextResponse.redirect(`${origin}${next}`);
        } else {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        }
      } else {
        console.error("Supabase code exchange error:", error.message);
      }
    } catch (err) {
      console.error("Auth callback unexpected error:", err);
    }
  }

  // If code is missing or exchange fails, redirect to login with an error query param
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
