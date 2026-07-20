export const metadata = {
  title: "About — smallsecretalbum",
};

export default function About() {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-24 pb-16 md:pt-40">
      <h1 className="text-2xl font-semibold">about</h1>
      <div className="mt-4 space-y-4 leading-[1.6] text-ink/80">
        <p>
          I&apos;m a street photographer — originally from Ukraine, and now in
          San Francisco after years shooting the streets of Los Angeles.
        </p>
        <p>
          smallsecretalbum is where I keep the street scenes and small secrets I
          collect along the way: everyday moments, in-between light, and the
          people who pass through it.
        </p>
      </div>
      <p className="mt-6">
        <a
          href="https://www.instagram.com/smallsecretalbum/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline transition-opacity hover:opacity-70"
        >
          Instagram
        </a>
      </p>
    </main>
  );
}
