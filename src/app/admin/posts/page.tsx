import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { deletePostAction } from "@/lib/actions";
import { PostFeaturedToggle } from "./post-featured-toggle";

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Manage posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-8 text-zinc-500">No posts yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <span className="font-medium">{post.title}</span>
                {!post.published && (
                  <span className="ml-2 rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    draft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                {/* Featuring puts the post in the home hero, which needs a
                    cover image — so only offer it once the post is publishable. */}
                {post.published && post.coverImageUrl && (
                  <PostFeaturedToggle
                    postId={post.id}
                    featured={post.featured}
                  />
                )}
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="hover:underline"
                >
                  Edit
                </Link>
                {/* A tiny form whose action deletes this post. */}
                <form action={deletePostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
