"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createGalleryPhoto,
  deleteGalleryPhoto,
  setGalleryPhotoFeatured,
  updateGalleryPhotoCategory,
  updateGalleryPhotoFilm,
} from "@/lib/gallery";

export async function addGalleryPhotosAction(
  _prevState: unknown,
  formData: FormData,
) {
  await requireAdmin();

  const category = (formData.get("category") as string) || null;
  // Dedupe within the batch so an accidental double-add can't create copies.
  const urls = [
    ...new Set(
      formData
        .getAll("photoUrls")
        .filter((v): v is string => typeof v === "string" && v.length > 0),
    ),
  ];

  for (const url of urls) {
    await createGalleryPhoto({ url, category });
  }

  revalidatePath("/");
  revalidatePath("/works");
  revalidatePath("/admin/gallery");

  // A changing value tells the client the add succeeded (so it can reset).
  return { addedAt: Date.now() };
}

export async function updateGalleryPhotoCategoryAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const category = (formData.get("category") as string) || null;
  if (typeof id === "string" && id.length > 0) {
    await updateGalleryPhotoCategory(id, category);
    revalidatePath("/");
    revalidatePath("/works");
    revalidatePath("/admin/gallery");
  }
}

export async function updateGalleryPhotoFilmAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const film = ((formData.get("film") as string) ?? "").trim() || null;
  if (typeof id === "string" && id.length > 0) {
    await updateGalleryPhotoFilm(id, film);
    revalidatePath("/");
    revalidatePath("/works");
    revalidatePath("/admin/gallery");
  }
}

export async function toggleGalleryPhotoFeaturedAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  const featured = formData.get("featured") === "true";
  if (typeof id === "string" && id.length > 0) {
    await setGalleryPhotoFeatured(id, featured);
    revalidatePath("/");
    revalidatePath("/works");
    revalidatePath("/admin/gallery");
  }
}

export async function deleteGalleryPhotoAction(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id === "string" && id.length > 0) {
    await deleteGalleryPhoto(id);
    revalidatePath("/");
    revalidatePath("/works");
    revalidatePath("/admin/gallery");
  }
}
