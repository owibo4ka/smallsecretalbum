"use client";

import Link from "next/link";
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
    <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-2 text-ink/60">
      <nav className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          prefetch={false}
          className="font-semibold hover:text-ink"
        >
          Posts
        </Link>
        <Link
          href="/admin/gallery"
          prefetch={false}
          className="font-semibold hover:text-ink"
        >
          Gallery
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">Signed in as {email}</span>
        <button
          type="button"
          onClick={signOut}
          className="font-semibold underline transition-opacity hover:opacity-70"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
