/* eslint-disable @next/next/no-img-element */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// A minimal shape for the hast nodes react-markdown hands to component
// renderers — enough to pull the plain text back out of a node.
type HastNode = {
  type?: string;
  value?: string;
  children?: HastNode[];
};

// Flatten a node's text content (used to detect a paragraph that is just a URL).
function nodeText(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(nodeText).join("");
}

// Extract an 11-char YouTube video id from the common URL shapes, or null.
function youTubeId(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  const ok = (id: string | null | undefined) =>
    id && /^[\w-]{11}$/.test(id) ? id : null;

  if (host === "youtu.be") return ok(url.pathname.slice(1));
  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtube-nocookie.com"
  ) {
    if (url.pathname === "/watch") return ok(url.searchParams.get("v"));
    const m = url.pathname.match(/^\/(?:embed|shorts|v)\/([\w-]{11})/);
    if (m) return ok(m[1]);
  }
  return null;
}

// A privacy-friendly (nocookie), responsive 16:9 YouTube embed.
function YouTubeEmbed({ id }: { id: string }) {
  return (
    <div
      className="relative my-6 overflow-hidden rounded bg-ink/5"
      style={{ paddingTop: "56.25%" }}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title="Embedded video"
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

// Renders Markdown as styled HTML. react-markdown escapes raw HTML by default,
// so this is safe. Element styles are mapped to Tailwind to match the site's
// look (Urbanist, ink tones). Reused by blog posts and the about bio.
//
// Video: a paragraph that is nothing but a YouTube URL is turned into a
// responsive embed — so authors paste a link on its own line, no raw HTML.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-4 leading-[1.6] text-ink/80">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-ink">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 text-xl font-semibold tracking-tight text-ink">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 text-lg font-semibold text-ink">{children}</h3>
          ),
          p: ({ children, node }) => {
            // If the whole paragraph is a single YouTube URL, embed the video
            // instead of rendering a bare link.
            const text = nodeText(node as HastNode).trim();
            if (/^\S+$/.test(text)) {
              const id = youTubeId(text);
              if (id) return <YouTubeEmbed id={id} />;
            }
            return <p>{children}</p>;
          },
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                className="font-medium text-ink underline transition-opacity hover:opacity-70"
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-5">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-ink/30 pl-4 text-ink/70 italic">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-ink">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => (
            <code className="rounded bg-ink/[0.06] px-1 py-0.5 font-mono text-[0.9em]">
              {children}
            </code>
          ),
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              <img
                src={src}
                alt={alt ?? ""}
                loading="lazy"
                className="my-6 h-auto w-full rounded"
              />
            ) : null,
          hr: () => <hr className="border-ink/15" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
