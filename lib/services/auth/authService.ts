import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import type { Profile } from "@/lib/domain/types";
import { SupabaseProfileRepository } from "@/lib/repositories/profile/supabase-profile.repository";
import { failure, type Result } from "@/lib/errors/result";
import { AppError } from "@/lib/errors/app-error";

export interface AuthResponse<T = any> {
  data: T | null;
  error: string | null;
}

/**
 * Authentication Service for Nimii
 * Handles guest anonymous sessions, email signup/login, Google OAuth initialization,
 * and guest-to-permanent account conversion.
 */
class AuthService {
  /**
   * Check if Supabase client is configured with environment variables
   */
  public isConfigured(): boolean {
    return isSupabaseConfigured();
  }

  /**
   * Get the current authenticated user from Supabase session
   */
  public async getCurrentUser(): Promise<{
    user: User | null;
    isAnonymous: boolean;
  }> {
    if (!this.isConfigured()) {
      return { user: null, isAnonymous: false };
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        return { user: null, isAnonymous: false };
      }
      return {
        user: data.user,
        isAnonymous: Boolean(data.user.is_anonymous),
      };
    } catch {
      return { user: null, isAnonymous: false };
    }
  }

  /**
   * Sign in anonymously as a guest.
   * Detects and reuses an existing valid anonymous session to avoid creating
   * duplicate guest records on repeated visits or page reloads.
   */
  public async signInAsGuest(): Promise<{
    user: User | null;
    error: string | null;
    reused: boolean;
  }> {
    if (!this.isConfigured()) {
      return {
        user: null,
        error: "Supabase credentials are not configured. Operating in local fallback mode.",
        reused: false,
      };
    }

    try {
      const supabase = createClient();

      // Check if a valid session already exists
      const { data: existingData } = await supabase.auth.getUser();
      if (existingData?.user) {
        if (existingData.user.is_anonymous) {
          // Reuse existing anonymous session
          return { user: existingData.user, error: null, reused: true };
        } else {
          // User is already signed in with a permanent account
          return { user: existingData.user, error: null, reused: true };
        }
      }

      // Create a new real anonymous user
      const { data, error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            full_name: "Guest Explorer",
            display_name: "Guest Explorer",
          },
        },
      });

      if (error) {
        return { user: null, error: error.message, reused: false };
      }

      return { user: data.user, error: null, reused: false };
    } catch (err: any) {
      return {
        user: null,
        error: err?.message || "An unexpected error occurred during guest sign-in.",
        reused: false,
      };
    }
  }

  /**
   * Sign up with email and password
   */
  public async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{
    user: User | null;
    session: Session | null;
    needsEmailConfirmation: boolean;
    error: string | null;
  }> {
    if (!this.isConfigured()) {
      return {
        user: null,
        session: null,
        needsEmailConfirmation: false,
        error: "Supabase is not configured.",
      };
    }

    // Input validations
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return {
        user: null,
        session: null,
        needsEmailConfirmation: false,
        error: "Please enter a valid email address.",
      };
    }

    if (!password || password.length < 6) {
      return {
        user: null,
        session: null,
        needsEmailConfirmation: false,
        error: "Password must be at least 6 characters long.",
      };
    }

    try {
      const supabase = createClient();
      const redirectOrigin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: displayName?.trim() || cleanEmail.split("@")[0],
            display_name: displayName?.trim() || cleanEmail.split("@")[0],
          },
          emailRedirectTo: `${redirectOrigin}/auth/callback?next=/app`,
        },
      });

      if (error) {
        return {
          user: null,
          session: null,
          needsEmailConfirmation: false,
          error: error.message,
        };
      }

      // Check if email confirmation is required
      const needsConfirmation = Boolean(data.user && !data.session);

      return {
        user: data.user,
        session: data.session,
        needsEmailConfirmation: needsConfirmation,
        error: null,
      };
    } catch (err: any) {
      return {
        user: null,
        session: null,
        needsEmailConfirmation: false,
        error: err?.message || "An error occurred during sign up.",
      };
    }
  }

  /**
   * Sign in with existing email and password
   */
  public async signInWithEmail(
    email: string,
    password: string
  ): Promise<{
    user: User | null;
    session: Session | null;
    error: string | null;
  }> {
    if (!this.isConfigured()) {
      return {
        user: null,
        session: null,
        error: "Supabase is not configured.",
      };
    }

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return { user: null, session: null, error: "Please enter your email." };
    }
    if (!password) {
      return { user: null, session: null, error: "Please enter your password." };
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      return {
        user: null,
        session: null,
        error: err?.message || "An error occurred during sign in.",
      };
    }
  }

  /**
   * Initiate Google OAuth sign in
   */
  public async signInWithGoogle(): Promise<{ error: string | null }> {
    if (!this.isConfigured()) {
      return { error: "Supabase is not configured." };
    }

    try {
      const supabase = createClient();
      const redirectOrigin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectOrigin}/auth/callback?next=/app`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err: any) {
      return { error: err?.message || "Failed to initiate Google OAuth." };
    }
  }

  /**
   * Guest-to-Account Conversion:
   * Upgrades an existing anonymous session to a permanent email/password account.
   * This retains the current auth.uid() and prevents any loss of guest data!
   */
  public async linkGuestToAccount(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ user: User | null; error: string | null }> {
    if (!this.isConfigured()) {
      return { user: null, error: "Supabase is not configured." };
    }

    try {
      const supabase = createClient();
      const cleanEmail = email.trim();

      const { data, error } = await supabase.auth.updateUser({
        email: cleanEmail,
        password,
        data: {
          full_name: displayName?.trim() || cleanEmail.split("@")[0],
          display_name: displayName?.trim() || cleanEmail.split("@")[0],
          is_anonymous: false,
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch (err: any) {
      return {
        user: null,
        error: err?.message || "Failed to convert guest account.",
      };
    }
  }

  /**
   * Fetch user profile from public.profiles
   */
  public async getProfile(): Promise<Result<Profile | null>> {
    if (!this.isConfigured()) {
      return failure(
        new AppError("DATABASE_ERROR", "Supabase is not configured.")
      );
    }

    return new SupabaseProfileRepository(createClient()).getForCurrentUser();
  }

  /**
   * Sign out the active user and purge session cookies
   */
  public async signOut(): Promise<{ error: string | null }> {
    if (!this.isConfigured()) {
      return { error: null };
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || "An error occurred during sign out." };
    }
  }
}

export const authService = new AuthService();
