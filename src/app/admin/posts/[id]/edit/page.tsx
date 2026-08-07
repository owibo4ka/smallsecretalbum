import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { PostForm } from "@/app/admin/posts/post-form";

export default async function EditPostPage(
  props: PageProps<"/admin/posts/[id]/edit">,
) {
  const { id } = await props.params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Edit post</h1>
      {/* Reuse the same form, pre-filled with this post's values. */}
      <PostForm
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          published: post.published,
          coverImageUrl: post.coverImageUrl,
          coverFocalX: post.coverFocalX,
          coverFocalY: post.coverFocalY,
          photos: post.photos.map((p) => ({ url: p.url })),
        }}
      />
    </main>
  );
}
