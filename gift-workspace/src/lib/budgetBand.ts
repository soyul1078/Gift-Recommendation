import type { Budget } from "./types";

const BANDS_ORDERED: readonly Budget[] = [
  "1~3만 원대",
  "3~5만 원대",
  "5~10만 원대",
  "10~15만 원대",
  "15~20만 원대",
  "20~30만 원대",
  "30~50만 원대",
  "50만 원 이상",
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
      return krw >= 500_000;
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

export function catalogHasGiftInBudgetBand(
  list: readonly { priceKRW: number }[],
  band: Budget,
): boolean {
  return list.some((g) => priceFitsBudgetBand(g.priceKRW, band));
}
