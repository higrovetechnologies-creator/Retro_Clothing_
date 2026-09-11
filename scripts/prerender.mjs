// Runs after `vite build` (see package.json "build" script).
//
// Vite produces a single dist/index.html shell (client-rendered SPA — there
// is no server here, see App.jsx / react-router). Google can execute JS and
// will read the tags <Seo /> sets at runtime, but crawlers that DON'T run
// JS — WhatsApp, Facebook, Twitter/X link-preview bots, etc — only ever see
// the raw HTML of the file at the requested path. This script clones the
// built index.html once per real route and swaps in that route's
// title/description/canonical/OG/Twitter/JSON-LD, writing it to
// dist/<route>/index.html. Vercel serves a matching static file before
// falling back to the SPA rewrite in vercel.json, so:
//   - a crawler hitting /shirts gets the pre-baked, correct head
//   - a browser hitting /shirts gets the same file, then main.jsx hydrates
//     react-router as normal — no behavior change for real users
//
// This does NOT do full React SSR (no react-dom/server render of the app
// tree) — only the <head> metadata is static per route. That's sufficient
// for SEO/social previews and avoids the risk of server-rendering
// browser-only code (Supabase client, IntersectionObserver, video, the
// chatbot, framer-motion, etc) that this SPA relies on.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { STATIC_ROUTES, productRoute } from "../src/lib/seoRoutes.js";
import {
  DEFAULT_OG_IMAGE,
  buildTitle,
  absoluteUrl,
  breadcrumbJsonLd,
  productJsonLd,
  faqJsonLd,
} from "../src/lib/seoConfig.js";
import { fetchProducts } from "./fetchProducts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectHead(template, { title, description, path: routePath, image, noindex = false, ogType = "website", jsonLdBlocks }) {
  const fullTitle = escapeHtml(buildTitle(title));
  const desc = escapeHtml(description || "");
  const url = absoluteUrl(routePath);
  const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;

  let html = template;

  html = html.replace(/<title>.*?<\/title>/s, `<title>${fullTitle}</title>`);
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/>/s,
    `<meta name="description" content="${desc}" />`
  );
  html = html.replace(
    /<link rel="canonical" href=".*?"\s*\/>/s,
    `<link rel="canonical" href="${url}" />`
  );
  html = html.replace(
    /<meta name="robots" content=".*?"\s*\/>/s,
    `<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}" />`
  );
  html = html.replace(
    /<meta property="og:type" content=".*?"\s*\/>/s,
    `<meta property="og:type" content="${ogType}" />`
  );
  html = html.replace(
    /<meta property="og:title" content=".*?"\s*\/>/s,
    `<meta property="og:title" content="${fullTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?"\s*\/>/s,
    `<meta property="og:description" content="${desc}" />`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?"\s*\/>/s,
    `<meta property="og:url" content="${url}" />`
  );
  html = html.replace(
    /<meta property="og:image" content=".*?"\s*\/>/s,
    `<meta property="og:image" content="${ogImage}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content=".*?"\s*\/>/s,
    `<meta name="twitter:title" content="${fullTitle}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?"\s*\/>/s,
    `<meta name="twitter:description" content="${desc}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content=".*?"\s*\/>/s,
    `<meta name="twitter:image" content="${ogImage}" />`
  );

  const jsonLdScripts = jsonLdBlocks
    .filter(Boolean)
    .map((block) => `    <script type="application/ld+json">${JSON.stringify(block)}</script>`)
    .join("\n");

  html = html.replace("</head>", `${jsonLdScripts}\n  </head>`);

  return html;
}

async function writeRoute(template, routePath, headData) {
  const html = injectHead(template, { ...headData, path: routePath });
  const outDir = routePath === "/" ? distDir : path.join(distDir, routePath.replace(/^\//, ""));
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), html, "utf-8");
}

async function main() {
  const templatePath = path.join(distDir, "index.html");
  const template = await readFile(templatePath, "utf-8");

  for (const route of STATIC_ROUTES) {
    await writeRoute(template, route.path, {
      title: route.title,
      description: route.description,
      jsonLdBlocks: [
        breadcrumbJsonLd(route.breadcrumbs),
        route.faqs ? faqJsonLd(route.faqs) : null,
      ],
    });
  }

  const products = await fetchProducts();
  const productRoutes = products.filter((p) => p.slug).map(productRoute);

  for (const route of productRoutes) {
    await writeRoute(template, route.path, {
      title: route.title,
      description: route.description,
      image: route.image,
      ogType: "product",
      jsonLdBlocks: [breadcrumbJsonLd(route.breadcrumbs), productJsonLd(route.product)],
    });
  }

  console.log(
    `[seo-build] Prerendered head metadata for ${STATIC_ROUTES.length} static routes + ${productRoutes.length} product routes.`
  );
}

main().catch((err) => {
  console.error("[seo-build] Failed to prerender routes:", err);
  process.exitCode = 1;
});
