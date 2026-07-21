"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/categories";

export type HeroPhoto = {
  id: string;
  url: string;
  category: string | null;
  alt: string | null;
};

const ROTATE_MS = 6000;

// The full-viewport home screen: a background photo that auto-rotates through
// the featured photos, a thumbnail strip to jump between them, the site title,
// and the active photo's category label. Matches the Figma home design across
// desktop / tablet / phone.
export function HomeHero({ photos }: { photos: HeroPhoto[] }) {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-advance through the featured photos.
  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % photos.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [photos.length]);

  if (photos.length === 0) {
    return (
      <section className="flex h-dvh items-center justify-center bg-ink p-6 text-center text-paper">
        <p className="max-w-md text-[20px] leading-snug">
          No featured photos yet. Mark a few with the ★ in{" "}
          <Link href="/admin/gallery" className="underline">
            Manage gallery
          </Link>{" "}
          to fill the home screen.
        </p>
      </section>
    );
  }

  const current = photos[active];
  const label = categoryLabel(current.category);

  const navLinks = (
    <>
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
    </>
  );

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-ink text-paper">
      {/* Background photos, crossfading between the active one and the rest. */}
      {photos.map((photo, i) => (
        <img
          key={photo.id}
          src={photo.url}
          alt={i === active ? photo.alt ?? "Photograph by Olha Rykhliuk" : ""}
          aria-hidden={i !== active}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/30" />

      {/* Overlaid header. */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 py-2 font-semibold md:px-5 md:py-3">
        <Link href="/" className="whitespace-nowrap">
          smallsecretalbum
        </Link>

        <nav className="hidden items-center gap-3 md:flex">{navLinks}</nav>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="p-1 md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M3 6h14M3 10h14M3 14h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      {/* Mobile dropdown menu. */}
      {menuOpen && (
        <nav className="absolute inset-x-0 top-[44px] z-20 flex flex-col gap-3 bg-black/60 px-3 py-4 font-semibold backdrop-blur-sm md:hidden">
          {navLinks}
        </nav>
      )}

      {/* Title, vertically centered. */}
      <div className="absolute inset-0 z-10 flex items-center px-3 md:px-5">
        <h1 className="max-w-[692px] text-[36px] leading-[1.05] tracking-tight md:text-[44px] lg:text-[48px]">
          Street scenes and small secrets. Photography by{" "}
          <span className="font-semibold">Olha Rykhliuk.</span>
        </h1>
      </div>

      {/* Bottom row: thumbnail strip (left) + category label (right). */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 px-3 py-3 md:px-5 md:py-5">
        <div className="flex w-[86px] flex-col gap-2.5 md:w-[400px] md:flex-row md:items-end md:gap-4 lg:w-[549px]">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[3/2] w-full overflow-hidden transition-opacity md:min-w-0 md:flex-1 ${
                i === active
                  ? "opacity-60"
                  : "opacity-100 hover:opacity-80"
              }`}
            >
              <img
                src={photo.url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {label && (
          <p className="shrink-0 font-semibold tracking-tight">{label}</p>
        )}
      </div>
    </section>
  );
}
