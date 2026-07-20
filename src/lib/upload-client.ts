"use client";

import { upload } from "@vercel/blob/client";

// Uploads a single image straight from the browser to Vercel Blob (via the
// /api/upload token route) and returns its public URL.
export async function uploadImage(file: File): Promise<string> {
  const result = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });
  return result.url;
}
