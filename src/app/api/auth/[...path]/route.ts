import { auth } from "@/lib/auth/server";

// Proxies all client auth requests (sign-in, sign-up, get-session, sign-out…)
// to Neon Auth. Lives at /api/auth/* because the client SDK posts here.
export const { GET, POST } = auth.handler();
