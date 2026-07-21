import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "smallsecretalbum",
  description: "Street scenes and small secrets. Photography by Olha Rykhliuk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-[14px]">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
