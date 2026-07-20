import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "smallsecretalbum",
  description: "Street scenes and small secrets. Photography by Bara Bolka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-[14px]">
        <header
          id="top"
          className="flex items-center justify-between gap-4 px-5 py-3"
        >
          <div className="flex items-center gap-1.5">
            <Link href="/" className="font-semibold whitespace-nowrap">
              smallsecretalbum
            </Link>
            <span className="h-4 w-px shrink-0 bg-ink" aria-hidden="true" />
            <p className="leading-[1.3] text-ink/90">
              Street scenes and small secrets. Photography by{" "}
              <span className="font-semibold">Bara Bolka.</span>
            </p>
          </div>

          <nav className="flex shrink-0 items-center gap-3 font-semibold">
            <Link href="/journal" className="transition-opacity hover:opacity-60">
              journal
            </Link>
            <Link href="/about" className="transition-opacity hover:opacity-60">
              about
            </Link>
            <Link href="/contact" className="transition-opacity hover:opacity-60">
              contact
            </Link>
            <Link
              href="/print-shop"
              className="transition-opacity hover:opacity-60"
            >
              print shop
            </Link>
          </nav>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="flex items-center justify-between gap-4 px-5 pt-16 pb-5">
          <p className="leading-[1.3]">
            © smallsecretalbum, {new Date().getFullYear()}
          </p>
          <a
            href="#top"
            className="flex items-center gap-0.5 font-semibold transition-opacity hover:opacity-60"
          >
            Back to top
            <Image
              src="/icons/icon-arrow-up.svg"
              alt=""
              width={14}
              height={14}
              unoptimized
            />
          </a>
        </footer>
      </body>
    </html>
  );
}
