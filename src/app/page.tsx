import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Olha&apos;s Photography Blog
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        Writing about photography. Here are the latest posts.
      </p>

      {posts.length === 0 ? (
        <p className="mt-8 text-zinc-500">No posts published yet.</p>
      ) : (
        <ul className="mt-8 space-y-6">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.slug}`}
                className="text-xl font-medium hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-zinc-500">
                {post.createdAt.toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
