import {
  PRODUCTS,
  ANNOUNCEMENTS,
  REVIEWS,
  COMPANY_SETTINGS,
} from './data';

import {
  supabase,
  isSupabaseConfigured,
} from './supabase';

const KEYS = {
  products: 'retro_products',
  announcements: 'retro_announcements',
  settings: 'retro_settings',
  reviews: 'retro_reviews',
  messages: 'retro_messages',
  session: 'retro_admin_session',
};

const now = () => new Date().toISOString();

const makeId = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

const clone = (value) =>
  JSON.parse(JSON.stringify(value));

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) =>
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

const notify = () =>
  window.dispatchEvent(
    new Event('store-updated')
  );

/* =========================================================
   PRODUCT HELPERS
========================================================= */

const normalizeStockStatus = (value) =>
  value === 'out_of_stock'
    ? 'out_of_stock'
    : 'in_stock';

const normalizeProduct = (p) => ({
  ...p,

  id: p.id || makeId(),

  name:
    p.name ||
    'Untitled Product',

  description:
    p.description || '',

  product_code:
    p.product_code || '',

  category:
    p.category || 'shirts',

  images:
    Array.isArray(p.images)
      ? p.images
      : [],

  sizes:
    Array.isArray(p.sizes)
      ? p.sizes
      : [],

  was_price:
    p.was_price === '' ||
    p.was_price == null
      ? null
      : Number(p.was_price),

  now_price:
    p.now_price === '' ||
    p.now_price == null
      ? 0
      : Number(p.now_price),

  stock_status:
    normalizeStockStatus(
      p.stock_status
    ),

  is_new_arrival:
    Boolean(p.is_new_arrival),

  is_offer:
    Boolean(p.is_offer),

  is_featured:
    Boolean(p.is_featured),

  created_at:
    p.created_at ||
    p.createdAt ||
    now(),

  updated_at:
    p.updated_at ||
    p.updatedAt ||
    now(),
});

/* =========================================================
   ANNOUNCEMENT HELPERS
========================================================= */

const normalizeAnnouncement = (a) => ({
  ...a,

  id:
    a.id ||
    makeId(),

  title:
    a.title?.trim() ||
    '',

  image:
    a.image ||
    '',

  timing:
    a.timing?.trim() ||
    '',

  location:
    a.location?.trim() ||
    '',

  created_at:
    a.created_at ||
    a.createdAt ||
    now(),

  updated_at:
    now(),
});

/* =========================================================
   REVIEW HELPERS
========================================================= */

const normalizeReview = (r) => ({
  ...r,

  id:
    r.id ||
    makeId(),

  customer_name:
    r.customer_name?.trim() ||
    'Anonymous',

  review_text:
    r.review_text?.trim() ||
    '',

  rating:
    Math.min(
      5,
      Math.max(
        1,
        Number(r.rating) || 5
      )
    ),

  image_url:
    r.image_url ||
    '',

  is_featured:
    Boolean(r.is_featured),

  created_at:
    r.created_at ||
    r.createdAt ||
    now(),

  updated_at:
    now(),
});

/* =========================================================
   CACHE
========================================================= */

function cache(key, value) {
  writeJson(
    key,
    value
  );

  notify();
}

/* =========================================================
   PRODUCTS
========================================================= */

function getProducts() {
  const stored =
    readJson(
      KEYS.products,
      null
    );

  if (stored === null) {
    const seeded =
      clone(PRODUCTS).map(
        normalizeProduct
      );

    writeJson(
      KEYS.products,
      seeded
    );

    return seeded;
  }

  return Array.isArray(stored)
    ? stored.map(
        normalizeProduct
      )
    : [];
}

/* =========================================================
   SLUG HELPERS
========================================================= */

function makeSlug(
  name,
  fallback = 'product'
) {
  const slug =
    String(name || '')
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /(^-|-$)/g,
        ''
      );

  return (
    slug ||
    `${fallback}-${Date.now()}`
  );
}

/*
 * Generate a unique slug.
 *
 * Example:
 *
 * Classic Shirt
 * classic-shirt
 *
 * Classic Shirt
 * classic-shirt-2
 *
 * Classic Shirt
 * classic-shirt-3
 */

function makeUniqueProductSlug(
  name,
  currentId
) {
  const baseSlug =
    makeSlug(
      name || 'product'
    );

  const existingProducts =
    getProducts();

  const usedSlugs =
    new Set(
      existingProducts
        .filter(
          (product) =>
            product.id !==
            currentId
        )
        .map(
          (product) =>
            product.slug
        )
        .filter(Boolean)
    );

  /*
   * Base slug available
   */
  if (
    !usedSlugs.has(
      baseSlug
    )
  ) {
    return baseSlug;
  }

  /*
   * Base slug already exists
   */
  let counter = 2;

  let slug =
    `${baseSlug}-${counter}`;

  while (
    usedSlugs.has(slug)
  ) {
    counter += 1;

    slug =
      `${baseSlug}-${counter}`;
  }

  return slug;
}

/* =========================================================
   ANNOUNCEMENTS
========================================================= */

function getAnnouncements() {
  const stored =
    readJson(
      KEYS.announcements,
      null
    );

  if (stored === null) {
    const seeded =
      clone(
        ANNOUNCEMENTS
      ).map((a, i) =>
        normalizeAnnouncement({
          ...a,

          created_at:
            a.created_at ||
            new Date(
              Date.now() -
                (
                  ANNOUNCEMENTS.length -
                  i
                ) *
                  1000
            ).toISOString(),
        })
      );

    writeJson(
      KEYS.announcements,
      seeded
    );

    return seeded;
  }

  return Array.isArray(stored)
    ? stored
    : [];
}

/* =========================================================
   SETTINGS
========================================================= */

function getSettings() {
  const stored =
    readJson(
      KEYS.settings,
      null
    );

  if (!stored) {
    const defaults =
      clone(
        COMPANY_SETTINGS
      );

    writeJson(
      KEYS.settings,
      defaults
    );

    return defaults;
  }

  return {
    ...clone(
      COMPANY_SETTINGS
    ),

    ...stored,

    founder: {
      ...COMPANY_SETTINGS.founder,
      ...(stored.founder || {}),
    },

    cofounder: {
      ...COMPANY_SETTINGS.cofounder,
      ...(stored.cofounder || {}),
    },
  };
}

/* =========================================================
   REVIEWS
========================================================= */

function getReviews() {
  const stored =
    readJson(
      KEYS.reviews,
      null
    );

  if (stored === null) {
    const seeded =
      clone(
        REVIEWS
      ).map(
        normalizeReview
      );

    writeJson(
      KEYS.reviews,
      seeded
    );

    return seeded;
  }

  return Array.isArray(stored)
    ? stored.map(
        normalizeReview
      )
    : [];
}

/* =========================================================
   MESSAGES
========================================================= */

function getMessages() {
  const stored =
    readJson(
      KEYS.messages,
      []
    );

  return Array.isArray(stored)
    ? stored
    : [];
}

/* =========================================================
   SESSION
========================================================= */

function getSession() {
  return readJson(
    KEYS.session,
    null
  );
}

/* =========================================================
   IMAGE HELPERS
========================================================= */

const dataUrlToBlob =
  async (value) => {
    if (
      !String(value).startsWith(
        'data:'
      )
    ) {
      return null;
    }

    const response =
      await fetch(value);

    return response.blob();
  };

async function uploadDataUrl(
  value,
  folder,
  id
) {
  /*
   * Already a normal URL
   */
  if (
    !String(value).startsWith(
      'data:'
    ) ||
    !supabase
  ) {
    return value;
  }

  const blob =
    await dataUrlToBlob(
      value
    );

  const path =
    `${folder}/${id}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}.jpg`;

  const {
    error,
  } =
    await supabase.storage
      .from('products')
      .upload(
        path,
        blob,
        {
          contentType:
            'image/jpeg',

          upsert: true,

          cacheControl:
            '31536000',
        }
      );

  if (error) {
    throw error;
  }

  const {
    data,
  } =
    supabase.storage
      .from('products')
      .getPublicUrl(
        path
      );

  return data.publicUrl;
}

/* =========================================================
   SUPABASE HYDRATION
========================================================= */

async function hydrateFromSupabase() {
  if (!supabase) {
    return;
  }

  try {
    const [
      products,
      announcements,
      settings,
      reviews,
      session,
    ] =
      await Promise.all([
        supabase
          .from('products')
          .select('*')
          .order(
            'created_at',
            {
              ascending:
                false,
            }
          ),

        supabase
          .from('announcements')
          .select('*')
          .order(
            'created_at',
            {
              ascending:
                false,
            }
          ),

        supabase
          .from(
            'company_settings'
          )
          .select('data')
          .eq('id', 1)
          .maybeSingle(),

        supabase
          .from('reviews')
          .select('*')
          .order(
            'created_at',
            {
              ascending:
                false,
            }
          ),

        supabase.auth
          .getSession(),
      ]);

    /* =====================================================
       PRODUCTS
    ===================================================== */

    if (
      !products.error &&
      Array.isArray(
        products.data
      ) &&
      products.data.length
    ) {
      cache(
        KEYS.products,
        products.data.map(
          normalizeProduct
        )
      );
    }

    /* =====================================================
       ANNOUNCEMENTS
    ===================================================== */

    if (
      !announcements.error &&
      Array.isArray(
        announcements.data
      ) &&
      announcements
        .data.length
    ) {
      cache(
        KEYS.announcements,
        announcements.data
      );
    }

    /* =====================================================
       SETTINGS
    ===================================================== */

    if (
      !settings.error &&
      settings.data?.data
    ) {
      cache(
        KEYS.settings,
        settings.data.data
      );
    }

    /* =====================================================
       REVIEWS
    ===================================================== */

    if (
      !reviews.error &&
      Array.isArray(
        reviews.data
      ) &&
      reviews.data.length
    ) {
      cache(
        KEYS.reviews,
        reviews.data
      );
    }

    /* =====================================================
       SESSION
    ===================================================== */

    if (
      session.data?.session
    ) {
      cache(
        KEYS.session,
        session.data.session
      );
    }
  } catch (error) {
    console.warn(
      'Supabase hydration failed; using local cache.',
      error
    );
  }
}

/* =========================================================
   SAVE PRODUCT
========================================================= */

async function saveProduct(
  product
) {
  /*
   * Find existing product
   */
  const existing =
    getProducts().find(
      (p) =>
        p.id ===
        product.id
    );

  /*
   * Keep existing ID while
   * editing, otherwise create
   * a new ID.
   */
  const productId =
    product.id ||
    makeId();

  /*
   * Create normalized product
   * with unique slug.
   */
  const item =
    normalizeProduct({
      ...(existing || {}),

      ...product,

      id: productId,

      /*
       * IMPORTANT:
       * Unique slug prevents
       * products_slug_key
       * duplicate errors.
       */
      slug:
        makeUniqueProductSlug(
          product.name ||
            existing?.name,
          productId
        ),

      created_at:
        existing?.created_at ||
        product.created_at ||
        now(),

      updated_at:
        now(),
    });

  /* =======================================================
     SUPABASE SAVE
  ======================================================= */

  if (supabase) {
    try {
      /*
       * Upload all base64 images
       * to Supabase Storage.
       */
      const images =
        await Promise.all(
          (
            item.images ||
            []
          ).map(
            (image) =>
              uploadDataUrl(
                image,
                'products',
                item.id
              )
          )
        );

      item.images =
        images;

      /*
       * Database row
       */
      const row = {
        ...item,

        images:
          item.images,

        sizes:
          item.sizes,
      };

      /*
       * Insert / Update
       */
      const {
        error,
      } =
        await supabase
          .from(
            'products'
          )
          .upsert(
            row,
            {
              onConflict:
                'id',
            }
          );

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(
        'Supabase product save failed:',
        error
      );

      throw error;
    }
  }

  /* =======================================================
     LOCAL CACHE
  ======================================================= */

  const list =
    getProducts();

  const index =
    list.findIndex(
      (p) =>
        p.id ===
        item.id
    );

  if (index >= 0) {
    list[index] =
      item;
  } else {
    list.unshift(
      item
    );
  }

  cache(
    KEYS.products,
    list
  );

  return item;
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

async function deleteProduct(
  id
) {
  if (supabase) {
    const {
      error,
    } =
      await supabase
        .from(
          'products'
        )
        .delete()
        .eq(
          'id',
          id
        );

    if (error) {
      throw error;
    }
  }

  cache(
    KEYS.products,
    getProducts().filter(
      (p) =>
        p.id !== id
    )
  );
}

/* =========================================================
   SAVE ANNOUNCEMENT
========================================================= */

async function saveAnnouncement(
  announcement
) {
  if (
    !announcement?.image
  ) {
    throw new Error(
      'Announcement image is required.'
    );
  }

  const existing =
    getAnnouncements().find(
      (a) =>
        a.id ===
        announcement.id
    );

  const item =
    normalizeAnnouncement({
      ...announcement,

      id:
        announcement.id ||
        makeId(),

      created_at:
        existing?.created_at ||
        announcement.created_at ||
        now(),
    });

  if (supabase) {
    item.image =
      await uploadDataUrl(
        item.image,
        'announcements',
        item.id
      );

    const {
      error,
    } =
      await supabase
        .from(
          'announcements'
        )
        .upsert(
          item,
          {
            onConflict:
              'id',
          }
        );

    if (error) {
      throw error;
    }
  }

  const list =
    getAnnouncements();

  const index =
    list.findIndex(
      (a) =>
        a.id ===
        item.id
    );

  if (index >= 0) {
    list[index] =
      item;
  } else {
    list.unshift(
      item
    );
  }

  cache(
    KEYS.announcements,
    list
  );

  return item;
}

/* =========================================================
   DELETE ANNOUNCEMENT
========================================================= */

async function deleteAnnouncement(
  id
) {
  if (supabase) {
    const {
      error,
    } =
      await supabase
        .from(
          'announcements'
        )
        .delete()
        .eq(
          'id',
          id
        );

    if (error) {
      throw error;
    }
  }

  cache(
    KEYS.announcements,
    getAnnouncements().filter(
      (a) =>
        a.id !== id
    )
  );
}

/* =========================================================
   SAVE REVIEW
========================================================= */

async function saveReview(
  review
) {
  if (
    !review?.review_text
  ) {
    throw new Error(
      'Review text is required.'
    );
  }

  const existing =
    getReviews().find(
      (r) =>
        r.id ===
        review.id
    );

  const item =
    normalizeReview({
      ...(existing || {}),

      ...review,

      id:
        review.id ||
        makeId(),

      created_at:
        existing?.created_at ||
        review.created_at ||
        now(),
    });

  if (supabase) {
    if (
      item.image_url
    ) {
      item.image_url =
        await uploadDataUrl(
          item.image_url,
          'reviews',
          item.id
        );
    }

    const {
      error,
    } =
      await supabase
        .from(
          'reviews'
        )
        .upsert(
          item,
          {
            onConflict:
              'id',
          }
        );

    if (error) {
      throw error;
    }
  }

  const list =
    getReviews();

  const index =
    list.findIndex(
      (r) =>
        r.id ===
        item.id
    );

  if (index >= 0) {
    list[index] =
      item;
  } else {
    list.unshift(
      item
    );
  }

  cache(
    KEYS.reviews,
    list
  );

  return item;
}

/* =========================================================
   DELETE REVIEW
========================================================= */

async function deleteReview(
  id
) {
  if (supabase) {
    const {
      error,
    } =
      await supabase
        .from(
          'reviews'
        )
        .delete()
        .eq(
          'id',
          id
        );

    if (error) {
      throw error;
    }
  }

  cache(
    KEYS.reviews,
    getReviews().filter(
      (r) =>
        r.id !== id
    )
  );
}

/* =========================================================
   SAVE SETTINGS
========================================================= */

async function saveSettings(
  settings
) {
  const current =
    getSettings();

  const merged = {
    ...current,

    ...settings,

    founder: {
      ...current.founder,
      ...(settings.founder ||
        {}),
    },

    cofounder: {
      ...current.cofounder,
      ...(settings.cofounder ||
        {}),
    },
  };

  if (supabase) {
    /* =====================================================
       FOUNDER IMAGE
    ===================================================== */

    if (
      merged.founder?.image
    ) {
      merged.founder.image =
        await uploadDataUrl(
          merged.founder.image,
          'settings',
          'founder'
        );
    }

    /* =====================================================
       COFOUNDER IMAGE
    ===================================================== */

    if (
      merged.cofounder?.image
    ) {
      merged.cofounder.image =
        await uploadDataUrl(
          merged.cofounder.image,
          'settings',
          'cofounder'
        );
    }

    /* =====================================================
       SAVE SETTINGS
    ===================================================== */

    const {
      error,
    } =
      await supabase
        .from(
          'company_settings'
        )
        .upsert(
          {
            id: 1,

            data: merged,

            updated_at:
              now(),
          },
          {
            onConflict:
              'id',
          }
        );

    if (error) {
      throw error;
    }
  }

  cache(
    KEYS.settings,
    merged
  );

  return merged;
}

/* =========================================================
   ADD MESSAGE
========================================================= */

async function addMessage(
  message
) {
  const item = {
    ...message,

    id:
      makeId(),

    status:
      'new',

    created_at:
      now(),
  };

  if (supabase) {
    const {
      error,
    } =
      await supabase
        .from(
          'contact_messages'
        )
        .insert(
          item
        );

    if (error) {
      throw error;
    }
  }

  cache(
    KEYS.messages,
    [
      item,
      ...getMessages(),
    ]
  );

  return item;
}

/* =========================================================
   MARK MESSAGE READ
========================================================= */

async function markMessageRead(
  id
) {
  if (supabase) {
    const {
      error,
    } =
      await supabase
        .from(
          'contact_messages'
        )
        .update({
          status:
            'read',
        })
        .eq(
          'id',
          id
        );

    if (error) {
      throw error;
    }
  }

  cache(
    KEYS.messages,
    getMessages().map(
      (m) =>
        m.id === id
          ? {
              ...m,
              status:
                'read',
            }
          : m
    )
  );
}

/* =========================================================
   HYDRATE MESSAGES
========================================================= */

async function hydrateMessages() {
  if (!supabase) {
    return;
  }

  try {
    const {
      data,
      error,
    } =
      await supabase
        .from(
          'contact_messages'
        )
        .select('*')
        .order(
          'created_at',
          {
            ascending:
              false,
          }
        );

    if (
      !error &&
      Array.isArray(data)
    ) {
      cache(
        KEYS.messages,
        data
      );
    }
  } catch (error) {
    console.warn(
      'Message hydration failed',
      error
    );
  }
}

/* =========================================================
   AUTH - SIGN IN
========================================================= */

async function signIn(
  email,
  password
) {
  if (!supabase) {
    return {
      ok: false,

      error:
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    };
  }

  const {
    data,
    error,
  } =
    await supabase.auth
      .signInWithPassword({
        email,
        password,
      });

  if (error) {
    return {
      ok: false,
      error:
        error.message,
    };
  }

  cache(
    KEYS.session,
    data.session
  );

  return {
    ok: true,

    session:
      data.session,
  };
}

/* =========================================================
   AUTH - SIGN OUT
========================================================= */

async function signOut() {
  if (supabase) {
    await supabase.auth.signOut();
  }

  localStorage.removeItem(
    KEYS.session
  );

  notify();
}

/* =========================================================
   EXPORTS
========================================================= */

export const auth = {
  getSession,
  signIn,
  signOut,
};

export const db = {
  getProducts,
  saveProduct,
  deleteProduct,

  getAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,

  getSettings,
  saveSettings,

  getReviews,
  saveReview,
  deleteReview,

  getMessages,
  addMessage,
  markMessageRead,
};

/* =========================================================
   INITIALIZATION
========================================================= */

if (
  typeof window !==
  'undefined'
) {
  /*
   * Load Supabase data
   */
  hydrateFromSupabase();

  /*
   * Load contact messages
   */
  hydrateMessages();

  /*
   * Listen for authentication
   * changes
   */
  if (supabase) {
    supabase.auth.onAuthStateChange(
      (
        _event,
        session
      ) => {
        if (session) {
          cache(
            KEYS.session,
            session
          );
        } else {
          localStorage.removeItem(
            KEYS.session
          );

          notify();
        }
      }
    );
  }
}

/* =========================================================
   CONFIG EXPORT
========================================================= */

export {
  isSupabaseConfigured,
};