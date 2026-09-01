import { Link } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";
import { Reveal } from "../common/Misc";

/* =========================================================
   ANNOUNCEMENT SECTION
   ========================================================= */

export function AnnouncementSection({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return null;
  }

  const hasMultipleAnnouncements = announcements.length > 1;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
      <div
        className={`
          no-scrollbar
          ${
            hasMultipleAnnouncements
              ? "flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-3"
              : "flex w-full"
          }
        `}
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: hasMultipleAnnouncements
            ? "pan-x pan-y"
            : "pan-y",
        }}
      >
        {announcements.map((a) => (
          <Reveal
            key={a.id}
            className={`
              shrink-0
              ${
                hasMultipleAnnouncements
                  ? "w-[88%] snap-start sm:w-[70%] lg:w-[calc(50%-10px)]"
                  : "w-full"
              }
            `}
          >
            <div className="overflow-hidden rounded-[24px] border border-line bg-charcoal/30">
              {/* =================================================
                  ANNOUNCEMENT POSTER
                  ================================================= */}

              <div
                className="
                  relative
                  flex
                  w-full
                  items-center
                  justify-center
                  bg-black/10
                "
              >
                <img
                  src={a.image}
                  alt={a.title || "Announcement"}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  className="
                    block
                    h-auto
                    w-full
                    max-h-[720px]
                    object-contain
                    object-center
                    select-none
                    transition-transform
                    duration-700
                    ease-out
                    hover:scale-[1.015]
                  "
                />
              </div>

              {/* =================================================
                  ANNOUNCEMENT DETAILS
                  ================================================= */}

              {(a.title || a.timing || a.location) && (
                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    border-t
                    border-line
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-8
                    sm:py-6
                  "
                >
                  {/* Title */}

                  {a.title && (
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-mist">
                        Announcement
                      </p>

                      <h3 className="mt-1 font-display text-2xl text-bone">
                        {a.title}
                      </h3>
                    </div>
                  )}

                  {/* Timing / Location */}

                  {(a.timing || a.location) && (
                    <div className="flex flex-col gap-1.5 text-sm text-mist sm:items-end">
                      {a.timing && (
                        <span className="flex items-center gap-2">
                          <Clock
                            size={14}
                            strokeWidth={1.75}
                            className="shrink-0"
                          />

                          <span>{a.timing}</span>
                        </span>
                      )}

                      {a.location && (
                        <span className="flex items-center gap-2">
                          <MapPin
                            size={14}
                            strokeWidth={1.75}
                            className="shrink-0"
                          />

                          <span>{a.location}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   REVIEW CARD
   ========================================================= */

export function ReviewCard({ review }) {
  return (
    <div className="glass w-[280px] shrink-0 snap-start rounded-[20px] p-6 sm:w-[320px]">
      {/* Rating */}

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            strokeWidth={1}
            className={
              i < review.rating
                ? "fill-bone text-bone"
                : "text-line-strong"
            }
          />
        ))}
      </div>

      {/* Review Text */}

      <p className="mt-4 text-[14px] leading-relaxed text-bone/90">
        “{review.review_text}”
      </p>

      {/* Customer */}

      <div className="mt-5 flex items-center gap-3">
        {review.image_url && (
          <img
            src={review.image_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-9 w-9 rounded-full object-cover"
          />
        )}

        <span className="text-[13px] font-medium text-mist">
          {review.customer_name}
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   STORY TEASER
   ========================================================= */

export function StoryTeaser({ settings }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8">
      <Reveal
        className="
          grid
          items-center
          gap-10
          rounded-[28px]
          border
          border-line
          bg-charcoal/40
          p-6
          sm:p-10
          lg:grid-cols-2
          lg:gap-16
        "
      >
        {/* =====================================================
            STORY CONTENT
            ===================================================== */}

        <div className="order-2 lg:order-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-mist">
            Our Story
          </p>

          <h2 className="mt-3 font-display text-[34px] leading-[1.05] text-bone sm:text-[42px]">
            From a folding table on Mela Mount Road
          </h2>

          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-mist">
            {settings.storyShort}
          </p>

          <Link
            to="/our-story"
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-line-strong
              px-5
              py-3
              text-xs
              font-medium
              uppercase
              tracking-widest
              text-bone
              transition-colors
              hover:bg-bone
              hover:text-ink
            "
          >
            Read Our Story
          </Link>
        </div>

        {/* =====================================================
            STORY IMAGE
            ===================================================== */}

        <div
          className="
            order-1
            aspect-[4/3]
            overflow-hidden
            rounded-[20px]
            border
            border-line
            bg-black
            lg:order-2
          "
        >
          <img
            src="/images/retro-story.jpeg"
            alt="Retro Clothing showroom in Tirunelveli"
            width="512"
            height="340"
            loading="lazy"
            decoding="async"
            className="
              h-full
              w-full
              object-cover
              object-center
              transition-transform
              duration-700
              ease-out
              hover:scale-[1.03]
            "
          />
        </div>
      </Reveal>
    </section>
  );
}
