import { getContactMessages } from "@/lib/contact";
import {
  deleteMessageAction,
  markMessageReadAction,
} from "@/lib/contact-actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-2xl font-semibold">
        Messages{" "}
        {unread > 0 && (
          <span className="align-middle text-[14px] font-normal text-ink/50">
            ({unread} unread)
          </span>
        )}
      </h1>

      {messages.length === 0 ? (
        <p className="mt-6 text-ink/60">No messages yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded border p-4 ${
                m.read ? "border-ink/10" : "border-ink/40 bg-ink/[0.03]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {m.name}{" "}
                    {m.subject && (
                      <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-normal text-amber-800">
                        {m.subject}
                      </span>
                    )}
                    {!m.read && (
                      <span className="ml-1 rounded bg-ink px-1.5 py-0.5 text-[11px] font-normal text-paper">
                        new
                      </span>
                    )}
                  </p>
                  <a
                    href={`mailto:${m.email}?subject=Re: your message to smallsecretalbum`}
                    className="text-[13px] text-ink/60 underline hover:text-ink"
                  >
                    {m.email}
                  </a>
                </div>
                <p className="shrink-0 text-[12px] text-ink/50">
                  {m.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <p className="mt-3 leading-[1.5] whitespace-pre-wrap text-ink/90">
                {m.message}
              </p>

              <div className="mt-3 flex items-center gap-4 text-[13px]">
                <form action={markMessageReadAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <input
                    type="hidden"
                    name="read"
                    value={(!m.read).toString()}
                  />
                  <button type="submit" className="text-ink/60 hover:text-ink">
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                </form>
                <form action={deleteMessageAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
