export function buildOrderMessage(product, size) {
  const productUrl = `${window.location.origin}/product/${product.slug}`;

  const lines = [
    "Hello Retro Clothing \u{1F44B}",
    "",
    "I would like to order this product.",
    "",
    `Product: ${product.name}`,
    `Product Code: ${product.product_code || "N/A"}`,
    `Selected Size: ${size || "Not selected"}`,
    `Price: \u20B9${product.now_price}`,
    "",
    "Product Link:",
    productUrl,
    "",
    "Please confirm the availability. \u{1F60A}",
  ];

  return lines.join("\n");
}

export function whatsappOrderUrl(product, size, whatsapp) {
  const cleanWhatsapp = String(whatsapp).replace(/\D/g, "");

  return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    buildOrderMessage(product, size)
  )}`;
}

export function whatsappGeneralUrl(whatsapp, message) {
  const cleanWhatsapp = String(whatsapp).replace(/\D/g, "");

  return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    message
  )}`;
}