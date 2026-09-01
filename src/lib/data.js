// ---------------------------------------------------------------------------
// Mock data layer.
//
// Shaped to match the Supabase schema described in the project brief
// (products / product_images / product_sizes / announcements /
// company_settings / reviews / contact_messages) so that swapping this
// module for real @supabase/supabase-js calls later is a drop-in change.
// See README.md -> "Connecting Supabase" for the migration path.
// ---------------------------------------------------------------------------

const img = (seed, w = 900, h = 1100) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const COMPANY_SETTINGS = {
  name: "Retro Clothing",
  tagline: "Luxury Made Affordable",
  since: "2026",

  address:
    "33/A Mela Mount Road, Rajiv Gandhi Nagar, Valukodai, Town, Tirunelveli, Tamil Nadu – 627006",

  district: "Tirunelveli, Tamil Nadu",

  pincode: "627006",

  phone1: "8667873216",

  phone2: "7358274739",

  whatsapp: "918667873216",

  email: "hello@retroclothing.in",

  instagram:
    "https://instagram.com/retroclothing",

  mapsUrl:
    "https://www.google.com/maps/place/8%C2%B043'47.2%22N+77%C2%B040'45.1%22E/@8.7297747,77.6766274,17z",

  founder: {
    name: "Balaji",
    image: img("founder", 600, 700),
  },

  cofounder: {
    name: "Surya Perumal",
    image: img("cofounder", 600, 700),
  },

  storyShort:
    "Born on the streets of Tirunelveli, Retro Clothing started as a pop-up cart with one idea — timeless silhouettes shouldn't cost a fortune. Every piece we cut carries that promise forward.",

  storyLong:
    "Retro Clothing began in 2026 as Tirunelveli's first aesthetic clothing cart — a single folding table, a rail of shirts, and a stubborn belief that small-town India deserved fashion with real intention behind it. What started as a weekend pop-up on Mela Mount Road grew into a full wardrobe label built on the same principle: cut fabric like it matters, price it like it's for everyone. Today Retro Clothing ships across India, but the process hasn't changed — every piece is still designed, checked and packed by hand from our Tirunelveli workshop, for people who want luxury without the luxury markup.",

  shopTiming:
    "Open Daily · 10:00 AM – 9:00 PM",

  deliveryInfo:
    "Dispatched from Tirunelveli within 24 hours. Delivery in 1–6 working days depending on your pincode.",
};


// ---------------------------------------------------------------------------
// CATEGORIES
//
// Each category now uses its own separate image.
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  {
    slug: "shirts",
    label: "Shirts",
    image: "/images/categories/shirts.png",
  },

  {
    slug: "tees",
    label: "Tees",
    image: "/images/categories/tees.png",
  },

  {
    slug: "pants",
    label: "Pants",
    image: "/images/categories/pants.png",
  },
];


// ---------------------------------------------------------------------------
// CATEGORY SIZES
// ---------------------------------------------------------------------------

export const CATEGORY_SIZES = {
  shirts: ["M", "L", "XL"],

  tees: ["M", "L", "XL"],

  pants: [
    "28",
    "30",
    "32",
    "34",
    "36",
  ],
};


// ---------------------------------------------------------------------------
// Kept for backwards compatibility with any existing imports.
// ---------------------------------------------------------------------------

export const SIZES = [
  "M",
  "L",
  "XL",
];


// ---------------------------------------------------------------------------
// PRODUCT NAMES
// ---------------------------------------------------------------------------

const names = {
  shirts: [
    "Charcoal Vintage Overshirt",
    "Ink Black Camp Collar Shirt",
    "Bone White Linen Shirt",
    "Smoke Grey Corduroy Shirt",
    "Midnight Flannel Shirt",
  ],

  tees: [
    "Retro Silver Graphic Tee",
    "Matte Black Boxy Tee",
    "Off-White Heavyweight Tee",
    "Charcoal Ribbed Tee",
    "Vintage Wash Oversized Tee",
  ],

  pants: [
    "Deep Black Cargo Trousers",
    "Charcoal Pleated Trousers",
    "Stone Grey Straight Pants",
    "Ink Denim Wide Pants",
    "Onyx Tapered Chinos",
  ],
};


// ---------------------------------------------------------------------------
// PRODUCT CREATOR
// ---------------------------------------------------------------------------

let idCounter = 1;

const makeProduct = (
  category,
  name,
  i,
  flags
) => {
  const id = String(idCounter++);

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const now =
    899 +
    i * 150 +
    (category === "pants" ? 400 : 0);

  const was = flags.isOffer
    ? now + 400 + i * 60
    : null;

  return {
    id,

    name,

    slug,

    product_code:
      `RC-${category
        .slice(0, 2)
        .toUpperCase()}${String(id).padStart(3, "0")}`,

    category,

    description:
      "Cut from premium heavyweight fabric and finished with hand-checked stitching. Designed in Tirunelveli to move between everyday wear and elevated occasions without missing a beat.",

    was_price: was,

    now_price: now,

    fabric: [
      "100% Cotton",
      "Cotton Blend",
      "Linen Cotton",
      "Heavy Fleece",
    ][i % 4],

    colour: [
      "Black",
      "Charcoal",
      "Off-White",
      "Stone Grey",
    ][i % 4],

    occasion: [
      "Everyday",
      "Streetwear",
      "Evening",
      "Casual",
    ][i % 4],

    care_instruction:
      "Machine wash cold with like colours. Do not bleach. Tumble dry low. Iron on reverse.",

    images: [
      img(`${slug}-1`),
      img(`${slug}-2`),
      img(`${slug}-3`),
    ],

    sizes:
      CATEGORY_SIZES[category].filter(
        (_, si) =>
          (Number(id) + si) % 5 !== 0
      ),

    is_new_arrival:
      !!flags.isNew,

    is_offer:
      !!flags.isOffer,

    is_featured:
      !!flags.isFeatured,

    created_at:
      new Date(
        Date.now() -
          i * 86400000
      ).toISOString(),
  };
};


// ---------------------------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------------------------

export const PRODUCTS = [
  ...names.shirts.map(
    (n, i) =>
      makeProduct(
        "shirts",
        n,
        i,
        {
          isNew: i < 2,
          isOffer:
            i === 1 ||
            i === 3,
          isFeatured: i < 3,
        }
      )
  ),

  ...names.tees.map(
    (n, i) =>
      makeProduct(
        "tees",
        n,
        i,
        {
          isNew: i < 3,
          isOffer:
            i === 0 ||
            i === 2,
          isFeatured:
            i === 1 ||
            i === 4,
        }
      )
  ),

  ...names.pants.map(
    (n, i) =>
      makeProduct(
        "pants",
        n,
        i,
        {
          isNew: i === 2,
          isOffer: i === 4,
          isFeatured: i < 2,
        }
      )
  ),
];


// ---------------------------------------------------------------------------
// ANNOUNCEMENTS
// ---------------------------------------------------------------------------

export const ANNOUNCEMENTS = [
  {
    id: "1",

    title:
      "Retro Clothing Pop-Up — Nellai Edition",

    image:
      img(
        "announcement-1",
        1200,
        700
      ),

    timing:
      "6 – 8 September, 5 PM – 9 PM",

    location:
      "Rajiv Gandhi Nagar, Tirunelveli",
  },
];


// ---------------------------------------------------------------------------
// REVIEWS
// ---------------------------------------------------------------------------

export const REVIEWS = [
  {
    id: "1",

    customer_name:
      "Aravind K.",

    review_text:
      "The fit is unreal for the price. Ordered a shirt on WhatsApp and it reached Chennai in three days.",

    rating: 5,

    image_url:
      img(
        "review-1",
        300,
        300
      ),

    is_featured: true,
  },

  {
    id: "2",

    customer_name:
      "Divya S.",

    review_text:
      "Fabric quality genuinely feels premium. The tees don't lose shape even after multiple washes.",

    rating: 5,

    image_url:
      img(
        "review-2",
        300,
        300
      ),

    is_featured: true,
  },

  {
    id: "3",

    customer_name:
      "Mohammed R.",

    review_text:
      "COD made it so easy to trust a small local brand. Will be ordering again.",

    rating: 4,

    image_url:
      img(
        "review-3",
        300,
        300
      ),

    is_featured: true,
  },

  {
    id: "4",

    customer_name:
      "Priya V.",

    review_text:
      "Retro Clothing is proof Tirunelveli has serious fashion taste. Loved the pants.",

    rating: 5,

    image_url:
      img(
        "review-4",
        300,
        300
      ),

    is_featured: true,
  },
];