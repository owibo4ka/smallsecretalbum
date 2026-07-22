"use client";

import { upload } from "@vercel/blob/client";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/upload-limit";

// Uploads a single image straight from the browser to Vercel Blob (via the
// /api/upload token route) and returns its public URL. Rejects oversized files
// up front with a clear message (the server also enforces the same cap).
export async function uploadImage(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `"${file.name}" is ${mb} MB — please keep photos under ${MAX_UPLOAD_MB} MB.`,
    );
  }

  const result = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });
  return result.url;
}
