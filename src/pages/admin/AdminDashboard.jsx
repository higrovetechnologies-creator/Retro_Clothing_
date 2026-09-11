import { Link } from "react-router-dom";
import { useAnnouncements, useMessages, useProducts } from "../../hooks/useStore";

export default function AdminDashboard() {
  const products = useProducts();
  const announcements = useAnnouncements();
  const messages = useMessages();

  const stats = [
    { label: "Total Products", value: products.length, to: "/admin/products" },
    { label: "Shirts", value: products.filter((p) => p.category === "shirts").length, to: "/admin/products" },
    { label: "Tees", value: products.filter((p) => p.category === "tees").length, to: "/admin/products" },
    { label: "Pants", value: products.filter((p) => p.category === "pants").length, to: "/admin/products" },
    { label: "New Arrivals", value: products.filter((p) => p.is_new_arrival).length, to: "/admin/products" },
    { label: "Offer Products", value: products.filter((p) => p.is_offer).length, to: "/admin/products" },
    { label: "Featured Products", value: products.filter((p) => p.is_featured).length, to: "/admin/products" },
    { label: "Announcements", value: announcements.length, to: "/admin/announcements" },
    { label: "Contact Messages", value: messages.length, to: "/admin/messages" },
  ];

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-widest text-mist">Overview</p>
      <h1 className="mt-2 font-display text-3xl text-bone">Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="glass rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
          >
            <p className="font-display text-3xl text-bone">{s.value}</p>
            <p className="mt-1 text-[12px] text-mist">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 glass rounded-2xl p-6">
        <p className="mb-4 font-display text-xl text-bone">Latest Contact Messages</p>
        {messages.length === 0 ? (
          <p className="text-sm text-mist">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.slice(0, 4).map((m) => (
              <div key={m.id} className="flex items-center justify-between border-b border-line pb-3 last:border-0">
                <div>
                  <p className="text-sm text-bone">{m.name}</p>
                  <p className="text-xs text-mist">{m.email}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${m.status === "new" ? "bg-bone text-ink" : "text-mist"}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
