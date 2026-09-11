import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import {
  useReviews,
  useSettings,
} from "../hooks/useStore";
import { ReviewCard } from "../components/home/Sections";
import { Reveal } from "../components/common/Misc";
import Seo from "../components/common/Seo";
import { STATIC_ROUTES } from "../lib/seoRoutes";
import { breadcrumbJsonLd } from "../lib/seoConfig";

const STORY_ROUTE = STATIC_ROUTES.find(
  (r) => r.path === "/our-story"
);

/* ============================================================
   PERSON PORTRAIT
============================================================ */

function PersonPortrait({ person }) {
  const imageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start 90%", "center 50%"],
  });

  const mobileGrayscale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [100, 40, 0]
  );

  const mobileScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.035]
  );

  const mobileFilter = useTransform(
    mobileGrayscale,
    (value) => `grayscale(${value}%)`
  );

  return (
    <div
      ref={imageRef}
      className="
        relative
        flex
        min-h-[480px]
        items-end
        justify-center
        overflow-hidden
        sm:min-h-[560px]
        lg:min-h-[620px]
      "
    >
      {/* ======================================================
          MOBILE IMAGE
      ======================================================= */}

      <motion.div
        className="
          absolute
          inset-0
          flex
          items-end
          justify-center
          sm:hidden
        "
        style={{
          filter: mobileFilter,
          scale: mobileScale,
        }}
      >
        <img
          src={person?.image}
          alt={person?.name || "Retro Clothing"}
          loading="lazy"
          decoding="async"
          className="
            block
            h-full
            max-h-[620px]
            w-full
            object-contain
            object-bottom
          "
        />
      </motion.div>

      {/* ======================================================
          DESKTOP / LAPTOP IMAGE
      ======================================================= */}

      <img
        src={person?.image}
        alt={person?.name || "Retro Clothing"}
        loading="lazy"
        decoding="async"
        className="
          hidden
          h-full
          max-h-[620px]
          w-full
          object-contain
          object-bottom

          sm:block
          sm:grayscale
          sm:scale-100
          sm:transition-all
          sm:duration-700
          sm:ease-[cubic-bezier(0.22,1,0.36,1)]

          sm:group-hover:scale-[1.035]
          sm:group-hover:grayscale-0
        "
      />
    </div>
  );
}

/* ============================================================
   OUR STORY PAGE
============================================================ */

export default function OurStory() {
  const [reviewsPaused, setReviewsPaused] =
    useState(false);

  const settings = useSettings();

  const reviews = useReviews().filter(
    (r) => r?.is_featured
  );

  /* ==========================================================
     PAGE SCROLL TOP
  ========================================================== */

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ==========================================================
     PEOPLE
     
     IMPORTANT:
     settings.founder     = Balaji
     settings.cofounder  = Surya
     
     Balaji  → Founder
     Surya   → Founder & CEO
  ========================================================== */

  const people = [
    {
      ...(settings?.founder || {}),
      role: "Founder",
    },
    {
      ...(settings?.cofounder || {}),
      role: "CEO",
    },
  ];

  return (
    <div className="pb-24 pt-36 sm:pt-40 lg:pt-44">

      {/* ========================================================
          SEO
      ======================================================== */}

      <Seo
        title={STORY_ROUTE.title}
        description={STORY_ROUTE.description}
        path={STORY_ROUTE.path}
        jsonLd={breadcrumbJsonLd(
          STORY_ROUTE.breadcrumbs
        )}
      />

      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <section className="mx-auto max-w-[1000px] px-4 text-center sm:px-8">

        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-mist">
          Our Story
        </p>

        <h1 className="mt-4 font-display text-[42px] leading-[1.05] text-bone sm:text-[58px]">
          Tirunelveli's first{" "}
          <span className="italic">
            aesthetic clothing cart
          </span>
        </h1>

      </section>

      {/* ========================================================
          MAIN STORY IMAGE
      ======================================================== */}

      <Reveal className="mx-auto mt-12 max-w-[1200px] px-4 sm:px-8">

        <div
          className="
            aspect-[16/9]
            overflow-hidden
            rounded-[26px]
            border
            border-line
            bg-black
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
              hover:scale-[1.02]
            "
          />
        </div>

      </Reveal>

      {/* ========================================================
          STORY CONTENT
      ======================================================== */}

      <Reveal className="mx-auto mt-12 max-w-[760px] px-4 sm:px-8">

        <p className="text-[16px] leading-[1.9] text-mist">
          {settings?.storyLong}
        </p>

      </Reveal>

      {/* ========================================================
          PEOPLE BEHIND IT
          
          BALAJI  → FOUNDER
          SURYA   → FOUNDER & CEO
      ======================================================== */}

      <section className="mx-auto mt-24 max-w-[1200px] px-4 sm:px-8">

        <p className="mb-10 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-mist">
          The People Behind It
        </p>

        <div className="grid items-end gap-14 sm:grid-cols-2 sm:gap-10">

          {people.map((person, i) => (

            <Reveal
              key={`${person?.name || "person"}-${i}`}
              delay={i * 0.1}
              className="group"
            >

              {/* ==================================================
                  PERSON IMAGE
              =================================================== */}

              <PersonPortrait
                person={person}
              />

              {/* ==================================================
                  PERSON DETAILS
              =================================================== */}

              <div className="mt-5 text-center sm:text-left">

                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-mist">
                  {person.role}
                </p>

                <p className="mt-2 font-display text-2xl text-bone">
                  {person?.name}
                </p>

              </div>

            </Reveal>

          ))}

        </div>

      </section>

      {/* ========================================================
          REVIEWS
          RIGHT → LEFT
          SMOOTH / SLOW / ENDLESS
      ======================================================== */}

      {reviews.length > 0 && (

        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">

          <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-mist">
            What People Say
          </p>

          <div
            className={`reviews-auto-scroll no-scrollbar overflow-hidden pb-2 ${
              reviewsPaused
                ? "is-paused"
                : ""
            }`}
            aria-label="Customer reviews"

            onPointerDown={() =>
              setReviewsPaused(true)
            }

            onPointerUp={() =>
              setReviewsPaused(false)
            }

            onPointerCancel={() =>
              setReviewsPaused(false)
            }

            onPointerLeave={() =>
              setReviewsPaused(false)
            }

            onTouchStart={() =>
              setReviewsPaused(true)
            }

            onTouchEnd={() =>
              setReviewsPaused(false)
            }
          >

            <div className="reviews-marquee flex w-max gap-4">

              {/* ==================================================
                  FIRST REVIEW SET
              =================================================== */}

              <div className="reviews-set flex shrink-0 gap-4">

                {reviews.map((r) => (

                  <ReviewCard
                    key={`review-a-${r.id}`}
                    review={r}
                  />

                ))}

              </div>

              {/* ==================================================
                  DUPLICATE REVIEW SET
              =================================================== */}

              <div
                className="reviews-set flex shrink-0 gap-4"
                aria-hidden="true"
              >

                {reviews.map((r) => (

                  <ReviewCard
                    key={`review-b-${r.id}`}
                    review={r}
                  />

                ))}

              </div>

            </div>

          </div>

        </section>

      )}

      {/* ========================================================
          STORE LOCATION
      ======================================================== */}

      <Reveal className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-8">

        <div className="overflow-hidden rounded-[26px] border border-line">

          {/* ==================================================
              LOCATION HEADER
          =================================================== */}

          <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">

            <div className="flex items-start gap-3">

              <MapPin
                size={20}
                strokeWidth={1.75}
                className="mt-0.5 shrink-0 text-bone"
              />

              <div>

                <p className="font-display text-xl text-bone">
                  Visit the Flagship Store
                </p>

                <p className="mt-1 max-w-md text-sm text-mist">
                  {settings?.address}
                </p>

              </div>

            </div>

            {/* ==================================================
                GOOGLE MAPS BUTTON
            =================================================== */}

            <a
              href={settings?.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="
                flex
                shrink-0
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
              Open in Google Maps

              <ExternalLink size={13} />
            </a>

          </div>

          {/* ==================================================
              GOOGLE MAP
          =================================================== */}

          <iframe
            title="Retro Clothing location"
            className="
              h-[320px]
              w-full
              grayscale
              invert-[0.92]
              contrast-[1.1]
            "
            loading="lazy"
            src="https://www.google.com/maps?q=8.7297747,77.6792023&z=16&output=embed"
          />

        </div>

      </Reveal>

    </div>
  );
}
