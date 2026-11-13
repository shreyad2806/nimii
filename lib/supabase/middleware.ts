import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the user's Supabase auth session cookies in Next.js 15 middleware.
 * Follows the official @supabase/ssr pattern using getAll and setAll.
 * Also enforces route protection for /app routes.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Gracefully skip session refresh if environment variables are not yet configured
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        // Update request cookies so downstream server components receive fresh tokens
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        // Recreate response with updated request headers
        supabaseResponse = NextResponse.next({
          request,
        });

        // Set cookies on outgoing response
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });

        // Set required caching headers for auth cookies
        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        }
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser().
  // DO NOT use supabase.auth.getSession() as it is insecure on the server.
  // supabase.auth.getUser() validates the JWT against Supabase Auth.
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Graceful fallback if network is unreachable or tokens are invalid
  }

  const pathname = request.nextUrl.pathname;
  const isAppRoute = pathname.startsWith("/app");

  // Route Protection:
  // If the user navigates to /app or its subpaths without an active session,
  // redirect them to /login while preserving the intended destination.
  if (!user && isAppRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);

    const redirectResponse = NextResponse.redirect(redirectUrl);
    // Propagate any session cookies that may have been updated/cleared
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // IMPORTANT: You must return the supabaseResponse object.
  return supabaseResponse;
}
