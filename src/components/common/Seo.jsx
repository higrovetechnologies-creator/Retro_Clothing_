import { useEffect } from "react";
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  buildTitle,
  absoluteUrl,
  organizationJsonLd,
  websiteJsonLd,
  localBusinessJsonLd,
} from "../../lib/seoConfig";

const SEO_TAG_ATTR = "data-seo-managed";

function setMetaTag(attrName, attrValue, content) {
  if (content === undefined || content === null) return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    if (attrName === "property") el.setAttribute("property", attrValue);
    else el.setAttribute("name", attrValue);
    el.setAttribute(SEO_TAG_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkTag(rel, href) {
  if (!href) return;
  const links = document.head.querySelectorAll(`link[rel="${rel}"]`);
  const el = links[0] || document.createElement("link");

  if (!el.parentNode) {
    el.setAttribute("rel", rel);
    el.setAttribute(SEO_TAG_ATTR, "true");
    document.head.appendChild(el);
  }

  // Remove accidental duplicate canonicals left by older builds.
  links.forEach((link, index) => {
    if (index > 0) link.remove();
  });

  el.setAttribute("href", href);
}

function setJsonLd(id, data) {
  if (!data) return;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id) {
  document.getElementById(id)?.remove();
}

/**
 * Route metadata shared by the browser and the build-time prerenderer.
 * The visual React tree is intentionally untouched.
 */
export default function Seo({
  title,
  description,
  path = "/",
  image,
  noindex = false,
  jsonLd,
  type = "website",
}) {
  useEffect(() => {
    const fullTitle = buildTitle(title);
    const desc = description || undefined;
    const url = absoluteUrl(path);
    const ogImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;

    document.title = fullTitle;

    setMetaTag("name", "description", desc);
    setMetaTag("name", "robots", noindex ? "noindex, follow" : "index, follow");
    setLinkTag("canonical", url);

    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", desc);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:image", ogImage);

    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", desc);
    setMetaTag("name", "twitter:image", ogImage);

    setJsonLd("ld-organization", organizationJsonLd());
    setJsonLd("ld-website", websiteJsonLd());
    setJsonLd("ld-localbusiness", localBusinessJsonLd());

    removeJsonLd("ld-page");
    if (jsonLd) {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "ld-page";
      el.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(el);
    }
  }, [title, description, path, image, noindex, type, JSON.stringify(jsonLd)]);

  return null;
}
