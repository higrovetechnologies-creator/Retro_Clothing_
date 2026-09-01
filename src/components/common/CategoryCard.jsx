import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const CATEGORY_IMAGES = {
  shirts: "/images/categories/shirts.png",
  tees: "/images/categories/tees.png",
  pants: "/images/categories/pants.png",
};

export default function CategoryCard({ category }) {
  const image =
    CATEGORY_IMAGES[category.slug] ||
    "/images/categories/placeholder.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to={`/${category.slug}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-[22px] border border-line"
      >
        {/* CATEGORY IMAGE */}
        <img
          src={image}
          alt={`${category.label} collection at Retro Clothing Tirunelveli`}
          loading="lazy"
          decoding="async"
          width="512"
          height="1024"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30 transition-opacity duration-500 group-hover:from-black/75" />

        {/* CATEGORY CONTENT */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <span className="font-display text-2xl text-bone">
            {category.label}
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full glass text-bone transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}