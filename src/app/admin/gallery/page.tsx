import Image from "next/image";
import { getGalleryPhotos } from "@/lib/gallery";
import { deleteGalleryPhotoAction } from "@/lib/gallery-actions";
import { GalleryUploader } from "./gallery-uploader";
import { CategorySelect } from "./category-select";

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
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((photo) => (
              <li key={photo.id} className="space-y-1">
                <div className="relative aspect-square w-full overflow-hidden rounded bg-ink/5">
                  <Image
                    src={photo.url}
                    alt={photo.alt ?? "Gallery photo"}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 text-[13px]">
                  <CategorySelect photoId={photo.id} current={photo.category} />
                  <form action={deleteGalleryPhotoAction}>
                    <input type="hidden" name="id" value={photo.id} />
                    <button
                      type="submit"
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
