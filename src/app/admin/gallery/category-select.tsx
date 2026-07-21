"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGalleryPhotoCategoryAction } from "@/lib/gallery-actions";
import { CATEGORIES } from "@/lib/categories";

// A dropdown that reassigns a gallery photo's category. It saves the moment you
// pick a new value, then refreshes so the change shows immediately (no manual
// page reload).
export function CategorySelect({
  photoId,
  current,
}: {
  photoId: string;
  current: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={current ?? CATEGORIES[0].slug}
      disabled={pending}
      onChange={(e) => {
        const category = e.target.value;
        startTransition(async () => {
          const fd = new FormData();
          fd.set("id", photoId);
          fd.set("category", category);
          await updateGalleryPhotoCategoryAction(fd);
          router.refresh();
        });
      }}
      className="rounded border border-ink/20 bg-transparent px-1 py-0.5 text-[13px] disabled:opacity-50"
    >
      {CATEGORIES.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
