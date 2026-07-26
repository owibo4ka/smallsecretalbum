import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  AUTHOR_NAME,
} from "@/lib/site";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  // Absolute base for resolving relative URLs in Open Graph / Twitter tags.
  metadataBase: new URL(SITE_URL),
  // `default` is used as-is; `template` wraps a page's own title, e.g. a post
  // shows "Post title · smallsecretalbum".
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // The share card shown when a link is posted to social/messaging apps. Images
  // are added in a later stage; the text is in place now.
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

// Structured data describing the site and its author to search engines and AI.
// Rendered as a <script> tag per the Next.js JSON-LD guidance; the `<` escape
// guards against any HTML sneaking into the strings.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      url: `${SITE_URL}/about`,
      jobTitle: "Photographer",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-[14px]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
