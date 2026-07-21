"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Lightbox } from "@/components/lightbox";

type PostPhoto = { id: string; url: string; alt: string | null };

// The photo set at the end of a blog post. Renders as a full-width stack; click
// any photo to open the shared fullscreen lightbox and flip through them all.
export function PostGallery({ photos }: { photos: PostPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="mt-10 space-y-10">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="block w-full cursor-zoom-in"
          >
            <img
              src={photo.url}
              alt={photo.alt ?? "Photograph by Olha Rykhliuk"}
              loading="lazy"
              className="h-auto w-full"
            />
          </button>
        ))}
      </div>

      <Lightbox
        photos={photos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
