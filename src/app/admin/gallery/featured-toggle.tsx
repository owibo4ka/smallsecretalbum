"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleGalleryPhotoFeaturedAction } from "@/lib/gallery-actions";

// A star button that adds/removes a photo from the home hero carousel. It saves
// the OPPOSITE of the current state, then refreshes so the star updates at once.
export function FeaturedToggle({
  photoId,
  featured,
}: {
  photoId: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      title={featured ? "Remove from home carousel" : "Feature on home carousel"}
      onClick={() => {
        startTransition(async () => {
          const fd = new FormData();
          fd.set("id", photoId);
          fd.set("featured", featured ? "false" : "true");
          await toggleGalleryPhotoFeaturedAction(fd);
          router.refresh();
        });
      }}
      className={
        featured
          ? "text-amber-500 hover:text-amber-600 disabled:opacity-50"
          : "text-ink/30 hover:text-ink/60 disabled:opacity-50"
      }
    >
      {featured ? "★ Featured" : "☆ Feature"}
    </button>
  );
}
