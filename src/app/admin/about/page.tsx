import { getAbout } from "@/lib/about";
import { AboutEditor } from "./about-editor";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const about = await getAbout();

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-2xl font-semibold">Edit about page</h1>
      <AboutEditor initial={about} />
    </main>
  );
}
