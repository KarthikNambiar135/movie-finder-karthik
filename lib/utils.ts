import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Extract 4-digit year from "YYYY-MM-DD" */
export function formatYear(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  return dateStr.slice(0, 4);
}

/** Format TMDB vote_average to 1 decimal place */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** Format runtime minutes → "2h 15m" */
export function formatRuntime(minutes: number): string {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Format ISO date string to "June 20, 2026" */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
