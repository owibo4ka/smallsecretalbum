import Image from "next/image";
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
    <main className="mx-auto max-w-2xl px-5 pt-24 pb-16 md:pt-32">
      {post.coverImageUrl && (
        <div className="relative mb-8 aspect-[3/2] w-full">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 768px) 42rem, 100vw"
            className="rounded object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-ink/50">{post.createdAt.toLocaleDateString()}</p>

      <div className="mt-8 leading-[1.6] whitespace-pre-wrap text-ink/80">
        {post.content}
      </div>

      {post.photos.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {post.photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square w-full">
              <Image
                src={photo.url}
                alt={photo.alt ?? post.title}
                fill
                sizes="(min-width: 640px) 21rem, 100vw"
                className="rounded object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
