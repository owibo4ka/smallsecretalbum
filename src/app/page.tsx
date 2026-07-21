import { getFeaturedPhotos, getGalleryPhotos } from "@/lib/gallery";
import { HomeHero } from "./home-hero";

export default async function Home() {
  // Prefer the photos flagged "featured"; before any are starred, fall back to
  // the whole gallery so the home screen is never empty.
  const featured = await getFeaturedPhotos();
  const photos = featured.length > 0 ? featured : await getGalleryPhotos();

  return (
    <HomeHero
      photos={photos.map((p) => ({
        id: p.id,
        url: p.url,
        category: p.category,
        alt: p.alt,
      }))}
    />
  );
}
