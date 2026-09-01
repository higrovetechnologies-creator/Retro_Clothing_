import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "All Collection", to: "/collection" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Offer Product", to: "/offers" },
  { label: "Shirts", to: "/shirts" },
  { label: "Tees", to: "/tees" },
  { label: "Pants", to: "/pants" },
  { label: "Our Story", to: "/our-story" },
  { label: "Tirunelveli", to: "/tirunelveli" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  /* ============================================================
     SCROLL
  ============================================================ */

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ============================================================
     SEARCH FOCUS
  ============================================================ */

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  /* ============================================================
     CLOSE SEARCH OUTSIDE
  ============================================================ */

  useEffect(() => {
    function onClick(e) {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", onClick);

    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  /* ============================================================
     CLOSE MENU / SEARCH WHEN ROUTE CHANGES
  ============================================================ */

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  /* ============================================================
     SEARCH
  ============================================================ */

  const submitSearch = (e) => {
    e.preventDefault();

    const value = query.trim();

    if (!value) return;

    navigate(
      `/collection?q=${encodeURIComponent(value)}`
    );

    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || !isHome
            ? "glass-strong"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">

          {/* ==================================================
              TOP ROW

              MOBILE:
              Menu       LOGO       Search

              LAPTOP:
                         LOGO      Search

              SAME IMAGE LOGO
              CENTERED
          =================================================== */}

          <div className="relative flex h-[78px] items-center justify-center">

            {/* ==================================================
                MOBILE MENU
            =================================================== */}

            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className="
                absolute
                left-0
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-bone
                transition-colors
                hover:bg-white/5
                lg:hidden
              "
            >
              <Menu
                size={21}
                strokeWidth={1.75}
              />
            </button>

            {/* ==================================================
                CENTER LOGO IMAGE

                IMPORTANT:
                Put your logo at:

                public/logo.png

                Same logo for mobile + laptop.
                No shop name.
            =================================================== */}

            <Link
              to="/"
              aria-label="Retro Clothing Home"
              className="
                absolute
                left-1/2
                top-1/2
                flex
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
                transition-transform
                duration-300
                hover:scale-105
              "
            >
              <img
                src="/Retro-logo.png"
                alt="Retro Clothing"
                draggable={false}
                className="
                  h-14
                  w-auto
                  max-w-[180px]
                  object-contain
                  sm:h-16
                  lg:h-[68px]
                "
              />
            </Link>

            {/* ==================================================
                SEARCH
                RIGHT CORNER
                MOBILE + LAPTOP
            =================================================== */}

            <div
              ref={wrapRef}
              className="absolute right-0"
            >
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    onSubmit={submitSearch}
                    initial={{
                      width: 0,
                      opacity: 0,
                    }}
                    animate={{
                      width:
                        "min(260px, calc(100vw - 110px))",
                      opacity: 1,
                    }}
                    exit={{
                      width: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      absolute
                      right-11
                      top-1/2
                      -translate-y-1/2
                      overflow-hidden
                    "
                  >
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) =>
                        setQuery(e.target.value)
                      }
                      placeholder="Search products…"
                      className="
                        glass
                        h-10
                        w-full
                        rounded-full
                        px-4
                        text-sm
                        text-bone
                        placeholder:text-mist
                        focus:outline-none
                      "
                    />
                  </motion.form>
                )}
              </AnimatePresence>

              <button
                type="button"
                aria-label={
                  searchOpen
                    ? "Close search"
                    : "Search"
                }
                onClick={() =>
                  setSearchOpen((s) => !s)
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  text-bone
                  transition-colors
                  hover:bg-white/5
                "
              >
                {searchOpen ? (
                  <X
                    size={19}
                    strokeWidth={1.75}
                  />
                ) : (
                  <Search
                    size={19}
                    strokeWidth={1.75}
                  />
                )}
              </button>
            </div>
          </div>

          {/* ==================================================
              DESKTOP NAVIGATION
          =================================================== */}

          <div
            className="
              hidden
              min-h-[48px]
              items-center
              justify-center
              border-t
              border-white/10
              lg:flex
            "
          >
            <nav
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-x-6
                gap-y-2
                py-3
                xl:gap-x-7
              "
            >
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `
                    relative
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.16em]
                    transition-colors
                    ${
                      isActive
                        ? "text-bone"
                        : "text-mist hover:text-bone"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <span className="relative pb-1">
                      {l.label}

                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="
                            absolute
                            -bottom-0.5
                            left-0
                            h-px
                            w-full
                            bg-bone
                          "
                        />
                      )}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ======================================================
          MOBILE MENU
      ======================================================= */}

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
      />
    </>
  );
}