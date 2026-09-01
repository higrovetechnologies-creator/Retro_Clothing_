// Runs after vite build. Generates dist/sitemap.xml from the real public
// static routes plus the current indexable product rows from Supabase.

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_ROUTES, productRoute } from "../src/lib/seoRoutes.js";
import { SITE_URL } from "../src/lib/seoConfig.js";
import { fetchProducts } from "./fetchProducts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry({ path: routePath, changefreq, priority, lastmod }) {
  const loc = `${SITE_URL}${routePath === "/" ? "/" : routePath}`;
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : null,
    changefreq ? `    <changefreq>${escapeXml(changefreq)}</changefreq>` : null,
    priority !== undefined ? `    <priority>${priority}</priority>` : null,
    "  </url>",
  ].filter(Boolean).join("\n");
}

async function main() {
  const products = await fetchProducts();
  const productRoutes = products.map(productRoute);
  const entries = [...STATIC_ROUTES, ...productRoutes].map(urlEntry).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

  await mkdir(distDir, { recursive: true });
  await writeFile(path.join(distDir, "sitemap.xml"), xml, "utf-8");
  console.log(`[seo-build] Wrote sitemap.xml with ${STATIC_ROUTES.length + productRoutes.length} URLs.`);
}

main().catch((err) => {
  console.error("[seo-build] Failed to generate sitemap:", err);
  process.exitCode = 1;
});
