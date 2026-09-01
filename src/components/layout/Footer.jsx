import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSettings } from "../../hooks/useStore";
import InstagramIcon from "../common/InstagramIcon";

// Change this path if your logo is stored somewhere else
import logo from "/public/Retro-logo.png";

export default function Footer() {
  const s = useSettings();

  return (
    <footer className="border-t border-line bg-charcoal/60">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* ====================================================
              BRAND
          ===================================================== */}

          <div>
            <Link
              to="/"
              className="group flex items-center gap-2.5 rounded-xl"
              aria-label="Go to Home"
            >
              <img
                src={logo}
                alt="Retro Clothing"
                className="h-9 w-9 shrink-0 rounded-full object-contain transition-opacity group-hover:opacity-80"
              />

              <span className="font-display text-xl text-bone">
                Retro Clothing
              </span>
            </Link>

            <p className="mt-4 text-sm text-mist">
              {s.district} · Since {s.since}
            </p>

            <p className="mt-1 font-display italic text-bone">
              {s.tagline}
            </p>
          </div>

          {/* ====================================================
              SHOP
          ===================================================== */}

          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-mist">
              Shop
            </p>

            <ul className="space-y-2.5 text-sm">
              {[
                ["All Collection", "/collection"],
                ["New Arrivals", "/new-arrivals"],
                ["Offer Products", "/offers"],
                ["Shirts", "/shirts"],
                ["Tees", "/tees"],
                ["Pants", "/pants"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-mist transition-colors hover:text-bone"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ====================================================
              CUSTOMER CARE
          ===================================================== */}

          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-mist">
              Customer Care
            </p>

            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/tirunelveli"
                  className="text-mist transition-colors hover:text-bone"
                >
                  Tirunelveli Store
                </Link>
              </li>

              <li>
                <Link
                  to="/our-story"
                  className="text-mist transition-colors hover:text-bone"
                >
                  Our Story
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-mist transition-colors hover:text-bone"
                >
                  Contact
                </Link>
              </li>

              <li>
                <a
                  href={s.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-mist transition-colors hover:text-bone"
                >
                  Stores
                </a>
              </li>
            </ul>
          </div>

          {/* ====================================================
              VISIT US
          ===================================================== */}

          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-mist">
              Visit Us
            </p>

            <ul className="space-y-3 text-sm text-mist">
              {/* ADDRESS */}

              <li>
                <a
                  href={s.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2.5 transition-colors hover:text-bone"
                >
                  <MapPin
                    size={15}
                    strokeWidth={1.75}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{s.address}</span>
                </a>
              </li>

              {/* PHONE */}

              <li className="flex flex-wrap items-center gap-2.5">
                <Phone
                  size={15}
                  strokeWidth={1.75}
                  className="shrink-0"
                />

                <a
                  href={`tel:${s.phone1}`}
                  className="transition-colors hover:text-bone"
                >
                  {s.phone1}
                </a>

                <span>/</span>

                <a
                  href={`tel:${s.phone2}`}
                  className="transition-colors hover:text-bone"
                >
                  {s.phone2}
                </a>
              </li>

              {/* EMAIL */}

              <li className="flex items-center gap-2.5">
                <Mail
                  size={15}
                  strokeWidth={1.75}
                  className="shrink-0"
                />

                <a
                  href={`mailto:${s.email}`}
                  className="break-all transition-colors hover:text-bone"
                >
                  {s.email}
                </a>
              </li>

              {/* INSTAGRAM */}

              <li className="flex items-center gap-2.5">
                <InstagramIcon
                  size={15}
                  className="shrink-0"
                />

                <a
                  href={s.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-bone"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ====================================================
            FOOTER BOTTOM
        ===================================================== */}

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-mist sm:flex-row">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Retro Clothing. All rights reserved.
          </p>

          <p className="text-center sm:text-right">
            Ships all over India · Cash on Delivery Available
          </p>
        </div>
      </div>
    </footer>
  );
}