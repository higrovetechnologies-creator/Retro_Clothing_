import { useState } from "react";
import {
  Navigate,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Megaphone,
  Settings,
  MessageSquare,
  Star,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

import { useSession } from "../../hooks/useStore";
import { auth } from "../../lib/store";
import Seo from "../../components/common/Seo";

// CHANGE THIS PATH IF YOUR LOGO IS IN A DIFFERENT FOLDER
import logo from "/public/Retro-logo.png";

const LINKS = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: ShoppingBag,
  },
  {
    to: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    to: "/admin/reviews",
    label: "Reviews",
    icon: Star,
  },
  {
    to: "/admin/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    to: "/admin/settings",
    label: "Company Settings",
    icon: Settings,
  },
];

export default function AdminLayout() {
  const session = useSession();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const signOut = () => {
    auth.signOut();

    setMobileMenuOpen(false);

    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-ink text-bone">
      <Seo title="Admin" description="Retro Clothing admin dashboard." path="/admin" noindex />
      {/* ======================================================
          DESKTOP SIDEBAR
      ======================================================= */}

      <aside className="glass-strong fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line p-5 lg:flex">
        {/* ====================================================
            CLICKABLE LOGO / BRAND
        ===================================================== */}

        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mb-8 flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-opacity hover:opacity-80 focus:outline-none"
          aria-label="Go to Dashboard"
        >
          {/* LOGO IMAGE */}

          <img
            src={logo}
            alt="Retro Clothing"
            className="h-10 w-10 shrink-0 rounded-full object-contain"
          />

          <div className="min-w-0">
            <p className="truncate font-display text-base leading-none text-bone">
              Retro Clothing
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-widest text-mist">
              Admin Panel
            </p>
          </div>
        </button>

        {/* ====================================================
            NAVIGATION
        ===================================================== */}

        <nav className="flex flex-1 flex-col gap-1">
          {LINKS.map(
            ({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-[42px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-bone text-ink shadow-sm"
                      : "text-mist hover:bg-white/5 hover:text-bone"
                  }`
                }
              >
                <Icon
                  size={16}
                  strokeWidth={1.75}
                  className="shrink-0"
                />

                <span className="truncate">
                  {label}
                </span>
              </NavLink>
            )
          )}
        </nav>

        {/* ====================================================
            BOTTOM ACTIONS
        ===================================================== */}

        <div className="mt-auto space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[42px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-mist transition-colors hover:bg-white/5 hover:text-bone"
          >
            <ExternalLink
              size={16}
              strokeWidth={1.75}
              className="shrink-0"
            />

            <span>View Website</span>
          </a>

          <button
            type="button"
            onClick={signOut}
            className="flex min-h-[42px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-medium text-mist transition-colors hover:bg-white/5 hover:text-bone"
          >
            <LogOut
              size={16}
              strokeWidth={1.75}
              className="shrink-0"
            />

            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ======================================================
          MAIN AREA
      ======================================================= */}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <MobileAdminBar
          open={mobileMenuOpen}
          setOpen={setMobileMenuOpen}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 lg:py-10 xl:px-12">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ======================================================
          MOBILE DRAWER
      ======================================================= */}

      {mobileMenuOpen && (
        <MobileAdminDrawer
          onClose={() => setMobileMenuOpen(false)}
          onSignOut={signOut}
        />
      )}
    </div>
  );
}

/* ============================================================
   MOBILE / TABLET TOP BAR
============================================================ */

function MobileAdminBar({ open, setOpen }) {
  const navigate = useNavigate();

  const goDashboard = () => {
    setOpen(false);

    navigate("/admin");
  };

  return (
    <header className="glass-strong sticky top-0 z-50 flex min-h-[60px] items-center justify-between border-b border-line px-4 py-3 sm:px-6 lg:hidden">
      {/* CLICKABLE MOBILE LOGO */}

      <button
        type="button"
        onClick={goDashboard}
        className="flex min-w-0 items-center gap-2.5 rounded-xl text-left transition-opacity hover:opacity-80 focus:outline-none"
        aria-label="Go to Dashboard"
      >
        <img
          src={logo}
          alt="Retro Clothing"
          className="h-8 w-8 shrink-0 rounded-full object-contain"
        />

        <div className="min-w-0">
          <p className="truncate font-display text-sm leading-none text-bone">
            Retro Clothing
          </p>

          <p className="mt-1 text-[9px] uppercase tracking-widest text-mist">
            Admin
          </p>
        </div>
      </button>

      {/* MENU BUTTON */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-bone transition-colors hover:bg-white/5"
        aria-label={
          open
            ? "Close menu"
            : "Open menu"
        }
        aria-expanded={open}
      >
        {open ? (
          <X
            size={19}
            strokeWidth={1.75}
          />
        ) : (
          <Menu
            size={19}
            strokeWidth={1.75}
          />
        )}
      </button>
    </header>
  );
}

/* ============================================================
   MOBILE / TABLET DRAWER
============================================================ */

function MobileAdminDrawer({
  onClose,
  onSignOut,
}) {
  const navigate = useNavigate();

  const goDashboard = () => {
    onClose();

    navigate("/admin");
  };

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* DRAWER */}

      <aside className="glass-strong absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col border-l border-line p-5 shadow-2xl">
        {/* ====================================================
            DRAWER HEADER
        ===================================================== */}

        <div className="mb-8 flex items-center justify-between">
          {/* CLICKABLE DRAWER LOGO */}

          <button
            type="button"
            onClick={goDashboard}
            className="flex min-w-0 items-center gap-3 rounded-xl text-left transition-opacity hover:opacity-80 focus:outline-none"
            aria-label="Go to Dashboard"
          >
            <img
              src={logo}
              alt="Retro Clothing"
              className="h-10 w-10 shrink-0 rounded-full object-contain"
            />

            <div className="min-w-0">
              <p className="truncate font-display text-base leading-none text-bone">
                Retro Clothing
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-widest text-mist">
                Admin Panel
              </p>
            </div>
          </button>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mist transition-colors hover:bg-white/5 hover:text-bone"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* ====================================================
            DRAWER NAVIGATION
        ===================================================== */}

        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
          {LINKS.map(
            ({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-bone text-ink"
                      : "text-mist hover:bg-white/5 hover:text-bone"
                  }`
                }
              >
                <Icon
                  size={18}
                  strokeWidth={1.75}
                  className="shrink-0"
                />

                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* ====================================================
            DRAWER BOTTOM ACTIONS
        ===================================================== */}

        <div className="mt-6 border-t border-line pt-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="flex min-h-[46px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-mist transition-colors hover:bg-white/5 hover:text-bone"
          >
            <ExternalLink
              size={18}
              strokeWidth={1.75}
            />

            View Website
          </a>

          <button
            type="button"
            onClick={onSignOut}
            className="mt-1 flex min-h-[46px] w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-mist transition-colors hover:bg-white/5 hover:text-bone"
          >
            <LogOut
              size={18}
              strokeWidth={1.75}
            />

            Sign Out
          </button>
        </div>
      </aside>
    </div>
  );
}