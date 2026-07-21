import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";

export const metadata = {
  title: "Journal — smallsecretalbum",
};

// Always render from the current database so new/edited posts show up right away.
export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="px-5 pt-24 pb-16 md:pt-32">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        Journal
      </h1>

      {posts.length === 0 ? (
        <p className="mt-8 text-ink/60">No posts yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`} className="group">
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-ink/5">
                {post.coverImageUrl && (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-opacity group-hover:opacity-90"
                  />
                )}
              </div>
              <div className="mt-3 border-t border-ink pt-2">
                <p className="text-[12px] font-semibold tracking-wide text-ink/60">
                  {post.createdAt
                    .toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    .toLowerCase()}
                </p>
                <p className="mt-1 font-medium">{post.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
