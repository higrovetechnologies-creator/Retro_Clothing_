import { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";
import {
  AnnouncementSection,
  ReviewCard,
  StoryTeaser,
} from "../components/home/Sections";
import ProductCard from "../components/common/ProductCard";
import CategoryCard from "../components/common/CategoryCard";
import {
  SectionHeading,
  HorizontalScroller,
} from "../components/common/Misc";
import {
  useAnnouncements,
  useProducts,
  useSettings,
  useReviews,
} from "../hooks/useStore";
import { CATEGORIES } from "../lib/data";
import { ArrowRight } from "lucide-react";
import Seo from "../components/common/Seo";
import { STATIC_ROUTES } from "../lib/seoRoutes";
import { breadcrumbJsonLd } from "../lib/seoConfig";

const HOME_ROUTE = STATIC_ROUTES.find(
  (r) => r.path === "/"
);

export default function Home() {
  const [
    reviewsPaused,
    setReviewsPaused,
  ] = useState(false);

  const products = useProducts();

  const announcements =
    useAnnouncements();

  const settings = useSettings();

  const reviews = useReviews().filter(
    (r) => r?.is_featured
  );

  /* ============================================================
     SORT HELPER

     NEWEST FIRST

     Priority:
     1. created_at
     2. createdAt
     3. updated_at
     4. updatedAt
  ============================================================ */

  const getTimestamp = (item) => {
    const value =
      item?.created_at ||
      item?.createdAt ||
      item?.updated_at ||
      item?.updatedAt;

    if (!value) return 0;

    const timestamp =
      new Date(value).getTime();

    return Number.isNaN(timestamp)
      ? 0
      : timestamp;
  };

  const newestFirst = (items) => {
    return [...items].sort(
      (a, b) =>
        getTimestamp(b) -
        getTimestamp(a)
    );
  };

  /* ============================================================
     ANNOUNCEMENTS

     Latest added announcement
     will ALWAYS come first.
  ============================================================ */

  const sortedAnnouncements =
    newestFirst(
      announcements
    );

  /* ============================================================
     PRODUCTS
  ============================================================ */

  const offers =
    newestFirst(
      products.filter(
        (p) => p.is_offer
      )
    );

  const newArrivals =
    newestFirst(
      products.filter(
        (p) =>
          p.is_new_arrival
      )
    );

  const featured =
    newestFirst(
      products.filter(
        (p) => p.is_featured
      )
    );

  return (
    <div>
      <Seo
        title={HOME_ROUTE.title}
        description={HOME_ROUTE.description}
        path={HOME_ROUTE.path}
        jsonLd={breadcrumbJsonLd(
          HOME_ROUTE.breadcrumbs
        )}
      />

      {/* ======================================================
          HERO
          UNCHANGED
      ======================================================= */}

      <Hero />

      {/* ======================================================
          ANNOUNCEMENTS
      ======================================================= */}

      <AnnouncementSection
        announcements={
          sortedAnnouncements
        }
      />

      {/* ======================================================
          OFFER PRODUCTS
      ======================================================= */}

      {offers.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
          <SectionHeading
            eyebrow="Limited Time"
            title="Offer Products"
            action={
              <Link
                to="/offers"
                className="hidden items-center gap-1.5 text-xs uppercase tracking-widest text-mist transition-colors hover:text-bone sm:flex"
              >
                View all
                <ArrowRight size={13} />
              </Link>
            }
          />

          <HorizontalScroller>
            {offers.map(
              (p, i) => (
                <div
                  key={p.id}
                  className="w-[62%] shrink-0 snap-start sm:w-[28%] lg:w-[22%]"
                >
                  <ProductCard
                    product={p}
                    index={i}
                  />
                </div>
              )
            )}
          </HorizontalScroller>
        </section>
      )}

      {/* ======================================================
          NEW ARRIVALS
      ======================================================= */}

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
          <SectionHeading
            eyebrow="Just Dropped"
            title="New Arrivals"
            action={
              <Link
                to="/new-arrivals"
                className="hidden items-center gap-1.5 text-xs uppercase tracking-widest text-mist transition-colors hover:text-bone sm:flex"
              >
                View all
                <ArrowRight size={13} />
              </Link>
            }
          />

          <HorizontalScroller>
            {newArrivals.map(
              (p, i) => (
                <div
                  key={p.id}
                  className="w-[62%] shrink-0 snap-start sm:w-[28%] lg:w-[22%]"
                >
                  <ProductCard
                    product={p}
                    index={i}
                  />
                </div>
              )
            )}
          </HorizontalScroller>
        </section>
      )}

      {/* ======================================================
          SHOP BY CATEGORY
      ======================================================= */}

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="Shop by Category"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {CATEGORIES.map(
            (category) => (
              <CategoryCard
                key={
                  category.slug
                }
                category={
                  category
                }
              />
            )
          )}
        </div>
      </section>

      {/* ======================================================
          FEATURED PRODUCTS
      ======================================================= */}

      {featured.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
          <SectionHeading
            eyebrow="The Edit"
            title="Featured Products"
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map(
              (p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                />
              )
            )}
          </div>
        </section>
      )}

      {/* ======================================================
          REVIEWS
      ======================================================= */}

      {reviews.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
          <SectionHeading
            eyebrow="Word on the Street"
            title="Reviews"
          />

          <div
            className={`reviews-auto-scroll no-scrollbar overflow-hidden pb-2 ${
              reviewsPaused
                ? "is-paused"
                : ""
            }`}
            aria-label="Customer reviews"
            onPointerDown={() =>
              setReviewsPaused(
                true
              )
            }
            onPointerUp={() =>
              setReviewsPaused(
                false
              )
            }
            onPointerCancel={() =>
              setReviewsPaused(
                false
              )
            }
            onPointerLeave={() =>
              setReviewsPaused(
                false
              )
            }
            onTouchStart={() =>
              setReviewsPaused(
                true
              )
            }
            onTouchEnd={() =>
              setReviewsPaused(
                false
              )
            }
          >
            <div className="reviews-marquee flex w-max gap-4">
              <div className="reviews-set flex shrink-0 gap-4">
                {reviews.map(
                  (review) => (
                    <ReviewCard
                      key={`review-a-${review.id}`}
                      review={
                        review
                      }
                    />
                  )
                )}
              </div>

              <div
                className="reviews-set flex shrink-0 gap-4"
                aria-hidden="true"
              >
                {reviews.map(
                  (review) => (
                    <ReviewCard
                      key={`review-b-${review.id}`}
                      review={
                        review
                      }
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          STORY
      ======================================================= */}

      <StoryTeaser
        settings={settings}
      />
    </div>
  );
}
