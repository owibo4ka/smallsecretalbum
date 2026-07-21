"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createContactMessage,
  deleteContactMessage,
  setMessageRead,
} from "@/lib/contact";

// Public — anyone can send a message from the about page's contact form. No
// auth. Guards: a honeypot field that only bots fill, plus basic validation and
// length caps.
export async function sendContactMessageAction(
  _prevState: unknown,
  formData: FormData,
) {
  // Honeypot: a hidden field real users never see. If it's filled, silently
  // pretend success and drop the message.
  if (((formData.get("company") as string) ?? "").trim().length > 0) {
    return { ok: true as const, message: "Thanks — your message was sent." };
  }

  const name = ((formData.get("name") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();
  // Optional — set by specialized forms (e.g. the print request page) to label
  // the message in the admin inbox.
  const subject = ((formData.get("subject") as string) ?? "").trim() || null;

  if (!name || !email || !message) {
    return { ok: false as const, message: "Please fill in every field." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, message: "Please enter a valid email." };
  }
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return { ok: false as const, message: "That message is too long." };
  }

  await createContactMessage({
    name,
    email,
    subject: subject && subject.length <= 120 ? subject : null,
    message,
  });
  revalidatePath("/admin/messages");

  return {
    ok: true as const,
    message: "Thanks — your message was sent. I'll be in touch.",
  };
}

export async function markMessageReadAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  const read = formData.get("read") === "true";
  if (typeof id === "string" && id.length > 0) {
    await setMessageRead(id, read);
    revalidatePath("/admin/messages");
  }
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id === "string" && id.length > 0) {
    await deleteContactMessage(id);
    revalidatePath("/admin/messages");
  }
}
