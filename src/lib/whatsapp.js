export function buildOrderMessage(product, size) {
const productUrl = `${window.location.origin}/product/${product.slug}`;

const lines = [
"Hello Retro Clothing \uD83D\uDC4B",
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
"Please confirm the availability. \uD83D\uDE0A",
];

return lines.join("\n");
}

export function whatsappOrderUrl(
product,
size,
whatsapp
) {
const cleanWhatsapp = String(
whatsapp || ""
).replace(/\D/g, "");

const message = buildOrderMessage(
product,
size
);

const encodedMessage =
encodeURIComponent(message);

return (
`https://wa.me/${cleanWhatsapp}` +
`?text=${encodedMessage}`
);
}

export function whatsappGeneralUrl(
whatsapp,
message
) {
const cleanWhatsapp = String(
whatsapp || ""
).replace(/\D/g, "");

const encodedMessage =
encodeURIComponent(message);

return (
`https://wa.me/${cleanWhatsapp}` +
`?text=${encodedMessage}`
);
}
