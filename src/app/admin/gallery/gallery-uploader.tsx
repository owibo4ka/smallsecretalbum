"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { addGalleryPhotosAction } from "@/lib/gallery-actions";
import { uploadImage } from "@/lib/upload-client";
import { CATEGORIES } from "@/lib/categories";

export function GalleryUploader() {
  const [state, formAction, pending] = useActionState(
    addGalleryPhotosAction,
    null,
  );
  const [urls, setUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear the previews once an add succeeds, so the same batch can't be
  // submitted twice.
  useEffect(() => {
    if (state) setUrls([]);
  }, [state]);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(files.map(uploadImage));
      setUrls((prev) => [...prev, ...uploaded]);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="category" className="block font-semibold">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="mt-1 rounded border border-ink/20 bg-transparent px-3 py-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className="block font-semibold">Photos</span>
        {urls.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-3">
            {urls.map((url, i) => (
              <li key={url} className="relative">
                <input type="hidden" name="photoUrls" value={url} />
                <Image
                  src={url}
                  alt={`Upload ${i + 1}`}
                  width={112}
                  height={112}
                  className="size-28 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => setUrls((prev) => prev.filter((u) => u !== url))}
                  className="absolute top-1 right-1 rounded bg-ink/80 px-1 text-[12px] text-paper"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="mt-2 block text-[14px]"
        />
      </div>

      {uploading && <p className="text-[14px] text-ink/60">Uploading…</p>}
      {error && <p className="text-[14px] text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={uploading || pending || urls.length === 0}
        className="rounded bg-ink px-4 py-2 font-semibold text-paper disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add to gallery"}
      </button>
    </form>
  );
}
