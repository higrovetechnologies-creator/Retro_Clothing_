import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import ProductCard from "../components/common/ProductCard";
import { EmptyState, FilterButton, SectionHeading } from "../components/common/Misc";
import { useProducts } from "../hooks/useStore";
import { CATEGORY_SIZES, CATEGORIES } from "../lib/data";
import Seo from "../components/common/Seo";
import { STATIC_ROUTES } from "../lib/seoRoutes";
import { breadcrumbJsonLd } from "../lib/seoConfig";

const PRICE_BANDS = [
  { label: "Under ₹500", test: (p) => Number(p.now_price) < 500 },
  { label: "₹500 – ₹1,000", test: (p) => Number(p.now_price) >= 500 && Number(p.now_price) <= 1000 },
  { label: "₹1,000 – ₹1,500", test: (p) => Number(p.now_price) > 1000 && Number(p.now_price) <= 1500 },
  { label: "₹1,500+", test: (p) => Number(p.now_price) > 1500 },
];

const TAGS = [
  ["new", "New Arrival"],
  ["offer", "Offer Product"],
  ["featured", "Featured"],
];

const normalizeCategory = (value) => (value === "shirts" || value === "tees" || value === "pants" ? value : "all");

const routePathFor = (mode, category) => {
  if (mode === "new") return "/new-arrivals";
  if (mode === "offers") return "/offers";
  if (mode === "category") return `/${category}`;
  return "/collection";
};

export default function CollectionPage({ mode = "all", category, title, eyebrow }) {
  const products = useProducts();
  const seoRoute =
    STATIC_ROUTES.find((r) => r.path === routePathFor(mode, category)) || STATIC_ROUTES.find((r) => r.path === "/collection");
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [debounced, setDebounced] = useState(query);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fixedCategory = mode === "category" ? category : null;
  const filterCategory = fixedCategory || normalizeCategory(params.get("category"));
  const priceBand = params.get("price") === null ? null : Number(params.get("price"));
  const size = params.get("size") || null;
  const extra = useMemo(
    () => ({
      new: mode !== "new" && params.get("tagNew") === "1",
      offer: mode !== "offers" && params.get("tagOffer") === "1",
      featured: mode !== "featured" && params.get("tagFeatured") === "1",
    }),
    [mode, params]
  );

  const updateParams = (changes) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "" || value === false) next.delete(key);
        else next.set(key, String(value));
      });
      return next;
    });
  };

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setQuery(params.get("q") || "");
  }, [params]);

  const availableSizes = useMemo(() => {
    if (filterCategory === "all") return [...CATEGORY_SIZES.shirts, ...CATEGORY_SIZES.pants];
    return CATEGORY_SIZES[filterCategory] || [];
  }, [filterCategory]);

  useEffect(() => {
    if (size && !availableSizes.includes(size)) {
      setParams((current) => {
        const next = new URLSearchParams(current);
        next.delete("size");
        return next;
      });
    }
  }, [availableSizes, size, setParams]);

  const base = useMemo(() => {
    let list = products;
    if (mode === "new") list = list.filter((p) => p.is_new_arrival);
    if (mode === "offers") list = list.filter((p) => p.is_offer);
    if (fixedCategory) list = list.filter((p) => p.category === fixedCategory);
    else if (filterCategory !== "all") list = list.filter((p) => p.category === filterCategory);
    return list;
  }, [products, mode, fixedCategory, filterCategory]);

  const filtered = useMemo(() => {
    let list = base;

    if (debounced.trim()) {
      const q = debounced.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.product_code.toLowerCase().includes(q)
      );
    }

    if (priceBand !== null && PRICE_BANDS[priceBand]) {
      list = list.filter(PRICE_BANDS[priceBand].test);
    }
    if (size) list = list.filter((p) => p.sizes.includes(size));
    if (extra.new) list = list.filter((p) => p.is_new_arrival);
    if (extra.offer) list = list.filter((p) => p.is_offer);
    if (extra.featured) list = list.filter((p) => p.is_featured);

    return list;
  }, [base, debounced, priceBand, size, extra]);

  const activeFilterCount =
    (priceBand !== null && PRICE_BANDS[priceBand] ? 1 : 0) +
    (size ? 1 : 0) +
    Object.values(extra).filter(Boolean).length +
    (!fixedCategory && filterCategory !== "all" ? 1 : 0);

  const selectCategory = (nextCategory) => {
    const categoryValue = normalizeCategory(nextCategory);
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (categoryValue === "all") next.delete("category");
      else next.set("category", categoryValue);
      next.delete("size");
      return next;
    });
  };

  const selectPrice = (index) => {
    updateParams({ price: priceBand === index ? null : index });
  };

  const selectSize = (nextSize) => {
    updateParams({ size: size === nextSize ? null : nextSize });
  };

  const toggleTag = (key) => {
    const paramKey = `tag${key[0].toUpperCase()}${key.slice(1)}`;
    updateParams({ [paramKey]: extra[key] ? null : 1 });
  };

  const clearFilters = () => {
    setQuery("");
    setParams({});
  };

  const showCategory = ["all", "new", "offers"].includes(mode);
  const visibleTags = TAGS.filter(([key]) => {
    if (mode === "new" && key === "new") return false;
    if (mode === "offers" && key === "offer") return false;
    if (mode === "featured" && key === "featured") return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-32 sm:px-8">
      <Seo
        title={seoRoute.title}
        description={seoRoute.description}
        path={seoRoute.path}
        jsonLd={breadcrumbJsonLd(seoRoute.breadcrumbs)}
      />
      <SectionHeading eyebrow={eyebrow} title={title} as="h1" />

      {showCategory && (
        <div className="mb-7 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[{ slug: "all", label: "All" }, ...CATEGORIES].map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => selectCategory(item.slug)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors ${
                filterCategory === item.slug
                  ? "border-bone bg-bone text-ink"
                  : "border-line-strong text-bone hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              updateParams({ q: e.target.value || null });
            }}
            placeholder="Search this collection…"
            className="glass h-11 w-full rounded-full pl-10 pr-4 text-sm text-bone placeholder:text-mist focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-mist">{filtered.length} products</p>
          <FilterButton onClick={() => setFiltersOpen(true)} active={activeFilterCount > 0} />
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-widest text-mist underline underline-offset-4 transition-colors hover:text-bone"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          actionLabel="Clear Filters"
          onAction={clearFilters}
          message="Try changing your search or filters."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        mode={mode}
        showCategory={showCategory}
        category={filterCategory}
        onCategoryChange={selectCategory}
        priceBand={priceBand}
        onPriceChange={selectPrice}
        size={size}
        availableSizes={availableSizes}
        onSizeChange={selectSize}
        extra={extra}
        visibleTags={visibleTags}
        onTagToggle={toggleTag}
        onClear={clearFilters}
      />
    </div>
  );
}

function FilterDrawer({
  open,
  onClose,
  showCategory,
  category,
  onCategoryChange,
  priceBand,
  onPriceChange,
  size,
  availableSizes,
  onSizeChange,
  extra,
  visibleTags,
  onTagToggle,
  onClear,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed inset-x-0 bottom-0 z-[80] max-h-[80vh] overflow-y-auto rounded-t-[26px] p-6 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-sm sm:rounded-t-none"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl text-bone">Filters</h3>
              <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5" aria-label="Close filters">
                <X size={18} strokeWidth={1.75} className="text-bone" />
              </button>
            </div>

            <div className="space-y-8">
              {showCategory && (
                <div>
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {[{ slug: "all", label: "All" }, ...CATEGORIES].map((item) => (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => onCategoryChange(item.slug)}
                        className={`rounded-full border px-3.5 py-2 text-xs transition-colors ${
                          category === item.slug
                            ? "border-bone bg-bone text-ink"
                            : "border-line-strong text-bone hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">Size</p>
                <div className="flex flex-wrap gap-2">
                  {category === "all" ? (
                    <>
                      <div className="w-full">
                        <p className="mb-2 text-[10px] uppercase tracking-widest text-mist/80">Clothing Sizes</p>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.filter((s) => ["M", "L", "XL"].includes(s)).map((s) => (
                            <SizeButton key={s} value={s} selected={size === s} onClick={() => onSizeChange(s)} />
                          ))}
                        </div>
                      </div>
                      <div className="w-full pt-2">
                        <p className="mb-2 text-[10px] uppercase tracking-widest text-mist/80">Pant Sizes</p>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.filter((s) => ["28", "30", "32", "34", "36"].includes(s)).map((s) => (
                            <SizeButton key={s} value={s} selected={size === s} onClick={() => onSizeChange(s)} />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    availableSizes.map((s) => (
                      <SizeButton key={s} value={s} selected={size === s} onClick={() => onSizeChange(s)} />
                    ))
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">Price</p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_BANDS.map((b, i) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => onPriceChange(i)}
                      className={`rounded-full border px-3.5 py-2 text-xs transition-colors ${
                        priceBand === i ? "border-bone bg-bone text-ink" : "border-line-strong text-bone hover:bg-white/5"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">Tag</p>
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onTagToggle(key)}
                      className={`rounded-full border px-3.5 py-2 text-xs transition-colors ${
                        extra[key] ? "border-bone bg-bone text-ink" : "border-line-strong text-bone hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button
                onClick={onClear}
                className="flex-1 rounded-full border border-line-strong py-3 text-xs font-medium uppercase tracking-widest text-bone transition-colors hover:bg-white/5"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-full bg-bone py-3 text-xs font-medium uppercase tracking-widest text-ink"
              >
                Show Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SizeButton({ value, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 min-w-10 rounded-full border px-3 text-xs transition-colors ${
        selected ? "border-bone bg-bone text-ink" : "border-line-strong text-bone hover:bg-white/5"
      }`}
    >
      {value}
    </button>
  );
}
