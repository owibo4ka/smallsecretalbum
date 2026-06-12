"use client";

import { useActionState } from "react";
import { savePost, type PostFormState } from "@/lib/actions";

type PostFormProps = {
  post?: {
    id: string;
    title: string;
    content: string;
    published: boolean;
  };
};

const inputClass =
  "w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900";

export function PostForm({ post }: PostFormProps) {
  // useActionState wires the form to the server action and exposes any
  // returned error plus a `pending` flag while it runs.
  const [state, formAction, pending] = useActionState<PostFormState, FormData>(
    savePost,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      {/* When editing, this hidden id tells the action to update, not create. */}
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={post?.title}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          defaultValue={post?.content}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
        />
        Published
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Saving…" : "Save post"}
      </button>
    </form>
  );
}
