import { SignJWT, jwtVerify, type JWTPayload } from "jose";

// Session payload stored (signed) in an httpOnly cookie.
export type SessionData = {
  uid: string;
  role: "USER" | "ADMIN";
  name: string;
  email: string;
};

export const SESSION_COOKIE = "gh_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    (process.env.NODE_ENV !== "production"
      ? "dev-only-insecure-secret-change-me"
      : "");
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

/** Sign a session token (Edge + Node compatible). */
export async function signSession(data: SessionData): Promise<string> {
  return new SignJWT({ ...data } as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

/** Verify a session token; returns null if missing/invalid/expired. */
export async function verifySession(
  token: string | undefined | null,
): Promise<SessionData | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (
      typeof payload.uid === "string" &&
      (payload.role === "USER" || payload.role === "ADMIN") &&
      typeof payload.name === "string" &&
      typeof payload.email === "string"
    ) {
      return {
        uid: payload.uid,
        role: payload.role,
        name: payload.name,
        email: payload.email,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
