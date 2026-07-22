// Maximum size for an uploaded photo. Enforced on the server (baked into the
// Vercel Blob upload token) and pre-checked in the browser so oversized files
// get a clear message instead of a failed upload. No "use client" here so both
// the API route and client components can import it.
export const MAX_UPLOAD_MB = 2;
export const MAX_UPLOAD_BYTES = Math.round(MAX_UPLOAD_MB * 1024 * 1024);
