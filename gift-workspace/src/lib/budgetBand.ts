import type { Budget } from "./types";

export const BANDS_ORDERED: readonly Budget[] = [
  "1~3만 원대",
  "3~5만 원대",
  "5~10만 원대",
  "10~15만 원대",
  "15~20만 원대",
  "20~30만 원대",
  "30~50만 원대",
  "50만 원 이상",
  "70~100만 원대",
];

/** Half-open KRW intervals aligned with UI labels (만 원 단위). */
export function priceFitsBudgetBand(krw: number, band: Budget): boolean {
  switch (band) {
    case "1~3만 원대":
      return krw >= 10_000 && krw < 30_000;
    case "3~5만 원대":
      return krw >= 30_000 && krw < 50_000;
    case "5~10만 원대":
      return krw >= 50_000 && krw < 100_000;
    case "10~15만 원대":
      return krw >= 100_000 && krw < 150_000;
    case "15~20만 원대":
      return krw >= 150_000 && krw < 200_000;
    case "20~30만 원대":
      return krw >= 200_000 && krw < 300_000;
    case "30~50만 원대":
      return krw >= 300_000 && krw < 500_000;
    case "50만 원 이상":
      // For users who select "50만 원 이상", recommendations should be capped
      // to items up to 700,000원 (50만 이상 ~ 70만 미만).
      return krw >= 500_000 && krw < 700_000;
    case "70~100만 원대":
      return krw >= 700_000;
    default: {
      const _e: never = band;
      return _e;
    }
  }
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
