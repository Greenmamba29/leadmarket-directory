/**
 * Pricing utility functions for lead calculations
 */

/**
 * Clamps a number between min and max values
 */
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/**
 * Computes the price for a lead based on base price, score, and exclusivity
 * Formula: BasePrice × (Score/80) × Exclusivity Multiplier (clamped 15–150)
 */
export function computePrice(basePrice, score, exclusivity) {
  const mult = exclusivity === "Exclusive" ? 2.5 : 1;
  const raw = (Number(basePrice || 25) * (Number(score || 60) / 80)) * mult;
  return Math.round(clamp(raw, 15, 150));
}

/**
 * Returns the appropriate color for a score badge
 */
export function scoreColor(score) {
  if (score >= 85) return "#10b981"; // green
  if (score >= 70) return "#f59e0b"; // amber
  return "#ef4444"; // red
}