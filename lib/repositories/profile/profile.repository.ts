import type { Profile } from "@/lib/domain/types";
import type { Result } from "@/lib/errors/result";

export interface ProfileRepository {
  getForCurrentUser(): Promise<Result<Profile | null>>;
}
