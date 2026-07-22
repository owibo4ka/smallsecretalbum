# smallsecretalbum 📷

A personal **photography blog & portfolio** — a full-bleed rotating hero, a filterable gallery with a fullscreen lightbox, a Markdown-powered journal, an editable About page, a print-request flow, and a private contact inbox. Everything (photos, posts, bio, messages) is managed from a built-in admin dashboard — no code edits needed to add content.

🔗 **Live site:** https://smallsecretalbum.vercel.app

> This README doubles as a **recipe**: if you want to build a site like this, everything you need — the tools, the accounts, and the steps — is written down below.

---

## What it can do

- **Home hero** — a fullscreen slideshow that rotates through photos *and* featured blog posts (a featured post shows its cover + title and links to the story).
- **Works gallery** — masonry grid with category filters and a fullscreen lightbox (arrow keys, thumbnails, optional film-stock captions).
- **Journal** — blog posts written in **Markdown** (bold, headings, lists, links), with photos inlined in the text *and* a photo set at the end you can flip through in the lightbox.
- **About** — bio, portrait, and Instagram link, all editable from the admin (no code).
- **Prints** — a landing page with a print-request form and a link to an external print shop.
- **Contact form** — visitors message you without ever seeing your email; messages land in a private admin inbox (with spam protection).
- **Admin dashboard** — manage posts, gallery photos (upload, reorder, categorize, feature), the About page, and messages. Supports **multiple admins**.
- **Friendly 404** and mobile-responsive throughout.

---

## The recipe (tech stack)

| Layer | Tool | What it does here |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, TypeScript) | The whole app — pages, server actions, API routes |
| **UI** | [React 19](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com) | Components and styling ([Urbanist](https://fonts.google.com/specimen/Urbanist) font) |
| **Design** | [Figma](https://figma.com) | Where the visual design lives; screens were built from Figma frames |
| **Database** | [Neon](https://neon.tech) (hosted Postgres) + [Prisma 7](https://prisma.io) | Stores posts, photos' metadata, about text, and messages |
| **Auth** | [Neon Auth](https://neon.tech/docs/guides/neon-auth) (built on Better Auth) | Admin sign-in / sessions |
| **Image storage** | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | Stores the actual photo files; the DB stores their URLs |
| **Content** | [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) | Renders post & bio Markdown (safely — raw HTML is escaped) |
| **Validation** | [Zod](https://zod.dev) | Validates form input in server actions |
| **Hosting** | [Vercel](https://vercel.com) | Builds & serves the site, auto-deploys on every push |

**The mental model:** *text* lives in the **Neon database**, *images* live in **Vercel Blob** (the database just stores links to them), *logins* are handled by **Neon Auth**, the site is **designed in Figma** and **hosted on Vercel**.

---

## Accounts you'll need (all have free tiers)

1. **[GitHub](https://github.com)** — to host the code (and connect to Vercel).
2. **[Neon](https://neon.tech)** — hosted Postgres database **+** Neon Auth (both from one project).
3. **[Vercel](https://vercel.com)** — hosting + Blob image storage (sign in with GitHub).
4. **[Figma](https://figma.com)** — *(optional)* if you want to design your own screens first.

---

## Run it locally

**Prerequisites:** [Node.js](https://nodejs.org) 20+ and npm.

```bash
# 1. Clone and install
git clone https://github.com/owibo4ka/smallsecretalbum.git
cd smallsecretalbum
npm install

# 2. Create your environment file (see the table below)
cp .env.example .env    # then fill in the values

# 3. Set up the database (creates the tables from the schema)
npx prisma migrate dev

# 4. Start the dev server
npm run dev
```

Open http://localhost:3000. Create your admin account at `/auth/sign-in` (use the same email you set as `ADMIN_EMAIL`), then manage content at `/admin/posts`.

---

## Environment variables

Create a `.env` file in the project root with these five keys:

| Variable | Where it comes from |
|---|---|
| `DATABASE_URL` | Neon → your project → **Connection string** (use the pooled URL) |
| `NEON_AUTH_BASE_URL` | Neon → **Auth** → the auth server base URL |
| `NEON_AUTH_COOKIE_SECRET` | Any random 32+ char string — generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Your email. **Comma-separate** for multiple admins: `me@x.com,editor@x.com` |
| `BLOB_READ_WRITE_TOKEN` | Vercel → **Storage → Blob** → your store → read/write token |

> `.env` is gitignored — **never commit real secrets**. Keep an `.env.example` with blank values as a template.

---

## Deploy to Vercel

1. Push your code to GitHub.
2. On **Vercel → Add New → Project**, import the repo (grant the Vercel GitHub App access if it's private).
3. Add the **same five environment variables** in the Vercel project settings.
4. Click **Deploy**.
5. **Important — fix auth for your live domain:** in the **Neon Console → Auth → Trusted domains**, add your production URL (e.g. `https://your-app.vercel.app`). Otherwise sign-in fails with an "invalid origin" error. Localhost is trusted by default; your live domain must be added explicitly.

After that, every `git push` to `main` auto-deploys. 🎉

---

## How it's organized

```
src/
├─ app/                # Pages & routes (App Router)
│  ├─ page.tsx         # Home (hero slideshow)
│  ├─ works/           # Gallery
│  ├─ journal/         # Blog index
│  ├─ posts/[slug]/    # A single post
│  ├─ about/           # About + contact form
│  ├─ prints/          # Print requests
│  ├─ admin/           # Admin dashboard (auth-gated)
│  ├─ auth/sign-in/    # Admin login
│  └─ api/             # Upload + auth handler routes
├─ components/         # Shared UI (lightbox, markdown, contact form…)
├─ lib/                # Data access + server actions (the "backend")
│  ├─ posts.ts, gallery.ts, about.ts, contact.ts   # DB reads/writes
│  ├─ *-actions.ts     # Server actions (form handlers)
│  └─ auth/            # Sign-in gate (requireAdmin) + admin allowlist
└─ generated/prisma/   # Auto-generated DB client (gitignored)

prisma/schema.prisma   # The database shape (Post, Photo, AboutPage, ContactMessage)
```

**A few patterns worth knowing:**
- **Data-access layer** (`src/lib/*.ts`): the rest of the app never touches the database directly — it goes through these functions. One place to change if the DB changes.
- **Server actions** (`"use server"`): form submissions run on the server; every admin action calls `requireAdmin()` so nothing is writable without logging in.
- **Client uploads:** the browser gets a short-lived token from `/api/upload` (admin only) and uploads photos straight to Vercel Blob.
- **Content is dynamic:** public pages read fresh from the database on each visit, so edits appear immediately.

---

## Roadmap / ideas to extend

- Private **client share links** (unguessable URL → a hand-picked photo set)
- Email notifications for new contact messages (e.g. via [Resend](https://resend.com))
- A `robots.txt` to control crawlers
- A custom domain (set it in Vercel → Domains, then add it to Neon trusted domains too)

---

## Tech notes

- Node 20+, Next.js 16 (App Router), React 19, Prisma 7 with the `@prisma/adapter-pg` driver.
- After changing `prisma/schema.prisma`, run `npx prisma migrate dev` **and** `npx prisma generate`.
- Scripts: `npm run dev` · `npm run build` · `npm run lint`.

---

*Built by [Olha Rykhliuk](https://www.instagram.com/smallsecretalbum/). Feel free to use this as a starting point for your own photography site.* ✨
