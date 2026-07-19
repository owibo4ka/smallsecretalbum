import { requireAdmin } from "@/lib/auth/require-admin";
import { AdminBar } from "./admin-bar";

// Reads the session, so it must render dynamically.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <>
      <AdminBar email={user.email} />
      {children}
    </>
  );
}
