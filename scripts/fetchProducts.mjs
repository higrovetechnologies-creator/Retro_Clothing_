// Shared by the sitemap and prerender scripts.
//
// Production builds use the current public/indexable product rows from
// Supabase. The current schema has no separate publication flag, so every
// product row is publicly readable; the optional flags below also make this
// future-proof if publication/indexability fields are added later.

import { PRODUCTS as FALLBACK_PRODUCTS } from "../src/lib/data.js";

function normalizeProduct(row) {
  return {
    stock_status: "in_stock",
    ...row,
  };
}

function isIndexableProduct(product) {
  if (!product?.slug || !product?.name) return false;
  if (product.is_published === false) return false;
  if (product.seo_indexable === false) return false;
  if (product.noindex === true) return false;
  return true;
}

export async function fetchProducts() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  // Local/offline builds without Supabase credentials can still use the
  // bundled fixture. Configured Supabase builds must not silently publish
  // stale fixture products when the database is unavailable.
  if (!url || !key) {
    console.log("[seo-build] Supabase env vars are not set — using the bundled product fixture.");
    return FALLBACK_PRODUCTS.map(normalizeProduct).filter(isIndexableProduct);
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Supabase product fetch failed: ${error.message}`);
    }

    const products = (Array.isArray(data) ? data : [])
      .map(normalizeProduct)
      .filter(isIndexableProduct);

    console.log(`[seo-build] Loaded ${products.length} published/indexable products from Supabase.`);
    return products;
  } catch (err) {
    // A production sitemap/prerender must never claim deleted or stale products
    // are live. Fail the build instead of silently falling back to old data.
    console.error("[seo-build] Unable to load live Supabase products:", err.message);
    throw err;
  }
}
