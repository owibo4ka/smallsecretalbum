"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect } from "react";

export type LightboxPhoto = {
  url: string;
  alt?: string | null;
  film?: string | null;
};

// A controlled fullscreen photo viewer with prev/next, a thumbnail strip, and
// keyboard nav (Esc / ← / →). The parent owns the open index (null = closed),
// so it can also open it from a "view" toggle. Shared by /works and blog posts.
export function Lightbox({
  photos,
  index,
  onIndexChange,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  const close = useCallback(() => onIndexChange(null), [onIndexChange]);
  const next = useCallback(() => {
    if (index === null || photos.length === 0) return;
    onIndexChange((index + 1) % photos.length);
  }, [index, photos.length, onIndexChange]);
  const prev = useCallback(() => {
    if (index === null || photos.length === 0) return;
    onIndexChange((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onIndexChange]);

  // Keyboard nav + scroll lock while open.
  useEffect(() => {
    if (index === null) return;
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
  }, [index, close, next, prev]);

  if (index === null) return null;
  const current = photos[index];
  if (!current) return null;

  return (
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
        <div className="flex min-h-0 flex-col items-center gap-2">
          <img
            src={current.url}
            alt={current.alt ?? "Photograph by Olha Rykhliuk"}
            className="max-h-full max-w-full object-contain"
          />
          {current.film && (
            <p className="shrink-0 text-[13px] text-paper/60">{current.film}</p>
          )}
        </div>
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
        {photos.map((photo, i) => (
          <button
            key={`${photo.url}-${i}`}
            type="button"
            onClick={() => onIndexChange(i)}
            className={`h-16 w-24 shrink-0 ${
              i === index ? "" : "opacity-50 hover:opacity-80"
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
  );
}
