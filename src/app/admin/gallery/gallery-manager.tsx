"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  deleteGalleryPhotoAction,
  reorderGalleryPhotosAction,
} from "@/lib/gallery-actions";
import { CategorySelect } from "./category-select";
import { FeaturedToggle } from "./featured-toggle";
import { FilmInput } from "./film-input";

type ManagedPhoto = {
  id: string;
  url: string;
  alt: string | null;
  category: string | null;
  featured: boolean;
  film: string | null;
};

// The gallery grid, made reorderable. Each photo has ↑/↓ buttons that swap it
// with its neighbour; the new order is applied instantly on screen and saved in
// the background. The stored order is what the public gallery and home hero use.
export function GalleryManager({ photos: initial }: { photos: ManagedPhoto[] }) {
  const [photos, setPhotos] = useState(initial);
  const [pending, startTransition] = useTransition();

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;

    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    setPhotos(next);
    startTransition(() => reorderGalleryPhotosAction(next.map((p) => p.id)));
  }

  return (
    <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {photos.map((photo, i) => (
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

          {/* Reorder controls */}
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
              disabled={i === photos.length - 1 || pending}
              aria-label="Move later"
              className="rounded border border-ink/20 px-1.5 leading-none disabled:opacity-30"
            >
              ↓
            </button>
            <span className="text-ink/40">#{i + 1}</span>
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
        </li>
      ))}
    </ul>
  );
}
