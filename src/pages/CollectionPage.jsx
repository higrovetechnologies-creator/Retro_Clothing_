import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

import ProductCard from "../components/common/ProductCard";

import {
  EmptyState,
  FilterButton,
  SectionHeading,
} from "../components/common/Misc";

import { useProducts } from "../hooks/useStore";

import {
  CATEGORY_SIZES,
  CATEGORIES,
} from "../lib/data";

import Seo from "../components/common/Seo";

import { STATIC_ROUTES } from "../lib/seoRoutes";

import { breadcrumbJsonLd } from "../lib/seoConfig";

/* ============================================================
   PRICE BANDS
============================================================ */

const PRICE_BANDS = [
  {
    label: "Under ₹500",
    test: (p) =>
      Number(p.now_price) < 500,
  },

  {
    label: "₹500 – ₹1,000",
    test: (p) =>
      Number(p.now_price) >= 500 &&
      Number(p.now_price) <= 1000,
  },

  {
    label: "₹1,000 – ₹1,500",
    test: (p) =>
      Number(p.now_price) > 1000 &&
      Number(p.now_price) <= 1500,
  },

  {
    label: "₹1,500+",
    test: (p) =>
      Number(p.now_price) > 1500,
  },
];

/* ============================================================
   TAGS
============================================================ */

const TAGS = [
  ["new", "New Arrival"],
  ["offer", "Offer Product"],
  ["featured", "Featured"],
];

/* ============================================================
   COMBO SIZE GROUPS
============================================================ */

const COMBO_SHIRT_SIZES = [
  "M",
  "L",
  "XL",
];

const COMBO_PANT_SIZES = [
  "28",
  "30",
  "32",
  "34",
  "36",
];

/* ============================================================
   COLLECTION CATEGORIES
     
   IMPORTANT:
   Combo is NOT added to CATEGORIES in data.js.
     
   It is added only to Collection page UI.
============================================================ */

const COLLECTION_CATEGORIES = [
  ...CATEGORIES,
  {
    slug: "combo",
    label: "Combo",
  },
];

/* ============================================================
   CATEGORY NORMALIZER
============================================================ */

const normalizeCategory = (value) =>
  [
    "shirts",
    "tees",
    "pants",
    "combo",
  ].includes(value)
    ? value
    : "all";

/* ============================================================
   ROUTE HELPER
============================================================ */

const routePathFor = (
  mode,
  category
) => {
  if (mode === "new") {
    return "/new-arrivals";
  }

  if (mode === "offers") {
    return "/offers";
  }

  if (mode === "category") {
    return `/${category}`;
  }

  return "/collection";
};

/* ============================================================
   COLLECTION PAGE
============================================================ */

export default function CollectionPage({
  mode = "all",
  category,
  title,
  eyebrow,
}) {
  const products = useProducts();

  /* ==========================================================
     SEO
  ========================================================== */

  const seoRoute =
    STATIC_ROUTES.find(
      (r) =>
        r.path ===
        routePathFor(
          mode,
          category
        )
    ) ||
    STATIC_ROUTES.find(
      (r) =>
        r.path === "/collection"
    );

  /* ==========================================================
     URL PARAMS
  ========================================================== */

  const [params, setParams] =
    useSearchParams();

  /* ==========================================================
     SEARCH
  ========================================================== */

  const [query, setQuery] =
    useState(
      params.get("q") || ""
    );

  const [debounced, setDebounced] =
    useState(query);

  /* ==========================================================
     FILTER DRAWER
  ========================================================== */

  const [
    filtersOpen,
    setFiltersOpen,
  ] = useState(false);

  /* ==========================================================
     FIXED CATEGORY
  ========================================================== */

  const fixedCategory =
    mode === "category"
      ? category
      : null;

  /* ==========================================================
     FILTER CATEGORY
  ========================================================== */

  const filterCategory =
    fixedCategory ||
    normalizeCategory(
      params.get("category")
    );

  /* ==========================================================
     PRICE FILTER
  ========================================================== */

  const priceBand =
    params.get("price") === null
      ? null
      : Number(
          params.get("price")
        );

  /* ==========================================================
     NORMAL SIZE FILTER
     
     Used by:
     Shirts
     Tees
     Pants
     
     NOT used as the primary Combo filter.
  ========================================================== */

  const size =
    params.get("size") || null;

  /* ==========================================================
     COMBO SIZE FILTERS
     
     Combo supports:
     
     Shirt only
     Pant only
     Shirt + Pant together
  ========================================================== */

  const comboShirtSize =
    params.get("shirtSize") ||
    null;

  const comboPantSize =
    params.get("pantSize") ||
    null;

  /* ==========================================================
     EXTRA FILTERS
  ========================================================== */

  const extra = useMemo(
    () => ({
      new:
        mode !== "new" &&
        params.get("tagNew") === "1",

      offer:
        mode !== "offers" &&
        params.get("tagOffer") === "1",

      featured:
        mode !== "featured" &&
        params.get("tagFeatured") ===
          "1",
    }),
    [mode, params]
  );

  /* ==========================================================
     UPDATE URL PARAMS
  ========================================================== */

  const updateParams = (
    changes
  ) => {
    setParams((current) => {
      const next =
        new URLSearchParams(
          current
        );

      Object.entries(
        changes
      ).forEach(
        ([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            value === false
          ) {
            next.delete(key);
          } else {
            next.set(
              key,
              String(value)
            );
          }
        }
      );

      return next;
    });
  };

  /* ==========================================================
     DEBOUNCE SEARCH
  ========================================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(query);
    }, 300);

    return () =>
      clearTimeout(timer);
  }, [query]);

  /* ==========================================================
     SYNC SEARCH WITH URL
  ========================================================== */

  useEffect(() => {
    setQuery(
      params.get("q") || ""
    );
  }, [params]);

  /* ==========================================================
     AVAILABLE NORMAL SIZES
  ========================================================== */

  const availableSizes =
    useMemo(() => {
      if (
        filterCategory === "all"
      ) {
        return Array.from(
          new Set([
            ...(CATEGORY_SIZES.shirts ||
              []),

            ...(CATEGORY_SIZES.pants ||
              []),
          ])
        );
      }

      /*
       * Combo has its own
       * Shirt/Pant size selectors.
       */
      if (
        filterCategory ===
        "combo"
      ) {
        return [];
      }

      return (
        CATEGORY_SIZES[
          filterCategory
        ] || []
      );
    }, [filterCategory]);

  /* ==========================================================
     REMOVE INVALID NORMAL SIZE FILTER
     
     This is only for:
     Shirts / Tees / Pants
     
     Combo uses shirtSize + pantSize.
  ========================================================== */

  useEffect(() => {
    if (
      filterCategory ===
      "combo"
    ) {
      return;
    }

    if (
      size &&
      !availableSizes.includes(
        size
      )
    ) {
      setParams((current) => {
        const next =
          new URLSearchParams(
            current
          );

        next.delete("size");

        return next;
      });
    }
  }, [
    availableSizes,
    size,
    filterCategory,
    setParams,
  ]);

  /* ==========================================================
     REMOVE INVALID COMBO SHIRT SIZE
  ========================================================== */

  useEffect(() => {
    if (
      filterCategory !==
      "combo"
    ) {
      return;
    }

    if (
      comboShirtSize &&
      !COMBO_SHIRT_SIZES.includes(
        comboShirtSize
      )
    ) {
      setParams((current) => {
        const next =
          new URLSearchParams(
            current
          );

        next.delete(
          "shirtSize"
        );

        return next;
      });
    }
  }, [
    filterCategory,
    comboShirtSize,
    setParams,
  ]);

  /* ==========================================================
     REMOVE INVALID COMBO PANT SIZE
  ========================================================== */

  useEffect(() => {
    if (
      filterCategory !==
      "combo"
    ) {
      return;
    }

    if (
      comboPantSize &&
      !COMBO_PANT_SIZES.includes(
        comboPantSize
      )
    ) {
      setParams((current) => {
        const next =
          new URLSearchParams(
            current
          );

        next.delete(
          "pantSize"
        );

        return next;
      });
    }
  }, [
    filterCategory,
    comboPantSize,
    setParams,
  ]);

  /* ==========================================================
     BASE PRODUCT LIST
  ========================================================== */

  const base = useMemo(() => {
    let list = products;

    /* --------------------------------------------------------
       NEW ARRIVALS
    -------------------------------------------------------- */

    if (mode === "new") {
      list = list.filter(
        (p) =>
          p.is_new_arrival
      );
    }

    /* --------------------------------------------------------
       OFFERS
    -------------------------------------------------------- */

    if (mode === "offers") {
      list = list.filter(
        (p) =>
          p.is_offer
      );
    }

    /* --------------------------------------------------------
       FIXED CATEGORY
    -------------------------------------------------------- */

    if (fixedCategory) {
      list = list.filter(
        (p) =>
          String(
            p.category || ""
          ).toLowerCase() ===
          String(
            fixedCategory
          ).toLowerCase()
      );
    }

    /* --------------------------------------------------------
       CATEGORY URL FILTER
    -------------------------------------------------------- */

    else if (
      filterCategory !== "all"
    ) {
      list = list.filter(
        (p) =>
          String(
            p.category || ""
          ).toLowerCase() ===
          String(
            filterCategory
          ).toLowerCase()
      );
    }

    return list;
  }, [
    products,
    mode,
    fixedCategory,
    filterCategory,
  ]);

  /* ==========================================================
     APPLY SEARCH + FILTERS
  ========================================================== */

  const filtered = useMemo(() => {
    let list = base;

    /* --------------------------------------------------------
       SEARCH
    -------------------------------------------------------- */

    if (debounced.trim()) {
      const q =
        debounced
          .toLowerCase()
          .trim();

      list = list.filter(
        (p) => {
          const name =
            String(
              p.name || ""
            ).toLowerCase();

          const category =
            String(
              p.category || ""
            ).toLowerCase();

          const productCode =
            String(
              p.product_code || ""
            ).toLowerCase();

          return (
            name.includes(q) ||
            category.includes(q) ||
            productCode.includes(q)
          );
        }
      );
    }

    /* --------------------------------------------------------
       PRICE
    -------------------------------------------------------- */

    if (
      priceBand !== null &&
      PRICE_BANDS[priceBand]
    ) {
      list = list.filter(
        PRICE_BANDS[priceBand]
          .test
      );
    }

    /* --------------------------------------------------------
       NORMAL SIZE FILTER
       
       Only for:
       Shirts
       Tees
       Pants
       
       Combo uses separate filters below.
    -------------------------------------------------------- */

    if (
      size &&
      filterCategory !==
        "combo"
    ) {
      list = list.filter(
        (p) =>
          Array.isArray(
            p.sizes
          )
            ? p.sizes.includes(
                size
              )
            : false
      );
    }

    /* --------------------------------------------------------
       COMBO SHIRT SIZE
       
       Optional.
       
       If selected:
       product must contain
       selected shirt size.
    -------------------------------------------------------- */

    if (
      filterCategory ===
        "combo" &&
      comboShirtSize
    ) {
      list = list.filter(
        (p) =>
          Array.isArray(
            p.sizes
          )
            ? p.sizes.includes(
                comboShirtSize
              )
            : false
      );
    }

    /* --------------------------------------------------------
       COMBO PANT SIZE
       
       Optional.
       
       If selected:
       product must contain
       selected pant size.
    -------------------------------------------------------- */

    if (
      filterCategory ===
        "combo" &&
      comboPantSize
    ) {
      list = list.filter(
        (p) =>
          Array.isArray(
            p.sizes
          )
            ? p.sizes.includes(
                comboPantSize
              )
            : false
      );
    }

    /* --------------------------------------------------------
       NEW
    -------------------------------------------------------- */

    if (extra.new) {
      list = list.filter(
        (p) =>
          p.is_new_arrival
      );
    }

    /* --------------------------------------------------------
       OFFER
    -------------------------------------------------------- */

    if (extra.offer) {
      list = list.filter(
        (p) =>
          p.is_offer
      );
    }

    /* --------------------------------------------------------
       FEATURED
    -------------------------------------------------------- */

    if (extra.featured) {
      list = list.filter(
        (p) =>
          p.is_featured
      );
    }

    return list;
  }, [
    base,
    debounced,
    priceBand,
    size,
    comboShirtSize,
    comboPantSize,
    filterCategory,
    extra,
  ]);

  /* ==========================================================
     ACTIVE FILTER COUNT
  ========================================================== */

  const activeFilterCount =
    (priceBand !== null &&
    PRICE_BANDS[priceBand]
      ? 1
      : 0) +
    (filterCategory ===
      "combo" &&
    comboShirtSize
      ? 1
      : 0) +
    (filterCategory ===
      "combo" &&
    comboPantSize
      ? 1
      : 0) +
    (filterCategory !==
      "combo" &&
    size
      ? 1
      : 0) +
    Object.values(extra).filter(
      Boolean
    ).length +
    (!fixedCategory &&
    filterCategory !== "all"
      ? 1
      : 0);

  /* ==========================================================
     SELECT CATEGORY
  ========================================================== */

  const selectCategory = (
    nextCategory
  ) => {
    const categoryValue =
      normalizeCategory(
        nextCategory
      );

    setParams((current) => {
      const next =
        new URLSearchParams(
          current
        );

      if (
        categoryValue === "all"
      ) {
        next.delete(
          "category"
        );
      } else {
        next.set(
          "category",
          categoryValue
        );
      }

      /*
       * Clear all size filters
       * when category changes.
       */

      next.delete("size");
      next.delete(
        "shirtSize"
      );
      next.delete(
        "pantSize"
      );

      return next;
    });
  };

  /* ==========================================================
     SELECT PRICE
  ========================================================== */

  const selectPrice = (
    index
  ) => {
    updateParams({
      price:
        priceBand === index
          ? null
          : index,
    });
  };

  /* ==========================================================
     SELECT NORMAL SIZE
  ========================================================== */

  const selectSize = (
    nextSize
  ) => {
    updateParams({
      size:
        size === nextSize
          ? null
          : nextSize,
    });
  };

  /* ==========================================================
     SELECT COMBO SHIRT SIZE
     
     Optional.
     
     User can choose:
     Shirt only
     OR
     Shirt + Pant
  ========================================================== */

  const selectComboShirtSize = (
    nextSize
  ) => {
    updateParams({
      shirtSize:
        comboShirtSize ===
        nextSize
          ? null
          : nextSize,
    });
  };

  /* ==========================================================
     SELECT COMBO PANT SIZE
     
     Optional.
     
     User can choose:
     Pant only
     OR
     Shirt + Pant
  ========================================================== */

  const selectComboPantSize = (
    nextSize
  ) => {
    updateParams({
      pantSize:
        comboPantSize ===
        nextSize
          ? null
          : nextSize,
    });
  };

  /* ==========================================================
     TOGGLE TAG
  ========================================================== */

  const toggleTag = (
    key
  ) => {
    const paramKey =
      `tag${key[0].toUpperCase()}${key.slice(
        1
      )}`;

    updateParams({
      [paramKey]: extra[key]
        ? null
        : 1,
    });
  };

  /* ==========================================================
     CLEAR ALL FILTERS
  ========================================================== */

  const clearFilters = () => {
    setQuery("");
    setParams({});
  };

  /* ==========================================================
     CATEGORY VISIBILITY
  ========================================================== */

  const showCategory = [
    "all",
    "new",
    "offers",
  ].includes(mode);

  /* ==========================================================
     VISIBLE TAGS
  ========================================================== */

  const visibleTags =
    TAGS.filter(
      ([key]) => {
        if (
          mode === "new" &&
          key === "new"
        ) {
          return false;
        }

        if (
          mode === "offers" &&
          key === "offer"
        ) {
          return false;
        }

        if (
          mode === "featured" &&
          key === "featured"
        ) {
          return false;
        }

        return true;
      }
    );

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-32 sm:px-8">

      {/* ======================================================
          SEO
      ======================================================= */}

      <Seo
        title={
          seoRoute?.title ||
          title
        }
        description={
          seoRoute?.description ||
          `Explore ${
            title ||
            "Retro Clothing"
          } products.`
        }
        path={
          seoRoute?.path ||
          routePathFor(
            mode,
            category
          )
        }
        jsonLd={breadcrumbJsonLd(
          seoRoute?.breadcrumbs ||
            []
        )}
      />

      {/* ======================================================
          HEADING
      ======================================================= */}

      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        as="h1"
      />

      {/* ======================================================
          CATEGORY PILLS
          
          Combo is included.
      ======================================================= */}

      {showCategory && (
        <div className="mb-7 flex gap-2 overflow-x-auto pb-1 no-scrollbar">

          {[
            {
              slug: "all",
              label: "All",
            },

            ...COLLECTION_CATEGORIES,
          ].map(
            (item) => (
              <button
                key={
                  item.slug
                }
                type="button"
                onClick={() =>
                  selectCategory(
                    item.slug
                  )
                }
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors ${
                  filterCategory ===
                  item.slug
                    ? "border-bone bg-bone text-ink"
                    : "border-line-strong text-bone hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}

      {/* ======================================================
          SEARCH + FILTER
      ======================================================= */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-xs">

          <Search
            size={15}
            strokeWidth={1.75}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist"
          />

          <input
            value={query}
            onChange={(e) => {
              const value =
                e.target.value;

              setQuery(value);

              updateParams({
                q:
                  value ||
                  null,
              });
            }}
            placeholder="Search this collection…"
            className="glass h-11 w-full rounded-full pl-10 pr-4 text-sm text-bone placeholder:text-mist focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">

          <p className="text-xs text-mist">
            {filtered.length}{" "}
            products
          </p>

          <FilterButton
            onClick={() =>
              setFiltersOpen(
                true
              )
            }
            active={
              activeFilterCount >
              0
            }
          />

          {activeFilterCount >
            0 && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="text-xs uppercase tracking-widest text-mist underline underline-offset-4 transition-colors hover:text-bone"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ======================================================
          PRODUCTS
      ======================================================= */}

      {filtered.length ===
      0 ? (
        <EmptyState
          actionLabel="Clear Filters"
          onAction={
            clearFilters
          }
          message="Try changing your search or filters."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

          {filtered.map(
            (p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
              />
            )
          )}
        </div>
      )}

      {/* ======================================================
          FILTER DRAWER
      ======================================================= */}

      <FilterDrawer
        open={filtersOpen}
        onClose={() =>
          setFiltersOpen(false)
        }
        mode={mode}
        showCategory={
          showCategory
        }
        category={
          filterCategory
        }
        onCategoryChange={
          selectCategory
        }
        priceBand={
          priceBand
        }
        onPriceChange={
          selectPrice
        }
        size={size}
        availableSizes={
          availableSizes
        }
        onSizeChange={
          selectSize
        }
        comboShirtSize={
          comboShirtSize
        }
        comboPantSize={
          comboPantSize
        }
        onComboShirtSizeChange={
          selectComboShirtSize
        }
        onComboPantSizeChange={
          selectComboPantSize
        }
        extra={extra}
        visibleTags={
          visibleTags
        }
        onTagToggle={
          toggleTag
        }
        onClear={
          clearFilters
        }
      />
    </div>
  );
}

/* ============================================================
   FILTER DRAWER
============================================================ */

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
  comboShirtSize,
  comboPantSize,
  onComboShirtSizeChange,
  onComboPantSizeChange,
  extra,
  visibleTags,
  onTagToggle,
  onClear,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ==================================================
              OVERLAY
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70"
          />

          {/* ==================================================
              DRAWER
          ================================================== */}

          <motion.div
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
            transition={{
              duration: 0.35,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="glass-strong fixed inset-x-0 bottom-0 z-[80] max-h-[80vh] overflow-y-auto rounded-t-[26px] p-6 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-sm sm:rounded-t-none"
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex items-center justify-between">

              <h3 className="font-display text-2xl text-bone">
                Filters
              </h3>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5"
                aria-label="Close filters"
              >
                <X
                  size={18}
                  strokeWidth={1.75}
                  className="text-bone"
                />
              </button>

            </div>

            <div className="space-y-8">

              {/* =================================================
                  CATEGORY
              ================================================= */}

              {showCategory && (
                <div>

                  <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">
                    Category
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {[
                      {
                        slug: "all",
                        label: "All",
                      },

                      ...COLLECTION_CATEGORIES,
                    ].map(
                      (item) => (
                        <button
                          key={
                            item.slug
                          }
                          type="button"
                          onClick={() =>
                            onCategoryChange(
                              item.slug
                            )
                          }
                          className={`rounded-full border px-3.5 py-2 text-xs transition-colors ${
                            category ===
                            item.slug
                              ? "border-bone bg-bone text-ink"
                              : "border-line-strong text-bone hover:bg-white/5"
                          }`}
                        >
                          {
                            item.label
                          }
                        </button>
                      )
                    )}

                  </div>
                </div>
              )}

              {/* =================================================
                  SIZE
              ================================================= */}

              <div>

                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">
                  Size
                </p>

                {/* =================================================
                    COMBO SIZE FILTER
                   
                    Combo supports independent
                    Shirt + Pant selection.
                   
                    Both are OPTIONAL.
                ================================================= */}

                {category ===
                "combo" ? (
                  <div className="space-y-5">

                    {/* -------------------------------------------
                        SHIRT SIZE
                    -------------------------------------------- */}

                    <div>

                      <p className="mb-2 text-[10px] uppercase tracking-widest text-mist/80">
                        Shirt Size
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {COMBO_SHIRT_SIZES.map(
                          (s) => (
                            <SizeButton
                              key={s}
                              value={s}
                              selected={
                                comboShirtSize ===
                                s
                              }
                              onClick={() =>
                                onComboShirtSizeChange(
                                  s
                                )
                              }
                            />
                          )
                        )}

                      </div>
                    </div>

                    {/* -------------------------------------------
                        PANT SIZE
                    -------------------------------------------- */}

                    <div>

                      <p className="mb-2 text-[10px] uppercase tracking-widest text-mist/80">
                        Pant Size
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {COMBO_PANT_SIZES.map(
                          (s) => (
                            <SizeButton
                              key={s}
                              value={s}
                              selected={
                                comboPantSize ===
                                s
                              }
                              onClick={() =>
                                onComboPantSizeChange(
                                  s
                                )
                              }
                            />
                          )
                        )}

                      </div>
                    </div>

                    {/* -------------------------------------------
                        HELPER TEXT
                    -------------------------------------------- */}

                    <p className="text-[11px] leading-5 text-mist">
                      You can choose a shirt
                      size, pant size, or both.
                    </p>

                  </div>
                ) : (
                  /* =================================================
                     NORMAL SIZE FILTER
                  ================================================= */

                  <div className="flex flex-wrap gap-2">

                    {/* -------------------------------------------
                        ALL CATEGORY
                    -------------------------------------------- */}

                    {category ===
                    "all" ? (
                      <>
                        {/* Clothing Sizes */}

                        <div className="w-full">

                          <p className="mb-2 text-[10px] uppercase tracking-widest text-mist/80">
                            Clothing Sizes
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {availableSizes
                              .filter(
                                (s) =>
                                  [
                                    "M",
                                    "L",
                                    "XL",
                                  ].includes(
                                    s
                                  )
                              )
                              .map(
                                (s) => (
                                  <SizeButton
                                    key={
                                      s
                                    }
                                    value={
                                      s
                                    }
                                    selected={
                                      size ===
                                      s
                                    }
                                    onClick={() =>
                                      onSizeChange(
                                        s
                                      )
                                    }
                                  />
                                )
                              )}

                          </div>
                        </div>

                        {/* Pant Sizes */}

                        <div className="w-full pt-2">

                          <p className="mb-2 text-[10px] uppercase tracking-widest text-mist/80">
                            Pant Sizes
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {availableSizes
                              .filter(
                                (s) =>
                                  [
                                    "28",
                                    "30",
                                    "32",
                                    "34",
                                    "36",
                                  ].includes(
                                    s
                                  )
                              )
                              .map(
                                (s) => (
                                  <SizeButton
                                    key={
                                      s
                                    }
                                    value={
                                      s
                                    }
                                    selected={
                                      size ===
                                      s
                                    }
                                    onClick={() =>
                                      onSizeChange(
                                        s
                                      )
                                    }
                                  />
                                )
                              )}

                          </div>
                        </div>
                      </>
                    ) : (
                      /* -------------------------------------------
                         SHIRTS / TEES / PANTS
                      -------------------------------------------- */

                      availableSizes.map(
                        (s) => (
                          <SizeButton
                            key={s}
                            value={s}
                            selected={
                              size ===
                              s
                            }
                            onClick={() =>
                              onSizeChange(
                                s
                              )
                            }
                          />
                        )
                      )
                    )}

                  </div>
                )}

              </div>

              {/* =================================================
                  PRICE
              ================================================= */}

              <div>

                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">
                  Price
                </p>

                <div className="flex flex-wrap gap-2">

                  {PRICE_BANDS.map(
                    (
                      band,
                      index
                    ) => (
                      <button
                        key={
                          band.label
                        }
                        type="button"
                        onClick={() =>
                          onPriceChange(
                            index
                          )
                        }
                        className={`rounded-full border px-3.5 py-2 text-xs transition-colors ${
                          priceBand ===
                          index
                            ? "border-bone bg-bone text-ink"
                            : "border-line-strong text-bone hover:bg-white/5"
                        }`}
                      >
                        {
                          band.label
                        }
                      </button>
                    )
                  )}

                </div>
              </div>

              {/* =================================================
                  TAGS
              ================================================= */}

              <div>

                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">
                  Tag
                </p>

                <div className="flex flex-wrap gap-2">

                  {visibleTags.map(
                    ([
                      key,
                      label,
                    ]) => (
                      <button
                        key={
                          key
                        }
                        type="button"
                        onClick={() =>
                          onTagToggle(
                            key
                          )
                        }
                        className={`rounded-full border px-3.5 py-2 text-xs transition-colors ${
                          extra[key]
                            ? "border-bone bg-bone text-ink"
                            : "border-line-strong text-bone hover:bg-white/5"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}

                </div>
              </div>

            </div>

            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <div className="mt-10 flex gap-3">

              <button
                type="button"
                onClick={onClear}
                className="flex-1 rounded-full border border-line-strong py-3 text-xs font-medium uppercase tracking-widest text-bone transition-colors hover:bg-white/5"
              >
                Clear All
              </button>

              <button
                type="button"
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

/* ============================================================
   SIZE BUTTON
============================================================ */

function SizeButton({
  value,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 min-w-10 rounded-full border px-3 text-xs transition-colors ${
        selected
          ? "border-bone bg-bone text-ink"
          : "border-line-strong text-bone hover:bg-white/5"
      }`}
    >
      {value}
    </button>
  );
}