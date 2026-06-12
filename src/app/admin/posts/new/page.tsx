import { PostForm } from "@/app/admin/posts/post-form";

export default function NewPostPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">New post</h1>
      <PostForm />
    </main>
  );
}
