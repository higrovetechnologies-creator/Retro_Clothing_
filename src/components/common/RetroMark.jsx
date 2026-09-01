// Lightweight placeholder monogram standing in for the brand's real logo
// file. Drop the actual Retro Clothing logo into src/assets and swap the
// <RetroMark /> usages for an <img> tag — see README.md.
export default function RetroMark({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#F2EFE8" />
      <path
        d="M13 29V11h8.2c3.6 0 6.3 2.2 6.3 5.6 0 2.6-1.5 4.4-3.7 5.2l4.4 7.2h-4.1l-3.9-6.6h-3.2V29H13Zm4-9.6h3.9c1.9 0 3.1-1.1 3.1-2.7 0-1.6-1.2-2.7-3.1-2.7H17v5.4Z"
        fill="#08080A"
      />
    </svg>
  );
}
