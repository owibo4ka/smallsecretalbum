import type { MetadataRoute } from "next";

// Served at /robots.txt. Search engines (Google, Bing, DuckDuckGo, etc.) are
// welcome so the site stays findable — we only hide the admin/auth/api paths
// that shouldn't be indexed. AI-training and bulk-scraper crawlers are asked
// to stay out entirely, to discourage mass-harvesting of the photos. This is a
// polite request, not a wall: well-behaved bots honour it, but it can't stop a
// determined human from downloading images shown on any public page.
const AI_AND_SCRAPER_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalAgent",
  "meta-externalagent",
  "FacebookBot",
  "ImagesiftBot",
  "Diffbot",
  "Omgilibot",
  "cohere-ai",
  "YouBot",
  "DuckAssistBot",
  "Timpibot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/auth/", "/api/"],
      },
      {
        userAgent: AI_AND_SCRAPER_BOTS,
        disallow: "/",
      },
    ],
    host: "https://smallsecretalbum.vercel.app",
  };
}
