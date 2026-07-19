import Image from "next/image";

const categories = [
  "All",
  "Street Life",
  "Wandering",
  "Film Experiments",
  "People / Moments",
];

// Aspect ratios taken from the Figma layout.
const LANDSCAPE = "aspect-[3/2]";
const PORTRAIT_TALL = "aspect-[550/828]";
const PORTRAIT = "aspect-[3/4]";

// The gallery is arranged in three columns, matching the design. (These will
// come from the database once we build the photo model in a later stage.)
const columns: { src: string; aspect: string }[][] = [
  [
    { src: "/gallery/img-1415-5.jpg", aspect: LANDSCAPE },
    { src: "/gallery/img-2277.jpg", aspect: LANDSCAPE },
    { src: "/gallery/img-2837.jpg", aspect: LANDSCAPE },
    { src: "/gallery/img-2302.jpg", aspect: LANDSCAPE },
  ],
  [
    { src: "/gallery/img-1415-6.jpg", aspect: PORTRAIT_TALL },
    { src: "/gallery/img-2306.jpg", aspect: PORTRAIT },
    { src: "/gallery/img-2277.jpg", aspect: LANDSCAPE },
    { src: "/gallery/img-2306.jpg", aspect: PORTRAIT },
  ],
  [
    { src: "/gallery/img-1415-7.jpg", aspect: LANDSCAPE },
    { src: "/gallery/img-1415-2.jpg", aspect: LANDSCAPE },
    { src: "/gallery/img-1415-6.jpg", aspect: PORTRAIT_TALL },
    { src: "/gallery/img-2302.jpg", aspect: LANDSCAPE },
  ],
];

const imageSizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw";

export default function Home() {
  return (
    <main className="px-5 pt-24 pb-16 md:pt-40">
      <div className="flex items-center justify-between gap-4">
        {/* Category filters (visual for now — wiring comes with photo data). */}
        <nav className="flex flex-wrap items-center gap-3 font-semibold">
          {categories.map((category, i) => (
            <span key={category} className={i === 0 ? "" : "opacity-40"}>
              {category}
            </span>
          ))}
        </nav>

        {/* Grid / row view toggle. */}
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="p-0.5">
            <Image
              src="/icons/icon-squares-four.svg"
              alt="Grid view"
              width={20}
              height={20}
              unoptimized
            />
          </span>
          <span className="p-0.5 opacity-40">
            <Image
              src="/icons/icon-rows.svg"
              alt="Row view"
              width={20}
              height={20}
              unoptimized
            />
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-1 flex-col gap-5">
            {column.map((photo, i) => (
              <div key={i} className={`relative w-full ${photo.aspect}`}>
                <Image
                  src={photo.src}
                  alt="Photograph by Bara Bolka"
                  fill
                  sizes={imageSizes}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
