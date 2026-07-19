import { auth } from "@/lib/auth/server";

// In Next.js 16, Middleware is called Proxy (same behavior). This redirects
// unauthenticated visitors of /admin to the sign-in page. The admin layout
// then does the authorization check (correct email).
export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
  matcher: ["/admin/:path*"],
};
