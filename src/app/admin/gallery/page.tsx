import { getGalleryPhotos } from "@/lib/gallery";
import { GalleryUploader } from "./gallery-uploader";
import { GalleryManager } from "./gallery-manager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const photos = await getGalleryPhotos();

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-2xl font-semibold">Manage gallery</h1>

      <section className="mt-6">
        <GalleryUploader />
      </section>

      <section className="mt-12">
        <h2 className="font-semibold">
          Photos in gallery ({photos.length})
        </h2>
        {photos.length === 0 ? (
          <p className="mt-3 text-ink/60">
            No gallery photos yet. Upload some above.
          </p>
        ) : (
          <>
            <p className="mt-1 text-[13px] text-ink/50">
              Use ↑ / ↓ to set the order photos appear in the gallery and home
              hero.
            </p>
            <GalleryManager
              photos={photos.map((p) => ({
                id: p.id,
                url: p.url,
                alt: p.alt,
                category: p.category,
                featured: p.featured,
                film: p.film,
              }))}
            />
          </>
        )}
      </section>
    </main>
  );
}
