// NOTE: real authentication now lives in the signed httpOnly session cookie
// (see lib/session.ts, lib/auth.ts, middleware.ts and the /api/auth/* routes).
// This file only keeps the cosmetic profile draft in localStorage.

const PROFILE_KEY = "gh_profile";

export type Profile = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export function getProfile(): Partial<Profile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Profile>) : {};
  } catch {
    return {};
  }
}

export function saveProfile(profile: Partial<Profile>) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}
