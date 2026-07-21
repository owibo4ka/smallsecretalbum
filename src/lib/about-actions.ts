"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { saveAbout } from "@/lib/about";

export async function saveAboutAction(_prevState: unknown, formData: FormData) {
  await requireAdmin();

  const body = ((formData.get("body") as string) ?? "").trim();
  const portraitUrl =
    ((formData.get("portraitUrl") as string) ?? "").trim() || null;
  const email = ((formData.get("email") as string) ?? "").trim() || null;

  if (body.length === 0) {
    return { ok: false as const, message: "The bio can't be empty." };
  }

  await saveAbout({ body, portraitUrl, email });
  revalidatePath("/about");
  revalidatePath("/admin/about");

  return { ok: true as const, message: "Saved.", savedAt: Date.now() };
}
