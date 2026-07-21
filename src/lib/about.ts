import { prisma } from "@/lib/prisma";

// The bio shown before anything has been saved in the admin editor. Blank lines
// separate paragraphs.
export const DEFAULT_ABOUT_BODY = `I'm a street photographer — originally from Ukraine, and now in San Francisco after years shooting the streets of Los Angeles.

smallsecretalbum is where I keep the street scenes and small secrets I collect along the way: everyday moments, in-between light, and the people who pass through it.`;

// There is a single about row, keyed by the fixed id "about".
const ABOUT_ID = "about";

export type AboutContent = {
  body: string;
  portraitUrl: string | null;
  email: string | null;
};

// Returns the saved about content, filling in the default bio if none is saved.
export async function getAbout(): Promise<AboutContent> {
  const row = await prisma.aboutPage.findUnique({ where: { id: ABOUT_ID } });
  return {
    body: row?.body ?? DEFAULT_ABOUT_BODY,
    portraitUrl: row?.portraitUrl ?? null,
    email: row?.email ?? null,
  };
}

// Creates or updates the single about row.
export async function saveAbout(data: {
  body: string;
  portraitUrl: string | null;
  email: string | null;
}) {
  return prisma.aboutPage.upsert({
    where: { id: ABOUT_ID },
    create: { id: ABOUT_ID, ...data },
    update: data,
  });
}
