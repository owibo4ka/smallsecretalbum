import { createNeonAuth } from "@neondatabase/auth/next/server";

// Single server-side auth instance. Exposes Better Auth server methods plus
// .handler() (for the API route) and .middleware() (for the proxy).
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
