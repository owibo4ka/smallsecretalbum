"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The shared header + footer that wrap every page — EXCEPT the home page, which
// is a full-bleed hero with its own overlaid header (see HomeHero). On "/" we
// render the page bare so the hero can own the whole viewport.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <>
      <header
        id="top"
        className="flex items-center justify-between gap-4 px-5 py-3"
      >
        <div className="flex items-center gap-1.5">
          <Link href="/" className="font-semibold whitespace-nowrap">
            smallsecretalbum
          </Link>
        </div>

        <nav className="flex shrink-0 items-center gap-3 font-semibold">
          <Link href="/works" className="transition-opacity hover:opacity-60">
            works
          </Link>
          <Link href="/about" className="transition-opacity hover:opacity-60">
            about
          </Link>
          <Link href="/journal" className="transition-opacity hover:opacity-60">
            journal
          </Link>
          <Link href="/prints" className="transition-opacity hover:opacity-60">
            print shop
          </Link>
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="flex items-center justify-between gap-4 px-5 pt-16 pb-5">
        <p className="leading-[1.3]">
          © smallsecretalbum, {new Date().getFullYear()} · Design by{" "}
          <a
            href="https://www.framer.com/@volodymyr-fominykh/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold transition-opacity hover:opacity-60"
          >
            Volodymyr Fominykh
          </a>
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            prefetch={false}
            className="text-ink/40 transition-colors hover:text-ink"
          >
            admin
          </Link>
          <a
            href="#top"
            className="flex items-center gap-0.5 font-semibold transition-opacity hover:opacity-60"
          >
            Back to top
            <Image
              src="/icons/icon-arrow-up.svg"
              alt=""
              width={14}
              height={14}
              unoptimized
            />
          </a>
        </div>
      </footer>
    </>
  );
}
