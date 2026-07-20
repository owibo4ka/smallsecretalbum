export const metadata = {
  title: "Contact — smallsecretalbum",
};

export default function Contact() {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-24 pb-16 md:pt-40">
      <h1 className="text-2xl font-semibold">contact</h1>
      <p className="mt-4 leading-[1.6] text-ink/80">
        For prints, commissions, or just to say hello — reach me on Instagram.
      </p>
      <p className="mt-6">
        <a
          href="https://www.instagram.com/smallsecretalbum/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline transition-opacity hover:opacity-70"
        >
          @smallsecretalbum
        </a>
      </p>
    </main>
  );
}
