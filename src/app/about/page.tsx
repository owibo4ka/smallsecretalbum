/* eslint-disable @next/next/no-img-element */

import { getAbout } from "@/lib/about";
import { Markdown } from "@/components/markdown";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "About — smallsecretalbum",
};

// The bio, portrait, and contact form are editable from /admin/about. The bio
// supports Markdown (bold, headings, lists, links).
export default async function About() {
  const { body, portraitUrl } = await getAbout();

  return (
    <main className="px-5 pt-24 pb-16 md:pt-48">
      <div className="flex flex-col gap-8 md:flex-row md:gap-5">
        <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight md:w-[40%] md:text-[48px]">
          about
        </h1>

        <div className="flex flex-col gap-6 md:w-[60%]">
          {portraitUrl && (
            <img
              src={portraitUrl}
              alt="Olha Rykhliuk"
              className="w-full max-w-[407px] object-cover"
            />
          )}

          <div className="max-w-[840px]">
            <Markdown>{body}</Markdown>
          </div>

          <a
            href="https://www.instagram.com/smallsecretalbum/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold transition-opacity hover:opacity-60"
          >
            Instagram
          </a>

          <div className="mt-4 border-t border-ink/10 pt-6">
            <h2 className="font-semibold">Get in touch</h2>
            <p className="mt-1 mb-4 text-ink/60">
              For prints, commissions, or just to say hello.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
