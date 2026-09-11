
// ---------------------------------------------------------------------------
// SEO configuration & JSON-LD builders.
//
// Shared by:
// - React/Vite browser code
// - Node.js build/prerender scripts
//
// IMPORTANT:
// Keep browser-safe environment access here.
// Do not directly access process.env without checking whether process exists.
// ---------------------------------------------------------------------------

/**
 * Production site URL.
 *
 * Browser/Vite:
 *   import.meta.env.VITE_SITE_URL
 *
 * Node/build scripts:
 *   process.env.VITE_SITE_URL
 *
 * Fallback:
 *   https://retroclothing.in
 */
const viteSiteUrl =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_SITE_URL
    ? import.meta.env.VITE_SITE_URL
    : null;

const nodeSiteUrl =
  typeof process !== "undefined" &&
  process.env &&
  process.env.VITE_SITE_URL
    ? process.env.VITE_SITE_URL
    : null;

export const SITE_URL = (
  viteSiteUrl ||
  nodeSiteUrl ||
  "https://retroclothing.in"
).replace(/\/$/, "");

// ---------------------------------------------------------------------------
// SITE INFORMATION
// ---------------------------------------------------------------------------

export const SITE_NAME = "Retro Clothing";

export const DEFAULT_TITLE =
  "Retro Clothing Tirunelveli | Trendy Fashion & Streetwear";

export const DEFAULT_DESCRIPTION =
  "Shop Retro Clothing in Tirunelveli for shirts, T-shirts, oversized tees, pants, casual wear and streetwear. Order online and across India.";

// Keep this export because Seo.jsx and prerender.mjs use it.
export const DEFAULT_OG_IMAGE =
  `${SITE_URL}/hero-poster.png`;

// Only use a genuine official X/Twitter handle.
// null means no twitter creator/site handle is added.
export const TWITTER_HANDLE = null;

// ---------------------------------------------------------------------------
// BUSINESS INFORMATION
// ---------------------------------------------------------------------------

export const BUSINESS = {
  name: "Retro Clothing",

  legalName: "Retro Clothing",

  streetAddress:
    "33/A Mela Mount Road, Rajiv Gandhi Nagar, Valukodai, Town",

  addressLocality: "Tirunelveli",

  addressRegion: "Tamil Nadu",

  postalCode: "627006",

  addressCountry: "IN",

  telephone: "+918667873216",

  telephoneAlt: "+917358274739",

  email: "hello@retroclothing.in",

  latitude: 8.7297747,

  longitude: 77.6766274,

  openingHours: "Mo-Su 10:00-21:00",

  // Keep only if this is the genuine official profile.
  instagram: "https://instagram.com/retroclothing",
};

// ---------------------------------------------------------------------------
// ABSOLUTE URL HELPER
// ---------------------------------------------------------------------------

export const absoluteUrl = (value = "/") => {
  if (!value) {
    return `${SITE_URL}/`;
  }

  // Already an absolute URL or special browser URL.
  if (
    /^(?:https?:)?\/\//i.test(value) ||
    /^(?:data:|blob:|mailto:|tel:)/i.test(value)
  ) {
    return value;
  }

  return (
    SITE_URL +
    (value.startsWith("/") ? value : `/${value}`)
  );
};

// ---------------------------------------------------------------------------
// TITLE HELPER
// ---------------------------------------------------------------------------

export function buildTitle(pageTitle) {
  return pageTitle || DEFAULT_TITLE;
}

// ---------------------------------------------------------------------------
// ORGANIZATION JSON-LD
// ---------------------------------------------------------------------------

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",

    "@type": "Organization",

    name: SITE_NAME,

    url: `${SITE_URL}/`,

    logo: `${SITE_URL}/Retro-logo.png`,

    ...(BUSINESS.instagram
      ? {
          sameAs: [BUSINESS.instagram],
        }
      : {}),
  };
}

// ---------------------------------------------------------------------------
// WEBSITE JSON-LD
// ---------------------------------------------------------------------------

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",

    "@type": "WebSite",

    name: SITE_NAME,

    url: `${SITE_URL}/`,

    potentialAction: {
      "@type": "SearchAction",

      target:
        `${SITE_URL}/collection?q={search_term_string}`,

      "query-input":
        "required name=search_term_string",
    },
  };
}

// ---------------------------------------------------------------------------
// LOCAL BUSINESS JSON-LD
// ---------------------------------------------------------------------------

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",

    "@type": "ClothingStore",

    "@id": `${SITE_URL}/#clothing-store`,

    name: SITE_NAME,

    image: DEFAULT_OG_IMAGE,

    url: `${SITE_URL}/`,

    telephone: BUSINESS.telephone,

    email: BUSINESS.email,

    priceRange: "₹₹",

    address: {
      "@type": "PostalAddress",

      streetAddress:
        BUSINESS.streetAddress,

      addressLocality:
        BUSINESS.addressLocality,

      addressRegion:
        BUSINESS.addressRegion,

      postalCode:
        BUSINESS.postalCode,

      addressCountry:
        BUSINESS.addressCountry,
    },

    geo: {
      "@type": "GeoCoordinates",

      latitude: BUSINESS.latitude,

      longitude: BUSINESS.longitude,
    },

    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",

      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],

      opens: "10:00",

      closes: "21:00",
    },

    ...(BUSINESS.instagram
      ? {
          sameAs: [BUSINESS.instagram],
        }
      : {}),
  };
}

// ---------------------------------------------------------------------------
// BREADCRUMB JSON-LD
// ---------------------------------------------------------------------------

export function breadcrumbJsonLd(items = []) {
  return {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",

      position: index + 1,

      name: item.name,

      item: absoluteUrl(item.path),
    })),
  };
}

// ---------------------------------------------------------------------------
// PRODUCT IMAGE HELPER
// ---------------------------------------------------------------------------

function getProductImages(product) {
  if (!product) {
    return [];
  }

  const rawImages = Array.isArray(product.images)
    ? product.images
    : [];

  return rawImages
    .filter(Boolean)
    .map((image) => String(image).trim())
    .filter(
      (image) =>
        /^(?:https?:)?\/\//i.test(image) ||
        image.startsWith("/")
    )
    .map(absoluteUrl);
}

// ---------------------------------------------------------------------------
// PRODUCT JSON-LD
// ---------------------------------------------------------------------------

export function productJsonLd(product) {
  if (!product?.name || !product?.slug) {
    return null;
  }

  const url = absoluteUrl(
    `/product/${encodeURIComponent(product.slug)}`
  );

  const images = getProductImages(product);

  const description =
    product.description ||
    `${product.name} from ${SITE_NAME}.`;

  const productCode =
    product.product_code ||
    product.sku ||
    product.id ||
    null;

  const rawPrice =
    product.now_price ??
    product.price ??
    null;

  const price = Number(rawPrice);

  const stockStatus =
    String(product.stock_status || "")
      .trim()
      .toLowerCase();

  const availability =
    stockStatus === "out_of_stock" ||
    stockStatus === "out-of-stock" ||
    stockStatus === "unavailable"
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";

  const schema = {
    "@context": "https://schema.org",

    "@type": "Product",

    name: product.name,

    description,

    brand: {
      "@type": "Brand",

      name: SITE_NAME,
    },

    url,
  };

  if (productCode) {
    schema.sku = String(productCode);
  }

  if (images.length > 0) {
    schema.image = images;
  }

  // Only provide an Offer when the actual product price exists.
  // This avoids inventing prices.
  if (
    rawPrice !== null &&
    rawPrice !== undefined &&
    Number.isFinite(price)
  ) {
    schema.offers = {
      "@type": "Offer",

      url,

      priceCurrency: "INR",

      price: price.toString(),

      availability,

      itemCondition:
        "https://schema.org/NewCondition",
    };
  }

  return schema;
}

// ---------------------------------------------------------------------------
// FAQ JSON-LD
// ---------------------------------------------------------------------------

export function faqJsonLd(pairs = []) {
  return {
    "@context": "https://schema.org",

    "@type": "FAQPage",

    mainEntity: pairs.map((pair) => ({
      "@type": "Question",

      name: pair.question,

      acceptedAnswer: {
        "@type": "Answer",

        text: pair.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// STATIC SEO CONFIGURATION
//
// Product pages are intentionally NOT stored here.
// Product SEO must remain dynamic from the current product data.
// ---------------------------------------------------------------------------

export const SEO_ROUTES = {
  "/": {
    title:
      "Retro Clothing Tirunelveli | Trendy Fashion & Streetwear",

    description:
      "Discover Retro Clothing in Tirunelveli for trendy shirts, T-shirts, oversized tees, pants, casual wear and modern streetwear.",

    type: "website",
  },

  "/collection": {
    title:
      "Clothing Collection Tirunelveli | Retro Clothing",

    description:
      "Explore the Retro Clothing collection featuring trendy shirts, T-shirts, oversized tees, pants, casual wear and streetwear in Tirunelveli.",

    type: "website",
  },

  "/new-arrivals": {
    title:
      "New Arrivals | Trendy Clothing Tirunelveli | Retro Clothing",

    description:
      "Explore the latest clothing arrivals from Retro Clothing in Tirunelveli, including trendy shirts, T-shirts, oversized tees and pants.",

    type: "website",
  },

  "/offers": {
    title:
      "Clothing Offers & Deals Tirunelveli | Retro Clothing",

    description:
      "Discover current clothing offers and fashion deals from Retro Clothing in Tirunelveli. Shop selected shirts, tees, pants and more.",

    type: "website",
  },

  "/shirts": {
    title:
      "Shirts Shop Tirunelveli | Trendy & Casual Shirts",

    description:
      "Shop men's shirts, casual shirts, trendy shirts and fashion shirts at Retro Clothing in Tirunelveli, Tamil Nadu.",

    type: "website",
  },

  "/tees": {
    title:
      "T-Shirts & Oversized Tees Tirunelveli | Retro Clothing",

    description:
      "Shop T-shirts, oversized tees, graphic T-shirts and casual men's tees at Retro Clothing in Tirunelveli.",

    type: "website",
  },

  "/pants": {
    title:
      "Pants & Trousers Tirunelveli | Retro Clothing",

    description:
      "Explore men's pants, trousers, cargo pants, wide pants and casual fashion pants at Retro Clothing in Tirunelveli.",

    type: "website",
  },

  "/our-story": {
    title:
      "Our Story | Retro Clothing Tirunelveli",

    description:
      "Learn about Retro Clothing, a fashion and clothing store in Tirunelveli focused on modern style, quality and accessible fashion.",

    type: "website",
  },

  "/contact": {
    title:
      "Contact Retro Clothing | Tirunelveli Clothing Store",

    description:
      "Contact Retro Clothing in Tirunelveli for clothing, fashion, store and product enquiries. Find our address, phone number and contact details.",

    type: "website",
  },

  "/tirunelveli": {
    title:
      "Retro Clothing Tirunelveli | Clothing & Fashion Store",

    description:
      "Visit Retro Clothing in Tirunelveli for men's and women's clothing, trendy shirts, T-shirts, oversized tees, pants, casual wear and streetwear.",

    type: "website",
  },
};
