import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const posts = [
  {
    title: "Hello, world",
    slug: "hello-world",
    content:
      "This is the first post on my photography blog. More to come soon — " +
      "writing, photos, and the occasional behind-the-scenes note.",
    published: true,
  },
  {
    title: "Chasing golden hour",
    slug: "chasing-golden-hour",
    content:
      "Notes on shooting in the last hour before sunset: the light is soft, " +
      "the shadows are long, and everything looks a little more cinematic.",
    published: true,
  },
  {
    title: "A draft no one can see yet",
    slug: "secret-draft",
    content: "This post is unpublished, so it should NOT appear on the site.",
    published: false,
  },
];

async function main() {
  for (const post of posts) {
    // upsert keyed on the unique slug, so re-running the seed is safe.
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`Seeded ${posts.length} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
