import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats any numerical amount with thousands separator (comma) and decimals (dot).
 * Example: 160000 -> "160,000.00"
 */
export function formatAmount(
  amount: number | string | null | undefined,
  decimals: number = 2
): string {
  const num = Number(amount || 0);
  if (isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Formats an amount with the corresponding currency symbol and thousands separator.
 * Example: formatMoney(160000, "USD") -> "$160,000.00"
 * Example: formatMoney(160000, "COP") -> "COL$160,000.00"
 */
export function formatMoney(
  amount: number | string | null | undefined,
  currency?: string | null,
  decimals: number = 2
): string {
  const symbol = currency === "COP" ? "COL$" : currency === "EUR" ? "€" : "$";
  return `${symbol}${formatAmount(amount, decimals)}`;
}
