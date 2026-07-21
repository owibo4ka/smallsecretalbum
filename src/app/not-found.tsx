import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nothing here — smallsecretalbum",
};

// The 404 page. Renders inside the global chrome (header + footer) since the
// path is never "/". Kept light and on-brand.
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/40">
        404
      </p>
      <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
        Nothing to see here.
      </h1>
      <p className="mt-3 text-lg text-ink/60">
        Take your camera and go shoot! 📷
      </p>
      <Link
        href="/"
        className="mt-8 rounded bg-ink px-6 py-2.5 font-semibold text-paper transition-opacity hover:opacity-80"
      >
        OK
      </Link>
    </main>
  );
}
