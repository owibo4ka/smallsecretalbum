"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function AdminBar({ email }: { email: string }) {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between border-b border-ink/10 px-5 py-2 text-ink/60">
      <span>Signed in as {email}</span>
      <button
        type="button"
        onClick={signOut}
        className="font-semibold underline transition-opacity hover:opacity-70"
      >
        Sign out
      </button>
    </div>
  );
}
