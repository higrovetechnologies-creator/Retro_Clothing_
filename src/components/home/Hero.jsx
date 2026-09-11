import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const letterVariants = {
    hidden: {
      opacity: 0,
      scale: 1.35,
      filter: "blur(8px)",
    },

    visible: (index) => ({
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.65,
        delay: index * 0.075,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

      {/* =====================================================
          HERO IMAGE
          ===================================================== */}
      <img
        src="/hero-poster.png"
        alt="Retro Clothing Tirunelveli"
        width="1672"
        height="941"
        fetchPriority="high"
        decoding="async"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
        "
      />

      {/* =====================================================
          SUBTLE IMAGE OVERLAY
          ===================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/20
        "
      />

      {/* =====================================================
          BOTTOM CINEMATIC GRADIENT
          ===================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-[50%]
          bg-gradient-to-t
          from-black/60
          via-black/20
          to-transparent
        "
      />

      {/* =====================================================
          HERO CONTENT
          ===================================================== */}
      <div
        className="
          absolute
          inset-0
          z-10
          flex
          items-end
          justify-center
          px-4
          pb-[22vh]
          text-center
        "
      >
        <div className="flex w-full flex-col items-center">

          {/* =================================================
              MAIN TITLE
              ================================================= */}
          <motion.h1
            initial="hidden"
            animate="visible"
            className="
              font-bolton-shadowed
              w-full
              text-white
              drop-shadow-[0_5px_18px_rgba(0,0,0,0.65)]

              text-[12vw]
              leading-[0.82]

              sm:text-[11vw]
              sm:leading-[0.86]

              md:text-[8vw]
              md:leading-[0.86]

              lg:text-[6.5vw]
            "
          >

            {/* =================================================
                MOBILE
                ================================================= */}
            <span className="block sm:hidden">

              {/* RETRO */}
              <span className="block whitespace-nowrap">
                {"Retro".split("").map((letter, index) => (
                  <motion.span
                    key={`mobile-retro-${index}`}
                    custom={index}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>

              {/* CLOTHING */}
              <span className="block whitespace-nowrap">
                {"Clothing".split("").map((letter, index) => (
                  <motion.span
                    key={`mobile-clothing-${index}`}
                    custom={index + 5}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>

            </span>

            {/* =================================================
                TABLET + DESKTOP
                ================================================= */}
            <span className="hidden whitespace-nowrap sm:block">
              {"Retro Clothing".split("").map((letter, index) => (
                <motion.span
                  key={`desktop-${letter}-${index}`}
                  custom={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </span>

          </motion.h1>

          {/* =================================================
              ELEGANT DIVIDER
              ================================================= */}
          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0,
            }}
            animate={{
              opacity: 1,
              scaleX: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 1.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              mt-6
              h-px
              w-14
              origin-center
              bg-white/75
              sm:w-20
              md:w-24
            "
          />

          {/* =================================================
              TAGLINE
              
              Luxury Made Affordable

              OLD GLOW / ILLUMINATION EFFECT RESTORED

              Starts slightly later than Retro Clothing.
              ================================================= */}
          <motion.p
            initial={{
              opacity: 0,
              filter: "blur(10px)",
              textShadow:
                "0 0 0px rgba(255,255,255,0), 0 0 0px rgba(255,255,255,0)",
            }}
            animate={{
              opacity: [0, 0.25, 0.7, 1],

              filter: [
                "blur(10px)",
                "blur(6px)",
                "blur(2px)",
                "blur(0px)",
              ],

              textShadow: [
                "0 0 0px rgba(255,255,255,0), 0 0 0px rgba(255,255,255,0)",

                "0 0 12px rgba(255,255,255,0.25), 0 0 25px rgba(255,255,255,0.08)",

                "0 0 28px rgba(255,255,255,0.65), 0 0 55px rgba(255,255,255,0.25)",

                "0 0 8px rgba(255,255,255,0.18), 0 0 20px rgba(255,255,255,0.05)",
              ],
            }}
            transition={{
              duration: 1.6,

              // Starts later than the title
              delay: 0.8,

              ease: [0.22, 1, 0.36, 1],

              times: [0, 0.28, 0.65, 1],
            }}
            className="
              font-bolton
              mt-5
              whitespace-nowrap
              text-[5.2vw]
              leading-none
              text-white
              drop-shadow-[0_3px_14px_rgba(0,0,0,0.6)]

              sm:text-[4vw]
              md:text-[3.1vw]
              lg:text-[2.4vw]
            "
          >
            Luxury Made Affordable
          </motion.p>

        </div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
          ===================================================== */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 1,
          delay: 2.8,
        }}
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-7
          z-20
          flex
          justify-center
        "
      >
        <motion.div
          animate={{
            y: [0, 7, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut",
          }}
          className="
            flex
            flex-col
            items-center
            gap-1
            text-white/80
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.35em]
              opacity-70
            "
          >
            Scroll
          </span>

          <ChevronDown
            size={19}
            strokeWidth={1.3}
          />
        </motion.div>
      </motion.div>

    </section>
  );
}
