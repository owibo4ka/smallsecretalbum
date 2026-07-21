/* eslint-disable @next/next/no-img-element */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders Markdown as styled HTML. react-markdown escapes raw HTML by default,
// so this is safe. Element styles are mapped to Tailwind to match the site's
// look (Urbanist, ink tones). Reused by blog posts and the about bio.
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
          p: ({ children }) => <p>{children}</p>,
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
