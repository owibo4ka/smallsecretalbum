"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  deleteGalleryPhotoAction,
  reorderGalleryPhotosAction,
} from "@/lib/gallery-actions";
import { CATEGORIES } from "@/lib/categories";
import { CategorySelect } from "./category-select";
import { FeaturedToggle } from "./featured-toggle";
import { FilmInput } from "./film-input";
import { FocalControl } from "./focal-control";

type ManagedPhoto = {
  id: string;
  url: string;
  alt: string | null;
  category: string | null;
  featured: boolean;
  film: string | null;
  focalX: number;
  focalY: number;
};

// The gallery grid: filter by category, reorder with ↑/↓ (applied instantly and
// saved in the background), plus per-photo category/feature/film/delete. The
// stored order drives the public gallery and home hero.
export function GalleryManager({ photos: initial }: { photos: ManagedPhoto[] }) {
  const [photos, setPhotos] = useState(initial);
  const [filter, setFilter] = useState<string>("all"); // "all" | slug | "none"
  const [pending, startTransition] = useTransition();

  // Keep local state in step with the server after any mutation (a category
  // change or feature toggle re-renders this with fresh props). Adjusting state
  // during render is React's recommended alternative to a syncing effect —
  // without it, the local copy we keep for optimistic reordering would hide
  // those updates until a full page reload.
  const [syncedFrom, setSyncedFrom] = useState(initial);
  if (initial !== syncedFrom) {
    setSyncedFrom(initial);
    setPhotos(initial);
  }

  const visible = photos.filter((p) => {
    if (filter === "all") return true;
    if (filter === "none") return p.category === null;
    return p.category === filter;
  });

  // Swap a visible photo with its visible neighbour, mapping back to the full
  // list so the stored order stays correct even while filtered.
  function move(visibleIndex: number, direction: -1 | 1) {
    const targetVisible = visibleIndex + direction;
    if (targetVisible < 0 || targetVisible >= visible.length) return;

    const a = photos.findIndex((p) => p.id === visible[visibleIndex].id);
    const b = photos.findIndex((p) => p.id === visible[targetVisible].id);
    const next = [...photos];
    [next[a], next[b]] = [next[b], next[a]];
    setPhotos(next);
    startTransition(() => reorderGalleryPhotosAction(next.map((p) => p.id)));
  }

  return (
    <>
      <div className="mt-4 flex items-center gap-2 text-[13px]">
        <label htmlFor="gallery-filter" className="text-ink/60">
          Show
        </label>
        <select
          id="gallery-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border border-ink/20 bg-transparent px-2 py-1"
        >
          <option value="all">All ({photos.length})</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
          <option value="none">Uncategorized</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="mt-4 text-ink/60">No photos in this category.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {visible.map((photo, i) => (
            <li key={photo.id} className="space-y-1">
              <div className="relative aspect-square w-full overflow-hidden rounded bg-ink/5">
                <Image
                  src={photo.url}
                  alt={photo.alt ?? "Gallery photo"}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Reorder controls (operate within the current view) */}
              <div className="flex items-center gap-1 text-[13px]">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || pending}
                  aria-label="Move earlier"
                  className="rounded border border-ink/20 px-1.5 leading-none disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === visible.length - 1 || pending}
                  aria-label="Move later"
                  className="rounded border border-ink/20 px-1.5 leading-none disabled:opacity-30"
                >
                  ↓
                </button>
                <span className="text-ink/40">
                  #{photos.findIndex((p) => p.id === photo.id) + 1}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 text-[13px]">
                <CategorySelect photoId={photo.id} current={photo.category} />
                <form action={deleteGalleryPhotoAction}>
                  <input type="hidden" name="id" value={photo.id} />
                  <button type="submit" className="text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </div>
              <div className="text-[13px]">
                <FeaturedToggle photoId={photo.id} featured={photo.featured} />
              </div>
              <FilmInput photoId={photo.id} current={photo.film} />
              {/* Crop focus only matters for the home hero, which shows only
                  featured photos — so hide it on the rest. */}
              {photo.featured && (
                <details className="group pt-0.5">
                  <summary className="cursor-pointer list-none text-[11px] text-ink/50 hover:text-ink/80">
                    <span className="inline-block transition-transform group-open:rotate-90">
                      ▸
                    </span>{" "}
                    Crop focus (home hero)
                  </summary>
                  <div className="pt-1.5">
                    <FocalControl
                      photoId={photo.id}
                      url={photo.url}
                      focalX={photo.focalX}
                      focalY={photo.focalY}
                    />
                  </div>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
