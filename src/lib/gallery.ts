import { prisma } from "@/lib/prisma";

// The data-access layer for standalone gallery photos (postId is null — these
// are not attached to a blog post).

export async function getGalleryPhotos(category?: string) {
  return prisma.photo.findMany({
    where: {
      postId: null,
      ...(category ? { category } : {}),
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function createGalleryPhoto(data: {
  url: string;
  category: string | null;
  alt?: string | null;
}) {
  return prisma.photo.create({ data: { ...data, postId: null } });
}

// Photos flagged to appear in the home hero carousel, in display order.
export async function getFeaturedPhotos() {
  return prisma.photo.findMany({
    where: { postId: null, featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function setGalleryPhotoFeatured(id: string, featured: boolean) {
  return prisma.photo.update({ where: { id }, data: { featured } });
}

// Persist a new display order by writing each photo's position (0, 1, 2, …)
// into its `order` column. Runs as one transaction so the list can't be left
// half-reordered.
export async function reorderGalleryPhotos(ids: string[]) {
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.photo.update({ where: { id }, data: { order: index } }),
    ),
  );
}

export async function updateGalleryPhotoCategory(
  id: string,
  category: string | null,
) {
  return prisma.photo.update({ where: { id }, data: { category } });
}

export async function updateGalleryPhotoFilm(id: string, film: string | null) {
  return prisma.photo.update({ where: { id }, data: { film } });
}

export async function deleteGalleryPhoto(id: string) {
  return prisma.photo.delete({ where: { id } });
}
