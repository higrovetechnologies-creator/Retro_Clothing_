import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  MessageCircle,
  Truck,
  ShieldCheck,
  ChevronRight,
  X,
} from "lucide-react";

import {
  useProducts,
  useSettings,
} from "../hooks/useStore";

import {
  whatsappOrderUrl,
} from "../lib/whatsapp";

import {
  EmptyState,
  Reveal,
} from "../components/common/Misc";

import ProductCard from "../components/common/ProductCard";
import Seo from "../components/common/Seo";
import { productRoute } from "../lib/seoRoutes";
import {
  breadcrumbJsonLd,
  productJsonLd,
} from "../lib/seoConfig";

export default function ProductDetail() {
  const { slug } = useParams();

  const products = useProducts();
  const settings = useSettings();

  const product = products.find(
    (p) => p.slug === slug
  );

  const [activeImage, setActiveImage] =
    useState(0);

  const [size, setSize] =
    useState(null);

  const [showSizePopup, setShowSizePopup] =
    useState(false);

  /* ============================================================
     RESET WHEN PRODUCT CHANGES
  ============================================================ */

  useEffect(() => {
    window.scrollTo(0, 0);

    setActiveImage(0);
    setSize(null);
    setShowSizePopup(false);
  }, [slug]);

  /* ============================================================
     PRODUCT NOT FOUND
  ============================================================ */

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-40 sm:px-8">

        <EmptyState
          title="Product not found"
          message="This product may have been removed or the link is incorrect."
          actionLabel="Back to Collection"
          onAction={() =>
            (window.location.href =
              "/collection")
          }
        />

      </div>
    );
  }

  /* ============================================================
     STOCK
  ============================================================ */

  const isInStock =
    product.stock_status !==
    "out_of_stock";

  /* ============================================================
     RELATED
  ============================================================ */

  const related = products
    .filter(
      (p) =>
        p.category ===
          product.category &&
        p.id !== product.id
    )
    .slice(0, 4);

  /* ============================================================
     FABRIC
  ============================================================ */

  const hasFabricInfo =
    product.fabric ||
    product.colour ||
    product.occasion;

  /* ============================================================
     ORDER
  ============================================================ */

  const onOrder = (e) => {
    if (!isInStock) {
      e.preventDefault();
      return;
    }

    if (!size) {
      e.preventDefault();
      setShowSizePopup(true);
      return;
    }
  };

  /* ============================================================
     CHOOSE SIZE
  ============================================================ */

  const chooseSize = () => {
    setShowSizePopup(false);

    setTimeout(() => {
      const sizeSection =
        document.getElementById(
          "product-size-selector"
        );

      if (sizeSection) {
        sizeSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const seoRoute = productRoute(product);

  return (
    <>
      <Seo
        title={seoRoute.title}
        description={seoRoute.description}
        path={seoRoute.path}
        image={seoRoute.image}
        type="product"
        jsonLd={[
          breadcrumbJsonLd(
            seoRoute.breadcrumbs
          ),
          productJsonLd(product),
        ]}
      />

      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-28 sm:px-8">

        {/* ======================================================
            BREADCRUMB
        ====================================================== */}

        <div className="mb-6 flex items-center gap-1.5 text-xs text-mist">

          <Link
            to="/collection"
            className="hover:text-bone"
          >
            All Collection
          </Link>

          <ChevronRight size={12} />

          <Link
            to={`/${product.category}`}
            className="capitalize hover:text-bone"
          >
            {product.category}
          </Link>

          <ChevronRight size={12} />

          <span className="text-bone/80">
            {product.name}
          </span>

        </div>

        {/* ======================================================
            PRODUCT
        ====================================================== */}

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* ====================================================
              IMAGES
          ==================================================== */}

          <div>

            <div className="aspect-[4/5] overflow-hidden rounded-[22px] border border-line">

              <motion.img
                key={activeImage}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.35,
                }}
                src={
                  product.images?.[
                    activeImage
                  ]
                }
                alt={`${product.name} – ${product.colour || ""} ${product.category}`.trim()}
                className={`
                  h-full
                  w-full
                  object-cover
                  ${
                    !isInStock
                      ? "opacity-70"
                      : ""
                  }
                `}
              />

            </div>

            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">

              {product.images?.map(
                (image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setActiveImage(
                        index
                      )
                    }
                    className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition-colors ${
                      activeImage === index
                        ? "border-bone"
                        : "border-line"
                    }`}
                  >

                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                  </button>
                )
              )}

            </div>

          </div>

          {/* ====================================================
              DETAILS
          ==================================================== */}

          <div>

            {/* OCCASION */}

            {product.occasion && (
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-mist">
                {product.occasion}
              </p>
            )}

            {/* NAME */}

            <h1 className="mt-2 font-display text-[34px] leading-tight text-bone sm:text-[40px]">
              {product.name}
            </h1>

            {/* PRICE */}

            <div className="mt-3 flex flex-wrap items-center gap-3">

              <span className="font-display text-2xl text-bone">
                ₹{product.now_price}
              </span>

              {product.was_price && (
                <>
                  <span className="text-base text-mist line-through">
                    ₹{product.was_price}
                  </span>

                  <span className="rounded-full bg-bone px-2.5 py-1 text-[11px] font-medium text-ink">
                    −
                    {Math.round(
                      ((product.was_price -
                        product.now_price) /
                        product.was_price) *
                        100
                    )}
                    %
                  </span>
                </>
              )}

            </div>

            {/* ==================================================
                STOCK STATUS
            ================================================== */}

            <div className="mt-4">

              {isInStock ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-[11px] font-medium uppercase tracking-widest text-bone">
                    In Stock
                  </span>

                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5">

                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  <span className="text-[11px] font-medium uppercase tracking-widest text-mist">
                    Out of Stock
                  </span>

                </div>
              )}

            </div>

            {/* DESCRIPTION */}

            {product.description && (
              <p className="mt-5 max-w-md text-[14px] leading-relaxed text-mist">
                {product.description}
              </p>
            )}

            {/* PRODUCT CODE */}

            {product.product_code && (
              <p className="mt-3 text-xs text-mist">
                Product Code:{" "}
                <span className="text-bone/80">
                  {product.product_code}
                </span>
              </p>
            )}

            {/* ==================================================
                SIZE
            ================================================== */}

            <div
              id="product-size-selector"
              className="mt-7 scroll-mt-24"
            >

              <div className="mb-3 flex items-center justify-between">

                <p className="text-[11px] font-medium uppercase tracking-widest text-mist">
                  Select Size
                </p>

                {size && (
                  <p className="text-[11px] text-bone/80">
                    Selected: {size}
                  </p>
                )}

              </div>

              <div className="flex flex-wrap gap-2.5">

                {product.sizes?.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      disabled={!isInStock}
                      onClick={() => {
                        if (!isInStock)
                          return;

                        setSize(item);
                        setShowSizePopup(
                          false
                        );
                      }}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm transition-all ${
                        !isInStock
                          ? "cursor-not-allowed border-line text-mist/30"
                          : size === item
                          ? "border-bone bg-bone text-ink"
                          : "border-line-strong text-bone hover:bg-white/5"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              </div>

              {!isInStock && (
                <p className="mt-3 text-[12px] text-mist">
                  This product is currently unavailable.
                </p>
              )}

            </div>

            {/* ==================================================
                ORDER BUTTON
            ================================================== */}

            {isInStock ? (
              <a
                href={whatsappOrderUrl(
                  product,
                  size,
                  settings.whatsapp
                )}
                onClick={onOrder}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-full bg-bone py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-transform active:scale-[0.98] sm:w-auto sm:px-10"
              >

                <MessageCircle
                  size={16}
                  strokeWidth={2}
                />

                Order on WhatsApp

              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-full border border-line bg-charcoal/40 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-mist sm:w-auto sm:px-10"
              >
                Out of Stock
              </button>
            )}

            {/* ==================================================
                DELIVERY
            ================================================== */}

            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-charcoal/40 p-4 text-[13px] text-mist">

              <span className="flex items-center gap-2.5">

                <Truck
                  size={15}
                  strokeWidth={1.75}
                  className="shrink-0 text-bone"
                />

                {settings.deliveryInfo}

              </span>

              <span className="flex items-center gap-2.5">

                <ShieldCheck
                  size={15}
                  strokeWidth={1.75}
                  className="shrink-0 text-bone"
                />

                Cash on Delivery available only in Tirunelveli

              </span>

            </div>

            {/* ==================================================
                FABRIC
            ================================================== */}

            {hasFabricInfo && (
              <div className="mt-8 border-t border-line pt-6">

                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">
                  Fabric &amp; Details
                </p>

                <dl className="grid grid-cols-2 gap-y-2 text-[13px]">

                  {product.fabric && (
                    <>
                      <dt className="text-mist">
                        Fabric
                      </dt>

                      <dd className="text-bone/90">
                        {product.fabric}
                      </dd>
                    </>
                  )}

                  {product.colour && (
                    <>
                      <dt className="text-mist">
                        Colour
                      </dt>

                      <dd className="text-bone/90">
                        {product.colour}
                      </dd>
                    </>
                  )}

                  {product.occasion && (
                    <>
                      <dt className="text-mist">
                        Occasion
                      </dt>

                      <dd className="text-bone/90">
                        {product.occasion}
                      </dd>
                    </>
                  )}

                </dl>

              </div>
            )}

            {/* ==================================================
                CARE
            ================================================== */}

            {product.care_instruction && (
              <div className="mt-6 border-t border-line pt-6">

                <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-mist">
                  Care Instructions
                </p>

                <p className="text-[13px] leading-relaxed text-mist">
                  {product.care_instruction}
                </p>

              </div>
            )}

          </div>

        </div>

        {/* ======================================================
            RELATED
        ====================================================== */}

        {related.length > 0 && (
          <Reveal className="mt-20">

            <p className="mb-6 font-display text-2xl text-bone">
              You may also like
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

              {related.map(
                (item, index) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    index={index}
                  />
                )
              )}

            </div>

          </Reveal>
        )}

      </div>

      {/* ========================================================
          SIZE POPUP
      ======================================================== */}

      <AnimatePresence>

        {showSizePopup && (
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
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
            onClick={() =>
              setShowSizePopup(false)
            }
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              transition={{
                duration: 0.25,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="relative w-full max-w-[390px] rounded-[24px] border border-white/10 bg-[#17171a] p-6 text-center shadow-2xl sm:p-7"
            >

              <button
                type="button"
                onClick={() =>
                  setShowSizePopup(false)
                }
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-mist transition-colors hover:bg-white/10 hover:text-bone"
              >
                <X size={17} />
              </button>

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <span className="text-xl">
                  👕
                </span>
              </div>

              <h3 className="mt-5 font-display text-2xl text-bone">
                Select Your Size
              </h3>

              <p className="mx-auto mt-2 max-w-[290px] text-[13px] leading-relaxed text-mist">
                Please select your size before placing the order.
              </p>

              <button
                type="button"
                onClick={chooseSize}
                className="mt-6 w-full rounded-full bg-bone px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-transform active:scale-[0.98]"
              >
                Choose Size
              </button>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}
