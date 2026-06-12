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

// Admin reads: include drafts too.
export async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
  });
}

// Writes. The shape of `data` matches the columns we let the form set.
type PostInput = {
  title: string;
  slug: string;
  content: string;
  published: boolean;
};

export async function createPost(data: PostInput) {
  return prisma.post.create({ data });
}

export async function updatePost(id: string, data: PostInput) {
  return prisma.post.update({ where: { id }, data });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
