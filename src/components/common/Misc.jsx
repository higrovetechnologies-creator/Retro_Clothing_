import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  action,
  as = "h2",
}) {
  const HeadingTag = as;

  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-mist">
            {eyebrow}
          </p>
        )}

        <HeadingTag className="font-display text-[28px] leading-none text-bone sm:text-[34px]">
          {title}
        </HeadingTag>
      </div>

      {action}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
        >
          <div className="aspect-[4/5] rounded-[20px] bg-surface" />

          <div className="mt-3 h-3 w-3/4 rounded bg-surface" />

          <div className="mt-2 h-3 w-1/3 rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title = "No products found",
  message = "Try changing your search or filters.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[22px] border border-line bg-charcoal/50 px-6 py-20 text-center">
      <p className="font-display text-2xl text-bone">
        {title}
      </p>

      <p className="mt-2 max-w-xs text-sm text-mist">
        {message}
      </p>

      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-6 rounded-full border border-line-strong px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-bone transition-colors hover:bg-bone hover:text-ink"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ============================================================
   HORIZONTAL PRODUCT SCROLLER

   Mobile behavior:
   - Vertical swipe  -> page scrolls normally
   - Horizontal swipe -> products scroll horizontally
   - Product top/bottom is not clipped
   - Does not affect Hero animation
============================================================ */

export function HorizontalScroller({
  children,
  className = "",
}) {
  const scrollerRef = useRef(null);

  return (
    <div
      ref={scrollerRef}
      className={`
        no-scrollbar
        -mx-4
        flex
        w-auto
        min-w-0
        gap-4
        overflow-x-auto
        overflow-y-visible
        snap-x
        snap-mandatory
        overscroll-x-contain
        px-4
        pb-4
        sm:mx-0
        sm:px-0
        ${className}
      `}
      style={{
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x pan-y",
        scrollbarWidth: "none",
      }}
    >
      {children}
    </div>
  );
}

export function FilterButton({
  onClick,
  active,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors ${
        active
          ? "border-bone bg-bone text-ink"
          : "border-line-strong text-bone hover:bg-white/5"
      }`}
    >
      <SlidersHorizontal
        size={13}
        strokeWidth={1.75}
      />

      Filters
    </button>
  );
}

export function PillLink({
  to,
  children,
  ...rest
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-xs font-medium uppercase tracking-widest text-bone transition-colors hover:bg-bone hover:text-ink"
      {...rest}
    >
      {children}
    </Link>
  );
}

export const fadeUp = {
  initial: {
    opacity: 0,
    y: 24,
  },

  whileInView: {
    opacity: 1,
    y: 0,
  },

  viewport: {
    once: true,
    margin: "-60px",
  },

  transition: {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-60px",
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
