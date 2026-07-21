import { getFeaturedPhotos, getGalleryPhotos } from "@/lib/gallery";
import { getFeaturedPosts } from "@/lib/posts";
import { HomeHero, type HeroItem } from "./home-hero";

// Always render from the current database so featured photos/posts show up right away.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredPhotos, featuredPosts] = await Promise.all([
    getFeaturedPhotos(),
    getFeaturedPosts(),
  ]);

  // Once anything is curated (a starred photo or post), show only that. Before
  // then, fall back to the whole gallery so the home screen is never empty.
  const curated = featuredPhotos.length > 0 || featuredPosts.length > 0;
  const photos = curated ? featuredPhotos : await getGalleryPhotos();

  // Featured posts lead, then the photos. A post needs a cover to be a slide.
  const postItems: HeroItem[] = featuredPosts
    .filter((p) => p.coverImageUrl)
    .map((p) => ({
      kind: "post",
      id: p.id,
      url: p.coverImageUrl as string,
      title: p.title,
      slug: p.slug,
    }));

  const photoItems: HeroItem[] = photos.map((p) => ({
    kind: "photo",
    id: p.id,
    url: p.url,
    category: p.category,
    alt: p.alt,
  }));

  return <HomeHero items={[...postItems, ...photoItems]} />;
}
