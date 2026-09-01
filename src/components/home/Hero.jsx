import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [heroStage, setHeroStage] = useState(0);

  /* ============================================================
     BACKGROUND VIDEO — LOADING / PERFORMANCE STATE

     - reducedMotion : user prefers no motion -> never load/play
       the scrubbing video, poster stays as the permanent background.
     - startLoad     : becomes true once the browser is idle so the
       video download never competes with initial page render,
       product loading, or Supabase requests.
     - videoReady    : true once the first frame is actually
       decoded and paintable -> triggers the poster -> video
       cross-fade.
     - videoFailed   : true if the video errors out -> poster stays
       as the permanent background, no broken video UI.
     ============================================================ */

  const [reducedMotion, setReducedMotion] = useState(false);
  const [startLoad, setStartLoad] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const handleChange = (e) => setReducedMotion(e.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    // Defer attaching the video <source>s until the browser is idle so
    // the hero video never delays first paint, product loading, or
    // Supabase requests. requestIdleCallback isn't in Safari, so we
    // fall back to a short timeout there.
    const idle =
      window.requestIdleCallback ||
      ((cb) => setTimeout(cb, 300));
    const cancelIdle =
      window.cancelIdleCallback || ((id) => clearTimeout(id));

    const id = idle(() => setStartLoad(true));
    return () => cancelIdle(id);
  }, [reducedMotion]);

  /* ============================================================
     STAGE
     ============================================================ */

  useEffect(() => {
    const unsubscribe = scrollYProgress.on(
      "change",
      (progress) => {
        setHeroStage(progress < 0.20 ? 0 : 1);
      }
    );

    return () => unsubscribe();
  }, [scrollYProgress]);

  /* ============================================================
     SCROLL CONTROLLED VIDEO

     VIDEO BEHAVES LIKE A KEYFRAME ANIMATION

     Scroll 0%   -> Video 0%
     Scroll 25%  -> Video 25%
     Scroll 50%  -> Video 50%
     Scroll 75%  -> Video 75%
     Scroll 100% -> Video 100%

     NO AUTOPLAY
     NO LOOP
     NO INTERPOLATION DELAY

     The video position follows scroll directly.
     ============================================================ */

  useEffect(() => {
    const video = videoRef.current;

    // Nothing to scrub until the video actually exists in the DOM
    // (we don't mount its <source>s until startLoad is true), and we
    // never scrub at all for reduced-motion users or after a load error.
    if (!video || !startLoad || reducedMotion || videoFailed) return;

    let duration = 0;
    let ready = false;
    let rafId = null;

    /*
     * True while the browser is actively decoding a seek.
     * We never assign currentTime again until this clears,
     * otherwise seeks pile up and the video stutters/lags
     * behind the scroll instead of tracking it live.
     */
    let seekPending = false;

    /*
     * Half a frame's duration (assume ~24fps until we know
     * better from the video itself). Anything smaller than
     * this is not a visually distinct frame, so skipping it
     * avoids pointless seek calls without introducing any
     * perceptible offset from real scroll position.
     */
    let frameEpsilon = 1 / 48;

    /* ------------------------------------------------------------
       Get video duration / frame rate
       ------------------------------------------------------------ */

    const initializeVideo = () => {
      if (
        !video.duration ||
        !Number.isFinite(video.duration)
      ) {
        return;
      }

      duration = video.duration;
      ready = true;
    };

    const handleSeeked = () => {
      seekPending = false;
    };

    const handleLoadedData = () => {
      // First frame is decoded and paintable -> safe to cross-fade
      // from the poster to the video without any flash.
      setVideoReady(true);
    };

    const handleError = () => {
      // Keep the poster as the permanent background. Never show a
      // broken video icon or let this bubble up as a React error.
      setVideoFailed(true);
    };

    /* ------------------------------------------------------------
       Frame loop

       Reads scroll progress directly from the motion value
       every animation frame (no extra subscription layer, no
       React state, no re-renders). Progress -> time mapping is
       linear and exact: 0% scroll = frame 0, 100% scroll = last
       frame. There is no smoothing/interpolation applied to the
       value itself — the only thing we skip is redundant identical
       seeks while a decode is still in flight.
       ------------------------------------------------------------ */

    const tick = () => {
      if (ready && duration > 0 && !seekPending) {
        const progress = Math.min(
          Math.max(scrollYProgress.get(), 0),
          1
        );

        const targetTime =
          progress * Math.max(0, duration - 0.01);

        if (
          Math.abs(video.currentTime - targetTime) >
          frameEpsilon
        ) {
          seekPending = true;
          try {
            video.currentTime = targetTime;
          } catch {
            seekPending = false;
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    /* ------------------------------------------------------------
       Video configuration — scrubbing-friendly, no playback
       ------------------------------------------------------------ */

    video.pause();

    video.autoplay = false;
    video.loop = false;
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadedmetadata", initializeVideo);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    // Metadata may already be loaded by the time this effect runs.
    if (video.readyState >= 1) {
      initializeVideo();
    }
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener("loadedmetadata", initializeVideo);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [scrollYProgress, startLoad, reducedMotion, videoFailed]);

  /* ============================================================
     RETRO
  ============================================================ */

  const retroOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.15, 0.24],
    [1, 1, 0.55, 0]
  );

  const retroScale = useTransform(
    scrollYProgress,
    [0, 0.24],
    [1, 1.04]
  );

  const retroY = useTransform(
    scrollYProgress,
    [0, 0.24],
    [0, -25]
  );

  /* ============================================================
     LUXURY
  ============================================================ */

  const luxuryOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.32],
    [0, 1]
  );

  const luxuryY = useTransform(
    scrollYProgress,
    [0.16, 0.32, 0.72, 1],
    [45, 0, -50, -180]
  );

  const luxuryScale = useTransform(
    scrollYProgress,
    [0.16, 0.32, 1],
    [0.95, 1, 0.92]
  );

  /* ============================================================
     END IMAGE
  ============================================================ */

  const endImageOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.84, 1],
    [0, 0.55, 1]
  );

  const endImageScale = useTransform(
    scrollYProgress,
    [0.72, 1],
    [1.08, 1]
  );

  const endImageY = useTransform(
    scrollYProgress,
    [0.72, 1],
    [60, 0]
  );

  /* ============================================================
     END IMAGE OVERLAY
  ============================================================ */

  const endOverlayOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.90, 1],
    [0, 0.25, 0.45]
  );

  /* ============================================================
     BACKGROUND OVERLAY
  ============================================================ */

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [0.78, 0.58, 0.62, 0.72]
  );

  /* ============================================================
     GRAIN
  ============================================================ */

  const grainOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [0.30, 0.14, 0.16, 0.10]
  );

  /* ============================================================
     SCROLL INDICATOR
  ============================================================ */

  const scrollIndicatorOpacity =
    useTransform(
      scrollYProgress,
      [0, 0.55, 0.82, 1],
      [1, 1, 0.25, 0]
    );

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-[200vh]
        bg-ink
      "
    >
      {/* ======================================================
          STICKY HERO
      ======================================================= */}

      <div
        className="
          sticky
          top-0
          h-screen
          w-full
          overflow-hidden
          bg-black
        "
      >

        {/* ====================================================
            POSTER — instant background, never blocks first paint.
            Stays mounted underneath the video at all times so a
            slow network, a load error, or prefers-reduced-motion
            all degrade gracefully to this exact same frame.
        ===================================================== */}

        <picture>
          <source srcSet="/hero-poster.avif" type="image/avif" />
          <source srcSet="/hero-poster.webp" type="image/webp" />
          <img
            src="/hero-poster.png"
            alt=""
            width="1672"
            height="941"
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />
        </picture>

        {/* ====================================================
            SCROLL KEYFRAME VIDEO

            Sources are only mounted once the browser is idle
            (see startLoad) so the download never competes with
            product loading or Supabase requests. Cross-fades in
            over the poster once the first frame is actually
            paintable — never before, never with a flash.
        ===================================================== */}

        {!reducedMotion && !videoFailed && (
          <video
            ref={videoRef}
            className={`
              absolute
              inset-0
              h-full
              w-full
              object-cover
              will-change-auto
              transition-opacity
              duration-700
              ease-out
              ${videoReady ? "opacity-100" : "opacity-0"}
            `}
            muted
            playsInline
            preload="metadata"
            fetchPriority="low"
            autoPlay={false}
            loop={false}
            controls={false}
            aria-hidden="true"
          >
            {startLoad && (
              <>
                <source
                  src="/hero-video-mobile.mp4"
                  type="video/mp4"
                  media="(max-width: 768px)"
                />
                <source src="/hero-video-desktop.mp4" type="video/mp4" />
              </>
            )}
          </video>
        )}

        {/* ====================================================
            BASE OVERLAY
        ===================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black/30
          "
        />

        {/* ====================================================
            CINEMATIC OVERLAY
        ===================================================== */}

        <motion.div
          style={{
            opacity: overlayOpacity,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-b
            from-black/55
            via-black/20
            to-black/75
          "
        />

        {/* ====================================================
            END IMAGE
        ===================================================== */}


        {/* ====================================================
            END IMAGE OVERLAY
        ===================================================== */}

        <motion.div
          style={{
            opacity: endOverlayOpacity,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black
          "
        />

        {/* ====================================================
            GRAIN
        ===================================================== */}

        <motion.div
          style={{
            opacity: grainOpacity,
          }}
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            mix-blend-overlay
            grain
          "
        />

        {/* ====================================================
            HERO CONTENT
        ===================================================== */}

        <div
          className="
            relative
            z-10
            flex
            h-full
            w-full
            items-center
            justify-center
            px-6
            text-center
          "
        >
          {/* SEO: one real H1 for the page, visually hidden — the animated
              "Retro" / "Luxury" sequence below is decorative and stays as-is. */}
          <h1 className="sr-only">Retro Clothing in Tirunelveli</h1>

          {/* ==================================================
              RETRO
          =================================================== */}

          {heroStage === 0 && (
            <motion.div
              key="retro"
              style={{
                opacity: retroOpacity,
                scale: retroScale,
                y: retroY,
              }}
              className="
                absolute
                flex
                flex-col
                items-center
                will-change-transform
              "
            >
              <span
                className="
                  mb-4
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-mist
                  sm:text-[11px]
                  sm:tracking-[0.4em]
                "
              >
                Tirunelveli · Since 2026
              </span>

              <p
                aria-hidden="true"
                className="
                  font-display
                  text-[20vw]
                  leading-[0.82]
                  text-bone
                  sm:text-[15vw]
                  lg:text-[11vw]
                "
              >
                Retro
              </p>
            </motion.div>
          )}

          {/* ==================================================
              LUXURY
          =================================================== */}

          {heroStage === 1 && (
            <motion.div
              key="luxury"
              style={{
                opacity: luxuryOpacity,
                y: luxuryY,
                scale: luxuryScale,
              }}
              className="
                absolute
                flex
                max-w-[95vw]
                flex-col
                items-center
                will-change-transform
              "
            >
              <h2
                className="
                  font-display
                  text-[14vw]
                  leading-[0.82]
                  text-bone
                  sm:text-[11vw]
                  lg:text-[8vw]
                "
              >
                Luxury
              </h2>

              <p
                className="
                  mt-5
                  font-display
                  text-[9vw]
                  italic
                  leading-[0.9]
                  text-bone
                  sm:text-[6vw]
                  lg:text-[4.5vw]
                "
              >
                Made Affordable
              </p>

              <span
                className="
                  mt-5
                  max-w-[90vw]
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-mist
                  sm:text-[11px]
                  sm:tracking-[0.35em]
                "
              >
                Cut for the everyday. Priced for everyone.
              </span>
            </motion.div>
          )}

        </div>

        {/* ====================================================
            SCROLL INDICATOR
        ===================================================== */}

        <motion.div
          style={{
            opacity: scrollIndicatorOpacity,
          }}
          className="
            absolute
            inset-x-0
            bottom-8
            z-30
            flex
            flex-col
            items-center
            gap-2
            text-mist
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.3em]
              sm:text-[10px]
            "
          >
            Scroll
          </span>

          <motion.div
            animate={{
              y: [0, 6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          >
            <ChevronDown
              size={16}
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}