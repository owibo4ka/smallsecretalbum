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
  });
}
