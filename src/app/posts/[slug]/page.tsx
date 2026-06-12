import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";

// In Next.js 16, `params` is a Promise that must be awaited. `PageProps` is a
// global helper type generated from the route path — no import needed.
export default async function PostPage(props: PageProps<"/posts/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-500">
        {post.createdAt.toLocaleDateString()}
      </p>
      <div className="mt-8 whitespace-pre-wrap text-lg leading-8 text-zinc-700 dark:text-zinc-300">
        {post.content}
      </div>
    </main>
  );
}
