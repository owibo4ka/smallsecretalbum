"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/categories";

// A hero slide is either a standalone photo (shows the site tagline) or a
// featured blog post (shows its cover, its title, and links to the post).
export type HeroItem =
  | {
      kind: "photo";
      id: string;
      url: string;
      category: string | null;
      alt: string | null;
      // Crop focal point (percentages); drives object-position so the subject
      // stays in frame when the photo is cover-cropped to fill the screen.
      focalX: number;
      focalY: number;
    }
  | {
      kind: "post";
      id: string;
      url: string;
      title: string;
      slug: string;
      // Crop focal point for the post's cover image (percentages).
      focalX: number;
      focalY: number;
    };

const ROTATE_MS = 6000;

// The full-viewport home screen: a background image that auto-rotates through
// the featured items, a thumbnail strip to jump between them, the site header,
// and — per slide — either the tagline (photo) or the post's title + link
// (featured post). Matches the Figma home design across desktop/tablet/phone.
export function HomeHero({ items }: { items: HeroItem[] }) {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-advance through the featured items.
  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) {
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

  const current = items[active];
  const label = current.kind === "photo" ? categoryLabel(current.category) : null;

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
      {/* Background images, crossfading between the active one and the rest. */}
      {items.map((item, i) => (
        <img
          key={item.id}
          src={item.url}
          alt={
            i === active
              ? item.kind === "post"
                ? item.title
                : item.alt ?? "Photograph by Olha Rykhliuk"
              : ""
          }
          aria-hidden={i !== active}
          style={{ objectPosition: `${item.focalX}% ${item.focalY}%` }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Darkening scrim: stronger on post slides so the centered title stays
          readable; a lighter touch on photo slides — just enough contrast for
          the header + bottom labels without dulling the photo. */}
      <div
        className={`absolute inset-0 ${
          current.kind === "post" ? "bg-black/30" : "bg-black/15"
        }`}
      />

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

      {/* Caption for a featured post (title + link), vertically centered.
          Photo slides intentionally show no overlay text. */}
      {current.kind === "post" && (
        <div className="absolute inset-0 z-10 flex items-center px-3 md:px-5">
          <div className="max-w-[692px]">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/80 md:text-[12px]">
              From the journal
            </p>
            <Link href={`/posts/${current.slug}`} className="group inline-block">
              <h1 className="text-[36px] font-semibold leading-[1.05] tracking-tight md:text-[44px] lg:text-[48px]">
                {current.title}
              </h1>
              <span className="mt-3 inline-block border-b border-paper/70 pb-0.5 text-sm font-semibold transition-colors group-hover:border-paper">
                Read the story →
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Bottom row: thumbnail strip (left) + slide label (right). */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 px-3 py-3 md:px-5 md:py-5">
        <div className="flex w-[72%] max-w-[340px] flex-row items-end gap-1.5 md:w-[400px] md:max-w-none md:gap-4 lg:w-[549px]">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[3/2] w-full min-w-0 flex-1 overflow-hidden transition-opacity ${
                i === active ? "opacity-60" : "opacity-100 hover:opacity-80"
              }`}
            >
              <img
                src={item.url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <p className="text-[11px] tracking-wide text-paper/70 md:text-[12px]">
            ✦ work in progress — new corners still being swept
          </p>
          {current.kind === "post" ? (
            <p className="font-semibold tracking-tight">journal</p>
          ) : (
            label && <p className="font-semibold tracking-tight">{label}</p>
          )}
        </div>
      </div>
    </section>
  );
}
