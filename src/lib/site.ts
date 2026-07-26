// Shared site-wide constants used for metadata, social share tags, and
// structured data (JSON-LD). Kept in one place so the canonical URL, name, and
// author don't drift between the layout, per-post metadata, robots, and sitemap.
export const SITE_URL = "https://smallsecretalbum.vercel.app";
export const SITE_NAME = "smallsecretalbum";
export const SITE_DESCRIPTION =
  "Street scenes and small secrets. Photography by Olha Rykhliuk.";
export const AUTHOR_NAME = "Olha Rykhliuk";

// A short, plain-text summary from post/markdown content, for meta descriptions.
// Strips the most common Markdown markers and collapses whitespace, then trims
// to a single tidy sentence-length string with an ellipsis if it was cut.
export function excerpt(source: string, max = 155): string {
  const text = source
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/[#>*_`~-]/g, " ") // stray markdown punctuation
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)).trimEnd() + "…";
}
