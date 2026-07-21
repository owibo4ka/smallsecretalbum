import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Prints — smallsecretalbum",
};

const DARKROOM_URL = "https://smallsecretalbum.darkroom.com/";

export default function PrintsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-24 pb-16 md:pt-32">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        prints
      </h1>

      <p className="mt-5 leading-[1.6] text-ink/80">
        Prints are available to order. Browse and buy ready-made prints in the
        shop, or request a specific photo or size below and I&apos;ll get back
        to you.
      </p>

      {/* Visit the darkroom shop (opens in a new tab). */}
      <div className="mt-6">
        <a
          href={DARKROOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded border border-ink px-4 py-2 font-semibold transition-colors hover:bg-ink hover:text-paper"
        >
          Visit the print shop →
        </a>
      </div>

      {/* Request a specific print. */}
      <div className="mt-12 border-t border-ink/10 pt-8">
        <h2 className="font-semibold">Request a print</h2>
        <p className="mt-1 mb-4 text-ink/60">
          Tell me which photo and what size you&apos;re after.
        </p>
        <ContactForm
          subject="Print request"
          messagePlaceholder="Which photo and size are you interested in?"
          buttonLabel="Request print"
        />
      </div>
    </main>
  );
}
