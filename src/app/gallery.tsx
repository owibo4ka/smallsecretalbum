"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";
import { Lightbox } from "@/components/lightbox";

type GalleryPhoto = {
  id: string;
  url: string;
  category: string | null;
  alt: string | null;
  film: string | null;
};

export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [category, setCategory] = useState<string | null>(null); // null = All
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = category
    ? photos.filter((p) => p.category === category)
    : photos;

  function selectCategory(slug: string | null) {
    setCategory(slug);
    setLightboxIndex(null);
  }

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
            onClick={() => setLightboxIndex(null)}
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

      <Lightbox
        photos={filtered}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </main>
  );
}
