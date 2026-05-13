import type { Budget, Gift } from "./types";

/**
 * Maps a KRW amount to the UI budget band (half-open intervals, 만원 단위).
 * Used so displayed “예산” and catalog reference prices stay aligned.
 */
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
      const _x: never = band;
      return _x;
    }
  }
}

export function catalogHasGiftInBudgetBand(
  list: readonly Gift[],
  band: Budget,
): boolean {
  return list.some((g) => priceFitsBudgetBand(g.priceKRW, band));
}
