import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { AdminBar } from "./admin-bar";

// Reads the session, so it must render dynamically.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();

  // The proxy already blocks unauthenticated users; this adds authorization:
  // only the configured admin email may see /admin.
  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <>
      <AdminBar email={session.user.email} />
      {children}
    </>
  );
}
