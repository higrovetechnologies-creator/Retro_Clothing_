// ---------------------------------------------------------------------------
// Per-route SEO metadata.
//
// Plain JS so this same route source can be imported by React and the Node
// build scripts. Product routes are generated from live product data at build
// time; they are intentionally NOT stored as a permanent static list here.
// ---------------------------------------------------------------------------

import { CATEGORIES } from "./data.js";

export const CATEGORY_LABELS = CATEGORIES.reduce((acc, c) => {
  acc[c.slug] = c.label;
  return acc;
}, {});

export const STATIC_ROUTES = [
  {
    path: "/",
    title: "Retro Clothing Tirunelveli | Trendy Fashion & Streetwear",
    description:
      "Shop Retro Clothing in Tirunelveli for shirts, T-shirts, oversized tees, pants, casual wear and streetwear. Order online and across India.",
    changefreq: "daily",
    priority: 1.0,
    breadcrumbs: [{ name: "Home", path: "/" }],
  },
  {
    path: "/collection",
    title: "Clothing Collection Tirunelveli | Retro Clothing",
    description:
      "Browse the Retro Clothing collection of shirts, T-shirts, oversized tees and pants from our Tirunelveli fashion store, with shipping across India.",
    changefreq: "daily",
    priority: 0.8,
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "All Collection", path: "/collection" }],
  },
  {
    path: "/new-arrivals",
    title: "New Arrivals | Retro Clothing Tirunelveli",
    description:
      "Explore new-arrival shirts, T-shirts and pants from Retro Clothing, a Tirunelveli fashion brand shipping across India.",
    changefreq: "daily",
    priority: 0.7,
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "New Arrivals", path: "/new-arrivals" }],
  },
  {
    path: "/offers",
    title: "Clothing Offers | Retro Clothing Tirunelveli",
    description:
      "Shop current offers on Retro Clothing shirts, T-shirts and pants from our Tirunelveli clothing store, while available stock lasts.",
    changefreq: "daily",
    priority: 0.7,
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Offer Products", path: "/offers" }],
  },
  {
    path: "/shirts",
    title: "Shirts Shop Tirunelveli | Trendy & Casual Shirts",
    description:
      "Shop shirts in Tirunelveli, including camp collars, overshirts and flannels from Retro Clothing for everyday, casual and evening wear.",
    changefreq: "weekly",
    priority: 0.8,
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Shirts", path: "/shirts" }],
  },
  {
    path: "/tees",
    title: "T-Shirts & Oversized Tees Tirunelveli | Retro Clothing",
    description:
      "Shop T-shirts and oversized tees in Tirunelveli, including graphic, boxy and heavyweight styles from Retro Clothing.",
    changefreq: "weekly",
    priority: 0.8,
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Tees", path: "/tees" }],
  },
  {
    path: "/pants",
    title: "Pants & Trousers Tirunelveli | Retro Clothing",
    description:
      "Shop pants and trousers in Tirunelveli, including cargo, pleated, straight and tapered styles from Retro Clothing.",
    changefreq: "weekly",
    priority: 0.8,
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Pants", path: "/pants" }],
  },
  {
    path: "/our-story",
    title: "Our Story | Retro Clothing Tirunelveli",
    description:
      "Learn the Retro Clothing story, from a pop-up cart on Mela Mount Road in Tirunelveli to a local fashion label shipping across India.",
    changefreq: "monthly",
    priority: 0.5,
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Our Story", path: "/our-story" }],
  },
  {
    path: "/contact",
    title: "Contact Retro Clothing | Tirunelveli",
    description:
      "Contact Retro Clothing in Tirunelveli for store details, orders and enquiries by phone, WhatsApp or email.",
    changefreq: "monthly",
    priority: 0.5,
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }],
  },
  {
    path: "/tirunelveli",
    title: "Retro Clothing Tirunelveli | Clothing & Fashion Store",
    description:
      "Visit Retro Clothing in Tirunelveli for shirts, T-shirts, oversized tees and pants. Find our Mela Mount Road store and shop online across India.",
    changefreq: "monthly",
    priority: 0.9,
    breadcrumbs: [{ name: "Home", path: "/" }, { name: "Tirunelveli", path: "/tirunelveli" }],
    faqs: [
      {
        question: "Where can I find Retro Clothing in Tirunelveli?",
        answer:
          "Retro Clothing is based on Mela Mount Road, Rajiv Gandhi Nagar, Valukodai, Tirunelveli, Tamil Nadu – 627006.",
      },
      {
        question: "What type of clothing does Retro Clothing offer?",
        answer:
          "Retro Clothing sells shirts, tees and pants, designed and hand-checked at the Tirunelveli workshop.",
      },
      {
        question: "Can I shop for Retro Clothing online?",
        answer:
          "Yes. Browse the collection online and order directly through the website's available ordering flow, with Cash on Delivery where offered.",
      },
      {
        question: "Does Retro Clothing ship outside Tirunelveli?",
        answer:
          "Yes. Retro Clothing ships across India, with orders dispatched from Tirunelveli within 24 hours according to the site's delivery information.",
      },
    ],
  },
];

export function productRoute(product) {
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category || "Collection";
  const categoryPath = CATEGORY_LABELS[product.category] ? `/${product.category}` : "/collection";
  const description = [
    `Shop ${product.name} from Retro Clothing in Tirunelveli.`,
    product.description || `${categoryLabel} from the Retro Clothing collection.`,
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    path: `/product/${product.slug}`,
    title: `${product.name} | Retro Clothing Tirunelveli`,
    description: description.length > 160 ? `${description.slice(0, 157).trimEnd()}...` : description,
    image: product.images?.[0],
    changefreq: "weekly",
    priority: 0.6,
    lastmod: product.updated_at || product.created_at,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: categoryLabel, path: categoryPath },
      { name: product.name, path: `/product/${product.slug}` },
    ],
    product,
  };
}
