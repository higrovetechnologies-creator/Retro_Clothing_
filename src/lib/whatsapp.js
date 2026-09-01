export function buildOrderMessage(product, size, whatsapp) {
  const productUrl = `${window.location.origin}/product/${product.slug}`;
  const lines = [
    "Hello Retro Clothing 👋",
    "",
    "I would like to order this product.",
    "",
    `Product: ${product.name}`,
    `Product Code: ${product.product_code}`,
    `Selected Size: ${size || "Not selected"}`,
    `Price: ₹${product.now_price}`,
    "",
    "Product Link:",
    productUrl,
    "",
    "Please confirm the availability.",
  ];
  return lines.join("\n");
}

export function whatsappOrderUrl(product, size, whatsapp) {
  const text = encodeURIComponent(buildOrderMessage(product, size, whatsapp));
  return `https://wa.me/${whatsapp}?text=${text}`;
}

export function whatsappGeneralUrl(whatsapp, message) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
