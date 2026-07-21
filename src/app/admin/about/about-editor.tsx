"use client";

/* eslint-disable @next/next/no-img-element */

import { useActionState, useState } from "react";
import { saveAboutAction } from "@/lib/about-actions";
import { uploadImage } from "@/lib/upload-client";
import type { AboutContent } from "@/lib/about";

export function AboutEditor({ initial }: { initial: AboutContent }) {
  const [state, formAction, pending] = useActionState(saveAboutAction, null);
  const [portraitUrl, setPortraitUrl] = useState(initial.portraitUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handlePortrait(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file);
      setPortraitUrl(url);
    } catch {
      setUploadError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <div>
        <span className="block font-semibold">Portrait photo</span>
        {portraitUrl ? (
          <div className="mt-2 flex items-end gap-3">
            <img
              src={portraitUrl}
              alt="Portrait preview"
              className="h-40 w-auto rounded object-cover"
            />
            <button
              type="button"
              onClick={() => setPortraitUrl("")}
              className="text-[13px] text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <p className="mt-1 text-[13px] text-ink/50">No portrait yet.</p>
        )}
        <input type="hidden" name="portraitUrl" value={portraitUrl} />
        <input
          type="file"
          accept="image/*"
          onChange={handlePortrait}
          className="mt-2 block text-[14px]"
        />
        {uploading && <p className="text-[13px] text-ink/60">Uploading…</p>}
        {uploadError && (
          <p className="text-[13px] text-red-600">{uploadError}</p>
        )}
      </div>

      <div>
        <label htmlFor="body" className="block font-semibold">
          Bio
        </label>
        <p className="mt-1 text-[13px] text-ink/50">
          Formatting:{" "}
          <code className="rounded bg-ink/[0.06] px-1">**bold**</code>{" "}
          <code className="rounded bg-ink/[0.06] px-1">*italic*</code>{" "}
          <code className="rounded bg-ink/[0.06] px-1">[link](https://…)</code>.
          Leave a blank line between paragraphs.
        </p>
        <textarea
          id="body"
          name="body"
          defaultValue={initial.body}
          rows={12}
          className="mt-2 w-full rounded border border-ink/20 bg-transparent px-3 py-2 leading-[1.6]"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || uploading}
          className="rounded bg-ink px-4 py-2 font-semibold text-paper disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {state && (
          <span
            className={`text-[14px] ${
              state.ok ? "text-green-600" : "text-red-600"
            }`}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
