import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useProducts } from "../../hooks/useStore";
import { db } from "../../lib/store";
import { EmptyState } from "../../components/common/Misc";

export default function AdminProducts() {
  const products = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let list = products;

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase();

      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.product_code?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, category, query]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-mist">
            Manage
          </p>

          <h1 className="mt-2 font-display text-3xl text-bone">
            Products
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-bone px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink"
        >
          <Plus size={14} strokeWidth={2} />
          Add Product
        </Link>
      </div>

      {/* Search + Category */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="glass h-11 w-full rounded-full pl-10 pr-4 text-sm text-bone placeholder:text-mist focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {["all", "shirts", "tees", "pants"].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3.5 py-2 text-xs capitalize transition-colors ${
                category === c
                  ? "border-bone bg-bone text-ink"
                  : "border-line-strong text-bone hover:bg-white/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState
            title="No products found"
            message="Try a different search or category."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line">
            {/* Desktop Header */}
            <div className="hidden grid-cols-[64px_2fr_1fr_1fr_1.2fr_1fr_auto] gap-4 border-b border-line bg-charcoal/40 px-4 py-3 text-[11px] uppercase tracking-widest text-mist sm:grid">
              <span></span>
              <span>Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Tags</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Product Rows */}
            {filtered.map((p) => {
              const isOutOfStock = p.stock_status === "out_of_stock";

              return (
                <div
                  key={p.id}
                  className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[64px_2fr_1fr_1fr_1.2fr_1fr_auto]"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={p.images?.[0]}
                      alt=""
                      className={`h-14 w-12 rounded-lg object-cover ${
                        isOutOfStock ? "opacity-50 grayscale" : ""
                      }`}
                    />
                  </div>

                  {/* Name */}
                  <div className="min-w-0">
                    <p className="truncate text-sm text-bone">
                      {p.name}
                    </p>

                    <p className="text-[11px] text-mist">
                      {p.product_code}
                    </p>

                    {/* Mobile Stock Status */}
                    <div className="mt-1.5 sm:hidden">
                      <StockBadge
                        status={p.stock_status}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <span className="hidden text-sm capitalize text-mist sm:block">
                    {p.category}
                  </span>

                  {/* Price */}
                  <span className="hidden text-sm text-bone sm:block">
                    ₹{p.now_price}
                  </span>

                  {/* Stock */}
                  <div className="hidden sm:block">
                    <StockBadge
                      status={p.stock_status}
                    />
                  </div>

                  {/* Tags */}
                  <div className="hidden flex-wrap gap-1 sm:flex">
                    {p.is_new_arrival && <Tag>New</Tag>}
                    {p.is_offer && <Tag>Offer</Tag>}
                    {p.is_featured && <Tag>Featured</Tag>}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-mist hover:bg-white/5 hover:text-bone"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil size={14} strokeWidth={1.75} />
                    </Link>

                    <button
                      onClick={() => setConfirmDelete(p)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-mist hover:bg-white/5 hover:text-bone"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4">
          <div className="glass-strong w-full max-w-sm rounded-2xl p-6 text-center">
            <p className="font-display text-xl text-bone">
              Delete product?
            </p>

            <p className="mt-2 text-sm text-mist">
              “{confirmDelete.name}” will be permanently removed and
              disappear from the website immediately.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-full border border-line-strong py-2.5 text-xs uppercase tracking-widest text-bone hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  db.deleteProduct(confirmDelete.id)
                    .then(() => setConfirmDelete(null))
                    .catch((error) => alert(error?.message || "Unable to delete product."));
                }}
                className="flex-1 rounded-full bg-bone py-2.5 text-xs font-semibold uppercase tracking-widest text-ink"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   STOCK BADGE
============================================================ */

function StockBadge({ status }) {
  const out = status === "out_of_stock";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
        out
          ? "border-line-strong text-mist"
          : "border-line-strong text-bone"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${out ? "bg-red-500" : "bg-green-500"}`} />
      {out ? "Out of Stock" : "In Stock"}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-line-strong px-2 py-0.5 text-[10px] text-mist">
      {children}
    </span>
  );
}
