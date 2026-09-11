import { db } from "../../lib/store";
import { useMessages } from "../../hooks/useStore";
import { EmptyState } from "../../components/common/Misc";

export default function AdminMessages() {
  const messages = useMessages();

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-widest text-mist">Inbox</p>
      <h1 className="mt-2 font-display text-3xl text-bone">Contact Messages</h1>

      <div className="mt-8">
        {messages.length === 0 ? (
          <EmptyState title="No messages yet" message="Messages submitted through the Contact page will appear here." />
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="glass rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-bone">{m.name}</p>
                    <p className="text-xs text-mist">
                      {m.email} · {m.mobile}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${m.status === "new" ? "bg-bone text-ink" : "border border-line-strong text-mist"}`}>
                      {m.status}
                    </span>
                    {m.status === "new" && (
                      <button
                        onClick={() => {
                          db.markMessageRead(m.id).catch((error) => alert(error?.message || "Unable to update message."));

                        }}
                        className="text-[11px] uppercase tracking-widest text-mist underline underline-offset-4 hover:text-bone"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm text-mist">{m.message}</p>
                <p className="mt-3 text-[11px] text-mist/70">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
