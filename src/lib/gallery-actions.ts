"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createGalleryPhoto,
  deleteGalleryPhoto,
  updateGalleryPhotoCategory,
} from "@/lib/gallery";

export async function addGalleryPhotosAction(formData: FormData) {
  await requireAdmin();

  const category = (formData.get("category") as string) || null;
  const urls = formData
    .getAll("photoUrls")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  for (const url of urls) {
    await createGalleryPhoto({ url, category });
  }

  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

export async function updateGalleryPhotoCategoryAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const category = (formData.get("category") as string) || null;
  if (typeof id === "string" && id.length > 0) {
    await updateGalleryPhotoCategory(id, category);
    revalidatePath("/");
    revalidatePath("/admin/gallery");
  }
}

export async function deleteGalleryPhotoAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id === "string" && id.length > 0) {
    await deleteGalleryPhoto(id);
    revalidatePath("/");
    revalidatePath("/admin/gallery");
  }
}
