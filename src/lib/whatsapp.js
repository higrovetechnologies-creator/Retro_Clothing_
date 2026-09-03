export function buildOrderMessage(product, size) {
const productUrl = `${window.location.origin}/product/${product.slug}`;

const waveEmoji = String.fromCodePoint(0x1F44B);
const smileEmoji = String.fromCodePoint(0x1F60A);

const lines = [
`Hello Retro Clothing ${waveEmoji}`,
"",
"I would like to order this product.",
"",
`Product: ${product.name}`,
`Product Code: ${product.product_code || "N/A"}`,
`Selected Size: ${size || "Not selected"}`,
`Price: ₹${product.now_price}`,
"",
"Product Link:",
productUrl,
"",
`Please confirm the availability. ${smileEmoji}`,
];

return lines.join("\n");
}

export function whatsappOrderUrl(product, size, whatsapp) {
const cleanWhatsapp = String(whatsapp).replace(/\D/g, "");

const message = buildOrderMessage(product, size);
const encodedMessage = encodeURIComponent(message);

return `https://wa.me/${cleanWhatsapp}?text=${encodedMessage}`;
}

export function whatsappGeneralUrl(whatsapp, message) {
const cleanWhatsapp = String(whatsapp).replace(/\D/g, "");

return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    message
  )}`;
}
