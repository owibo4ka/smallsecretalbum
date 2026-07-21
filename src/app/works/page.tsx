import { getGalleryPhotos } from "@/lib/gallery";
import { Gallery } from "../gallery";

export const metadata = {
  title: "Works — smallsecretalbum",
};

// The full photo gallery — masonry grid + category filter + lightbox. This used
// to live on the home page; the home is now the hero carousel, so the grid has
// its own "works" page (linked from the header).
export default async function WorksPage() {
  const photos = await getGalleryPhotos();

  return (
    <Gallery
      photos={photos.map((p) => ({
        id: p.id,
        url: p.url,
        category: p.category,
        alt: p.alt,
        film: p.film,
      }))}
    />
  );
}
