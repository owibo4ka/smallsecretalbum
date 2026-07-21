import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAdjacentPosts } from "@/lib/posts";
import { Markdown } from "@/components/markdown";
import { PostGallery } from "@/components/post-gallery";

// In Next.js 16, `params` is a Promise that must be awaited. `PageProps` is a
// global helper type generated from the route path — no import needed.
export default async function PostPage(props: PageProps<"/posts/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const { previous, next } = await getAdjacentPosts(post.createdAt);
  const date = post.createdAt
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toLowerCase();

  return (
    <article>
      {/* Immersive hero: cover image with the title over it. */}
      {post.coverImageUrl ? (
        <header className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative z-10 flex flex-col items-center gap-4 px-5 text-center text-paper">
            <p className="text-sm">{date}</p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
              {post.title}
            </h1>
          </div>
          <Link
            href="/journal"
            className="absolute bottom-6 left-5 z-10 border-b border-paper pb-0.5 text-sm font-semibold text-paper"
          >
            ← Back to journal
          </Link>
        </header>
      ) : (
        <header className="px-5 pt-24 pb-4 md:pt-32">
          <p className="text-sm text-ink/50">{date}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <Link
            href="/journal"
            className="mt-4 inline-block border-b border-ink pb-0.5 text-sm font-semibold"
          >
            ← Back to journal
          </Link>
        </header>
      )}

      {/* Reading column: the text, then any gallery photos. */}
      <div className="mx-auto max-w-[688px] px-5 py-14">
        <Markdown>{post.content}</Markdown>

        <PostGallery
          photos={post.photos.map((p) => ({
            id: p.id,
            url: p.url,
            alt: p.alt,
          }))}
        />

        {/* Previous / next post navigation. */}
        {(previous || next) && (
          <nav className="mt-16 flex items-start justify-between gap-6 border-t border-ink pt-6">
            <div className="w-1/2">
              {previous && (
                <Link href={`/posts/${previous.slug}`} className="group block">
                  <span className="text-sm text-ink/60">← Previous</span>
                  <span className="mt-1 block font-medium group-hover:underline">
                    {previous.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="w-1/2 text-right">
              {next && (
                <Link href={`/posts/${next.slug}`} className="group block">
                  <span className="text-sm text-ink/60">Next →</span>
                  <span className="mt-1 block font-medium group-hover:underline">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </article>
  );
}
