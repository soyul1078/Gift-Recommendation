import type { Budget } from "./types";

export const BANDS_ORDERED: readonly Budget[] = [
  "1~3만 원대",
  "3~5만 원대",
  "5~10만 원대",
  "10~20만 원대",
  "20~30만 원대",
  "30~50만 원대",
  "50만 원 이상",
];

/** Half-open KRW interval [min, max) for a budget band label (max = Infinity = no upper bound). */
export function budgetBandBounds(band: Budget): { min: number; max: number } {
  switch (band) {
    case "1~3만 원대":
      return { min: 10_000, max: 30_000 };
    case "3~5만 원대":
      return { min: 30_000, max: 50_000 };
    case "5~10만 원대":
      return { min: 50_000, max: 100_000 };
    case "10~20만 원대":
      return { min: 100_000, max: 200_000 };
    case "20~30만 원대":
      return { min: 200_000, max: 300_000 };
    case "30~50만 원대":
      return { min: 300_000, max: 500_000 };
    case "50만 원 이상":
      return { min: 500_000, max: Infinity };
    default: {
      const _e: never = band;
      return _e;
    }
  }
}

/** Single source of truth for "does this price fit this band" — badge and reason text both defer to this. */
export function priceFitsBudgetBand(krw: number, band: Budget): boolean {
  const { min, max } = budgetBandBounds(band);
  return krw >= min && krw < max;
}

/** Single band that contains `krw` (first match in ascending order). */
export function primaryBudgetBandsForPrice(krw: number): Budget[] {
  for (const b of BANDS_ORDERED) {
    if (priceFitsBudgetBand(krw, b)) return [b];
  }
  return [];
}

/** How many band-steps `krw` is away from `targetBand` (0 = same band). */
export function bandDistance(krw: number, targetBand: Budget): number {
  const priceBand = primaryBudgetBandsForPrice(krw)[0];
  if (!priceBand) return Number.POSITIVE_INFINITY;
  return Math.abs(BANDS_ORDERED.indexOf(priceBand) - BANDS_ORDERED.indexOf(targetBand));
}

export function catalogHasGiftInBudgetBand(
  list: readonly { priceKRW: number }[],
  band: Budget,
): boolean {
  return list.some((g) => priceFitsBudgetBand(g.priceKRW, band));
}
