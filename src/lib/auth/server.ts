import { createNeonAuth } from "@neondatabase/auth/next/server";

// Single server-side auth instance. Exposes Better Auth server methods plus
// .handler() (for the API route) and .middleware() (for the proxy).
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    // The session-data cookie is a cache that getSession() reads. It defaults
    // to 5 min and is normally refreshed by Neon's middleware — but that
    // middleware broke server actions, so we removed it. Instead we let the
    // cache live as long as the underlying session (7 days), so a signed-in
    // admin isn't bounced mid-session. Signing out still clears it.
    sessionDataTtl: 60 * 60 * 24 * 7,
  },
});
