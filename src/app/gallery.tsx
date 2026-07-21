"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";

type GalleryPhoto = {
  id: string;
  url: string;
  category: string | null;
  alt: string | null;
};

export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [category, setCategory] = useState<string | null>(null); // null = All
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = category
    ? photos.filter((p) => p.category === category)
    : photos;

  const close = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? i : (i + 1) % filtered.length,
      ),
    [filtered.length],
  );
  const prev = useCallback(
    () =>
      setLightboxIndex((i) =>
        i === null ? i : (i - 1 + filtered.length) % filtered.length,
      ),
    [filtered.length],
  );

  function selectCategory(slug: string | null) {
    setCategory(slug);
    setLightboxIndex(null);
  }

  // Keyboard nav + scroll lock while the lightbox is open.
  useEffect(() => {
    if (lightboxIndex === null) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, next, prev]);

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <main className="px-5 pt-24 pb-16 md:pt-40">
      <div className="flex items-center justify-between gap-4">
        <nav className="flex flex-wrap items-center gap-3 font-semibold">
          <button
            type="button"
            onClick={() => selectCategory(null)}
            className={category === null ? "" : "opacity-40 hover:opacity-70"}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => selectCategory(c.slug)}
              className={
                category === c.slug ? "" : "opacity-40 hover:opacity-70"
              }
            >
              {c.label}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={close}
            aria-label="Grid view"
            className={`p-0.5 ${lightboxIndex === null ? "" : "opacity-40"}`}
          >
            <Image
              src="/icons/icon-squares-four.svg"
              alt=""
              width={20}
              height={20}
              unoptimized
            />
          </button>
          <button
            type="button"
            onClick={() => filtered.length > 0 && setLightboxIndex(0)}
            aria-label="Lightbox view"
            className={`p-0.5 ${lightboxIndex !== null ? "" : "opacity-40"}`}
          >
            <Image
              src="/icons/icon-rows.svg"
              alt=""
              width={20}
              height={20}
              unoptimized
            />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-ink/50">No photos in this category yet.</p>
      ) : (
        <div className="mt-5 columns-1 [column-gap:1.25rem] sm:columns-2 lg:columns-3">
          {filtered.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="mb-5 block w-full cursor-zoom-in"
            >
              <img
                src={photo.url}
                alt={photo.alt ?? "Photograph by Olha Rykhliuk"}
                loading="lazy"
                className="w-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      {current && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#1a1a1a]">
          <div className="flex justify-end p-4">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="text-2xl leading-none text-paper"
            >
              ✕
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center gap-3 px-4 sm:gap-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="text-4xl leading-none text-paper/70 hover:text-paper"
            >
              ‹
            </button>
            <img
              src={current.url}
              alt={current.alt ?? "Photograph by Olha Rykhliuk"}
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="text-4xl leading-none text-paper/70 hover:text-paper"
            >
              ›
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto p-4">
            {filtered.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className={`h-16 w-24 shrink-0 ${
                  i === lightboxIndex ? "" : "opacity-50 hover:opacity-80"
                }`}
              >
                <img
                  src={photo.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
