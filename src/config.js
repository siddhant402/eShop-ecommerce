export const API_URL = import.meta.env.VITE_API_URL ?? "/api";

const CURRENCY = "INR";
const LOCALE = "en-IN";

export const formatPrice = (n) =>
  new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(n ?? 0);
