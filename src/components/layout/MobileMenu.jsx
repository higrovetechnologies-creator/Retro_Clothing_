import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

export default function MobileMenu({ open, onClose, links }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ==================================================
              BACKDROP
          =================================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70"
          />

          {/* ==================================================
              MOBILE MENU
              LEFT SIDE DRAWER
          =================================================== */}

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              glass-strong
              fixed
              inset-y-0
              left-0
              z-[80]
              flex
              w-[82%]
              max-w-sm
              flex-col
              px-7
              py-7
            "
          >
            {/* ==================================================
                MENU HEADER
            =================================================== */}

            <div className="flex items-center justify-between">
              <span className="font-display text-xl text-bone">
                Menu
              </span>

              <button
                onClick={onClose}
                aria-label="Close menu"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-bone
                  hover:bg-white/5
                "
              >
                <X
                  size={18}
                  strokeWidth={1.75}
                />
              </button>
            </div>

            {/* ==================================================
                NAVIGATION LINKS
            =================================================== */}

            <nav className="mt-10 flex flex-1 flex-col gap-1 overflow-y-auto">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{
                    opacity: 0,
                    x: -16,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.05 * i,
                    duration: 0.35,
                  }}
                >
                  <NavLink
                    to={l.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block border-b border-line py-3.5 font-display text-[19px] ${
                        isActive
                          ? "text-bone"
                          : "text-mist"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* ==================================================
                FOOTER TEXT
            =================================================== */}

            <p className="pt-4 text-[11px] uppercase tracking-widest text-mist">
              Luxury Made Affordable
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}