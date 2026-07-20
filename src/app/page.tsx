import { getGalleryPhotos } from "@/lib/gallery";
import { Gallery } from "./gallery";

export default async function Home() {
  const photos = await getGalleryPhotos();

  return (
    <Gallery
      photos={photos.map((p) => ({
        id: p.id,
        url: p.url,
        category: p.category,
        alt: p.alt,
      }))}
    />
  );
}
