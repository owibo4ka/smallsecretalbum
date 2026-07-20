// The fixed gallery categories from the design. "All" is just the unfiltered
// view, so it's not stored here.
export const CATEGORIES = [
  { slug: "street-life", label: "Street Life" },
  { slug: "wandering", label: "Wandering" },
  { slug: "film-experiments", label: "Film Experiments" },
  { slug: "people-moments", label: "People / Moments" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryLabel(slug: string | null): string | null {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? null;
}
