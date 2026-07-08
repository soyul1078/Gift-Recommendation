/**
 * 제휴 검색 URL. 템플릿 플레이스홀더:
 * - `{query}`: URL 인코딩된 검색어
 * - `{minPrice}`, `{maxPrice}`: 표시 가격과 맞춘 검색 가격 구간(KRW)
 */
function applyTemplate(
  template: string | undefined,
  encodedQuery: string,
  minPrice: number,
  maxPrice: number,
): string | undefined {
  const t = template?.trim();
  if (!t) return undefined;
  return t
    .replaceAll("{query}", encodedQuery)
    .replaceAll("{minPrice}", String(minPrice))
    .replaceAll("{maxPrice}", String(maxPrice));
}

/** UI 표기 가격 주변의 좁은 검색 구간(±6%, 최소 ±2천 원). */
export function priceSearchWindow(priceKRW: number): { min: number; max: number } {
  const margin = Math.max(2_000, Math.round(priceKRW * 0.06));
  return {
    min: Math.max(1_000, priceKRW - margin),
    max: priceKRW + margin,
  };
}

export function outboundLinks(query: string, priceKRW?: number) {
  const encodedQuery = encodeURIComponent(query);
  const { min, max } =
    priceKRW != null
      ? priceSearchWindow(priceKRW)
      : { min: 0, max: Number.MAX_SAFE_INTEGER };

  const naver =
    applyTemplate(
      process.env.NEXT_PUBLIC_NAVER_SHOPPING_URL_TEMPLATE,
      encodedQuery,
      min,
      max,
    ) ??
    (priceKRW != null
      ? `https://search.shopping.naver.com/search/all?query=${encodedQuery}&minPrice=${min}&maxPrice=${max}&sort=price_asc`
      : `https://search.shopping.naver.com/search/all?query=${encodedQuery}`);

  const coupang =
    applyTemplate(
      process.env.NEXT_PUBLIC_COUPANG_SEARCH_URL_TEMPLATE,
      encodedQuery,
      min,
      max,
    ) ??
    (priceKRW != null
      ? `https://www.coupang.com/np/search?q=${encodedQuery}&channel=user&isPriceRange=true&filterSetByUser=true&minPrice=${min}&maxPrice=${max}&sorter=priceAsc`
      : `https://www.coupang.com/np/search?component=&q=${encodedQuery}`);

  const kakaoQuery =
    priceKRW != null
      ? `${query} ${priceKRW.toLocaleString("ko-KR")}원`
      : query;
  const kakaoEncoded = encodeURIComponent(kakaoQuery);

  const kakaoGift =
    applyTemplate(
      process.env.NEXT_PUBLIC_KAKAO_GIFT_SEARCH_URL_TEMPLATE,
      kakaoEncoded,
      min,
      max,
    ) ??
    `https://gift.kakao.com/search/result?query=${kakaoEncoded}&searchType=search_related_keyword_search_box`;

  return { naverShopping: naver, coupang, kakaoGift };
}

export function outboundLinksForGift(gift: {
  title: string;
  priceKRW: number;
  affiliateUrls?: {
    naverShopping?: string;
    coupang?: string;
    kakaoGift?: string;
  };
}) {
  const fallback = outboundLinks(gift.title.trim(), gift.priceKRW);
  return {
    naverShopping: gift.affiliateUrls?.naverShopping ?? fallback.naverShopping,
    coupang: gift.affiliateUrls?.coupang ?? fallback.coupang,
    kakaoGift: gift.affiliateUrls?.kakaoGift ?? fallback.kakaoGift,
  };
}
