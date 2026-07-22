"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import { savePost, type PostFormState } from "@/lib/actions";
import { uploadImage } from "@/lib/upload-client";
import { Markdown } from "@/components/markdown";

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

// Pull the image URLs out of Markdown (`![alt](url)`) in the order they appear,
// so the editor can preview the photos inlined in the text.
function extractInlineImages(markdown: string): string[] {
  const urls: string[] = [];
  const re = /!\[[^\]]*\]\(\s*([^)\s]+)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

export function PostForm({ post }: PostFormProps) {
  const [state, formAction, pending] = useActionState<PostFormState, FormData>(
    savePost,
    undefined,
  );

  const [content, setContent] = useState(post?.content ?? "");
  const [preview, setPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [cover, setCover] = useState<string | null>(post?.coverImageUrl ?? null);
  const [photos, setPhotos] = useState<string[]>(
    post?.photos.map((p) => p.url) ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // The photos placed inside the article text, kept in sync as you type.
  const inlineImages = extractInlineImages(content);

  // Swap a gallery photo with its neighbour. Submission order (the hidden
  // photoUrls fields) is the stored order, so this reorders the live post.
  function moveGalleryPhoto(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    setPhotos((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      setCover(await uploadImage(file));
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Cover upload failed. Try again.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // Uploads a photo and drops a Markdown image at the cursor, so it renders
  // inline within the text (not in the gallery at the end of the post).
  async function handleInsertPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file);
      const snippet = `\n\n![](${url})\n\n`;
      const el = contentRef.current;
      const at = el ? el.selectionStart : content.length;
      const nextValue = content.slice(0, at) + snippet + content.slice(at);
      setContent(nextValue);
      setPreview(false);
      // Put the cursor after the inserted image once React re-renders.
      requestAnimationFrame(() => {
        if (!el) return;
        const pos = at + snippet.length;
        el.focus();
        el.setSelectionRange(pos, pos);
      });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Photo upload failed. Try again.",
      );
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
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? err.message
          : "One or more photos failed to upload. Try again.",
      );
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
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="font-semibold">
            Content
          </label>
          <div className="flex items-center gap-3 text-[13px]">
            <label className="cursor-pointer font-semibold text-ink/60 hover:text-ink">
              + Insert photo
              <input
                type="file"
                accept="image/*"
                onChange={handleInsertPhoto}
                className="hidden"
              />
            </label>
            <span className="text-ink/20">|</span>
            <button
              type="button"
              onClick={() => setPreview(false)}
              className={preview ? "text-ink/40 hover:text-ink" : "font-semibold"}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className={preview ? "font-semibold" : "text-ink/40 hover:text-ink"}
            >
              Preview
            </button>
          </div>
        </div>

        {/* The textarea always stays mounted so its value submits; Preview just
            hides it and shows the rendered Markdown. */}
        <textarea
          id="content"
          name="content"
          ref={contentRef}
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`${inputClass} ${preview ? "hidden" : ""}`}
        />
        {preview && (
          <div className="mt-1 min-h-[6rem] rounded border border-ink/20 px-3 py-3">
            {content.trim() ? (
              <Markdown>{content}</Markdown>
            ) : (
              <p className="text-[14px] text-ink/40">Nothing to preview yet.</p>
            )}
          </div>
        )}

        <p className="mt-1 text-[13px] text-ink/50">
          Formatting:{" "}
          <code className="rounded bg-ink/[0.06] px-1">**bold**</code>{" "}
          <code className="rounded bg-ink/[0.06] px-1">*italic*</code>{" "}
          <code className="rounded bg-ink/[0.06] px-1">## Heading</code>{" "}
          <code className="rounded bg-ink/[0.06] px-1">- list item</code>{" "}
          <code className="rounded bg-ink/[0.06] px-1">[link](https://…)</code>{" "}
          <code className="rounded bg-ink/[0.06] px-1">![alt](image-url)</code>.
          Use “+ Insert photo” to place an image at your cursor. Leave a blank
          line between paragraphs.
        </p>
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

      {/* Inline photos — a read-only preview of the images placed in the text.
          Managed by editing the content (Insert photo / the Markdown), not here. */}
      {inlineImages.length > 0 && (
        <div>
          <span className="block font-semibold">Inline photos (in the text)</span>
          <p className="mt-0.5 text-[13px] text-ink/50">
            These sit inside your article where you inserted them. To move or
            remove one, edit the content above.
          </p>
          <ul className="mt-2 flex flex-wrap gap-3">
            {inlineImages.map((url, i) => (
              <li key={`${url}-${i}`} className="relative">
                <Image
                  src={url}
                  alt={`Inline photo ${i + 1}`}
                  width={112}
                  height={112}
                  className="size-28 rounded object-cover"
                />
                <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1 text-[11px] text-paper">
                  {i + 1}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
                  aria-label="Remove photo"
                  className="absolute top-1 right-1 rounded bg-ink/80 px-1 text-[12px] text-paper"
                >
                  ✕
                </button>
                {/* Reorder controls */}
                <div className="absolute bottom-1 left-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveGalleryPhoto(i, -1)}
                    disabled={i === 0}
                    aria-label="Move photo earlier"
                    className="rounded bg-ink/80 px-1 text-[12px] leading-none text-paper disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveGalleryPhoto(i, 1)}
                    disabled={i === photos.length - 1}
                    aria-label="Move photo later"
                    className="rounded bg-ink/80 px-1 text-[12px] leading-none text-paper disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
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
