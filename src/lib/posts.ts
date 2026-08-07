import { prisma } from "@/lib/prisma";

// The data-access layer for posts. Every part of the app that needs post data
// goes through these functions — never through Prisma directly. This keeps the
// database details in one place.

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });
}

// Published posts flagged to appear as slides in the home hero, newest first.
export async function getFeaturedPosts() {
  return prisma.post.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      coverImageUrl: true,
      coverFocalX: true,
      coverFocalY: true,
    },
  });
}

export async function setPostFeatured(id: string, featured: boolean) {
  return prisma.post.update({ where: { id }, data: { featured } });
}

// The previous (older) and next (newer) published posts, for article nav.
export async function getAdjacentPosts(createdAt: Date) {
  const [previous, next] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, createdAt: { lt: createdAt } },
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.post.findFirst({
      where: { published: true, createdAt: { gt: createdAt } },
      orderBy: { createdAt: "asc" },
      select: { slug: true, title: true },
    }),
  ]);
  return { previous, next };
}

// Admin reads: include drafts too.
export async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
}

// Writes. The shape of `data` matches what the form is allowed to set.
type PostInput = {
  title: string;
  slug: string;
  content: string;
  published: boolean;
  coverImageUrl: string | null;
  coverFocalX: number;
  coverFocalY: number;
  photoUrls: string[];
};

// Turn the list of photo URLs into ordered Photo rows for a nested write.
function photoCreateData(photoUrls: string[]) {
  return photoUrls.map((url, order) => ({ url, order }));
}

export async function createPost({ photoUrls, ...data }: PostInput) {
  return prisma.post.create({
    data: {
      ...data,
      photos: { create: photoCreateData(photoUrls) },
    },
  });
}

export async function updatePost(id: string, { photoUrls, ...data }: PostInput) {
  // Replace the gallery wholesale: drop existing photo rows, recreate from the
  // submitted list (which preserves the admin's ordering).
  return prisma.post.update({
    where: { id },
    data: {
      ...data,
      photos: {
        deleteMany: {},
        create: photoCreateData(photoUrls),
      },
    },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
