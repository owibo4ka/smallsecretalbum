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

export async function updateGalleryPhotoCategory(
  id: string,
  category: string | null,
) {
  return prisma.photo.update({ where: { id }, data: { category } });
}

export async function deleteGalleryPhoto(id: string) {
  return prisma.photo.delete({ where: { id } });
}
