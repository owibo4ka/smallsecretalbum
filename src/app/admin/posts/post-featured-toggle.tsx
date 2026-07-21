"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePostFeaturedAction } from "@/lib/actions";

// A star button that adds/removes a post from the home hero. Saves the OPPOSITE
// of the current state, then refreshes so the label updates at once. Only makes
// sense for published posts with a cover image (the hero needs the image).
export function PostFeaturedToggle({
  postId,
  featured,
}: {
  postId: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      title={featured ? "Remove from home hero" : "Feature on home hero"}
      onClick={() => {
        startTransition(async () => {
          const fd = new FormData();
          fd.set("id", postId);
          fd.set("featured", featured ? "false" : "true");
          await togglePostFeaturedAction(fd);
          router.refresh();
        });
      }}
      className={
        featured
          ? "text-amber-500 hover:text-amber-600 disabled:opacity-50"
          : "text-ink/30 hover:text-ink/60 disabled:opacity-50"
      }
    >
      {featured ? "★ Featured" : "☆ Feature"}
    </button>
  );
}
