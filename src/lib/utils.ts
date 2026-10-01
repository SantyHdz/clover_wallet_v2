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

/**
 * Returns dynamic Tailwind CSS font-size classes based on the length of the formatted monetary string.
 * This guarantees that large balances (e.g. +$1,060,000.00 or $100,000,000.00) scale down dynamically
 * without clipping or overflowing their container cards.
 */
export function getAmountFontSize(text: string, base: '3xl' | '2xl' | 'xl' = '3xl'): string {
  const len = text.length;
  if (base === '3xl') {
    if (len >= 16) return 'text-base sm:text-lg xl:text-xl tracking-tight';
    if (len >= 13) return 'text-lg sm:text-xl xl:text-2xl tracking-tight';
    if (len >= 10) return 'text-xl sm:text-2xl xl:text-3xl tracking-tight';
    return 'text-2xl sm:text-3xl tracking-tight';
  }
  if (base === '2xl') {
    if (len >= 16) return 'text-sm sm:text-base xl:text-lg tracking-tight';
    if (len >= 13) return 'text-base sm:text-lg xl:text-xl tracking-tight';
    if (len >= 10) return 'text-lg sm:text-xl xl:text-2xl tracking-tight';
    return 'text-xl sm:text-2xl tracking-tight';
  }
  // base === 'xl'
  if (len >= 14) return 'text-xs sm:text-sm xl:text-base tracking-tight';
  if (len >= 10) return 'text-sm sm:text-base xl:text-lg tracking-tight';
  return 'text-base sm:text-xl tracking-tight';
}
