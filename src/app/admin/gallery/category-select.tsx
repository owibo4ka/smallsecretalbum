"use client";

import { updateGalleryPhotoCategoryAction } from "@/lib/gallery-actions";
import { CATEGORIES } from "@/lib/categories";

// A small dropdown that reassigns a gallery photo's category. It submits the
// form as soon as you pick a new value — no separate save button.
export function CategorySelect({
  photoId,
  current,
}: {
  photoId: string;
  current: string | null;
}) {
  return (
    <form action={updateGalleryPhotoCategoryAction}>
      <input type="hidden" name="id" value={photoId} />
      <select
        name="category"
        defaultValue={current ?? CATEGORIES[0].slug}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded border border-ink/20 bg-transparent px-1 py-0.5 text-[13px]"
      >
        {CATEGORIES.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.label}
          </option>
        ))}
      </select>
    </form>
  );
}
