"use client";

import { useActionState } from "react";
import { sendContactMessageAction } from "@/lib/contact-actions";

type ContactFormProps = {
  // Labels the message in the admin inbox (e.g. "Print request").
  subject?: string;
  messagePlaceholder?: string;
  buttonLabel?: string;
};

export function ContactForm({
  subject,
  messagePlaceholder = "Message",
  buttonLabel = "Send message",
}: ContactFormProps) {
  const [state, formAction, pending] = useActionState(
    sendContactMessageAction,
    null,
  );

  // After a successful send, show a thank-you in place of the form.
  if (state?.ok) {
    return (
      <p className="max-w-[420px] leading-[1.4] text-ink/90">{state.message}</p>
    );
  }

  return (
    <form action={formAction} className="max-w-[420px] space-y-3">
      {subject && <input type="hidden" name="subject" value={subject} />}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="name"
          required
          placeholder="Your name"
          className="w-full rounded border border-ink/20 bg-transparent px-3 py-2"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          className="w-full rounded border border-ink/20 bg-transparent px-3 py-2"
        />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder={messagePlaceholder}
        className="w-full rounded border border-ink/20 bg-transparent px-3 py-2 leading-[1.5]"
      />

      {/* Honeypot — hidden from real users; bots that fill it are dropped. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-ink px-4 py-2 font-semibold text-paper disabled:opacity-50"
        >
          {pending ? "Sending…" : buttonLabel}
        </button>
        {state && !state.ok && (
          <span className="text-[13px] text-red-600">{state.message}</span>
        )}
      </div>
    </form>
  );
}
