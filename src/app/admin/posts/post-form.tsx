"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { savePost, type PostFormState } from "@/lib/actions";
import { uploadImage } from "@/lib/upload-client";

type PostFormProps = {
  post?: {
    id: string;
    title: string;
    content: string;
    published: boolean;
    coverImageUrl: string | null;
    photos: { url: string }[];
  };
};

const inputClass =
  "w-full rounded border border-ink/20 bg-transparent px-3 py-2 text-[14px]";

export function PostForm({ post }: PostFormProps) {
  const [state, formAction, pending] = useActionState<PostFormState, FormData>(
    savePost,
    undefined,
  );

  const [cover, setCover] = useState<string | null>(post?.coverImageUrl ?? null);
  const [photos, setPhotos] = useState<string[]>(
    post?.photos.map((p) => p.url) ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      setCover(await uploadImage(file));
    } catch {
      setUploadError("Cover upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setPhotos((prev) => [...prev, ...urls]);
    } catch {
      setUploadError("One or more photos failed to upload. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label htmlFor="title" className="block font-semibold">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={post?.title}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="content" className="block font-semibold">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          defaultValue={post?.content}
          className={inputClass}
        />
      </div>

      {/* Cover image */}
      <div>
        <span className="block font-semibold">Cover image</span>
        <input type="hidden" name="coverImageUrl" value={cover ?? ""} />
        {cover && (
          <div className="mt-2 flex items-start gap-3">
            <Image
              src={cover}
              alt="Cover preview"
              width={160}
              height={107}
              className="h-auto w-40 rounded object-cover"
            />
            <button
              type="button"
              onClick={() => setCover(null)}
              className="text-[14px] text-red-600 underline"
            >
              Remove
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleCover}
          className="mt-2 block text-[14px]"
        />
      </div>

      {/* Gallery */}
      <div>
        <span className="block font-semibold">Gallery photos</span>
        {photos.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-3">
            {photos.map((url, i) => (
              <li key={url} className="relative">
                {/* Preserve order: submit each URL as a hidden field. */}
                <input type="hidden" name="photoUrls" value={url} />
                <Image
                  src={url}
                  alt={`Gallery photo ${i + 1}`}
                  width={112}
                  height={112}
                  className="size-28 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPhotos((prev) => prev.filter((u) => u !== url))
                  }
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
          onChange={handleGallery}
          className="mt-2 block text-[14px]"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
        />
        Published
      </label>

      {uploading && <p className="text-[14px] text-ink/60">Uploading…</p>}
      {uploadError && <p className="text-[14px] text-red-600">{uploadError}</p>}
      {state?.error && <p className="text-[14px] text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || uploading}
        className="rounded bg-ink px-4 py-2 font-semibold text-paper disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save post"}
      </button>
    </form>
  );
}
