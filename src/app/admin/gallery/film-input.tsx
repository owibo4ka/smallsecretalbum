"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGalleryPhotoFilmAction } from "@/lib/gallery-actions";

// A small text field for the film stock a photo was shot on (e.g. "Kodak Portra
// 400"). Saves when you click away (blur) or press Enter, then refreshes.
export function FilmInput({
  photoId,
  current,
}: {
  photoId: string;
  current: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(current ?? "");

  function save() {
    // Skip the save if nothing changed.
    if (value.trim() === (current ?? "")) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", photoId);
      fd.set("film", value);
      await updateGalleryPhotoFilmAction(fd);
      router.refresh();
    });
  }

  return (
    <input
      type="text"
      value={value}
      disabled={pending}
      placeholder="Film (optional)"
      onChange={(e) => setValue(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className="w-full rounded border border-ink/20 bg-transparent px-1 py-0.5 text-[13px] disabled:opacity-50"
    />
  );
}
