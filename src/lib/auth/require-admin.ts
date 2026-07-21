import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/admins";

// The single auth gate for admin pages and mutations. Unauthenticated users go
// to sign-in; authenticated non-admins go home. Returns the admin user so
// callers can use it. Runs in the Node server (pages + server actions), where
// the session cookie is read reliably — unlike the edge proxy, which failed to
// see the session on POST requests.
export async function requireAdmin() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }
  if (!isAdminEmail(session.user.email)) {
    redirect("/");
  }

  return session.user;
}
