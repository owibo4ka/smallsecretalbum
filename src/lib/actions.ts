"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPost, updatePost, deletePost, setPostFeatured } from "@/lib/posts";
import { requireAdmin } from "@/lib/auth/require-admin";

// Validate exactly what the form is allowed to set.
const PostSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required"),
  published: z.boolean(),
});

// Turn a title into a URL-safe slug: "Golden Hour!" -> "golden-hour".
function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// The shape useActionState passes back to the form so it can show errors.
export type PostFormState = { error?: string } | undefined;

// One action handles both create and edit. If the form includes a hidden
// `id`, we update that post; otherwise we create a new one.
export async function savePost(
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();

  const parsed = PostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const id = formData.get("id");
  const coverImageUrl = (formData.get("coverImageUrl") as string) || null;
  const photoUrls = formData
    .getAll("photoUrls")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  const data = {
    ...parsed.data,
    slug: slugify(parsed.data.title),
    coverImageUrl,
    photoUrls,
  };

  try {
    if (typeof id === "string" && id.length > 0) {
      await updatePost(id, data);
    } else {
      await createPost(data);
    }
  } catch {
    // The most likely failure is the unique-slug constraint.
    return { error: "Could not save — a post with a similar title may already exist." };
  }

  // Refresh the cached pages that show posts, then leave the form.
  revalidatePath("/journal");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function togglePostFeaturedAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const featured = formData.get("featured") === "true";
  if (typeof id === "string" && id.length > 0) {
    await setPostFeatured(id, featured);
    revalidatePath("/");
    revalidatePath("/admin/posts");
  }
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id === "string" && id.length > 0) {
    await deletePost(id);
    revalidatePath("/journal");
    revalidatePath("/admin/posts");
  }
}
