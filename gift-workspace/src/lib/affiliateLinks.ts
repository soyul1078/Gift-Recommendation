/**
 * 제휴 검색 URL. 템플릿에 `{query}`가 있으면 URL 인코딩된 검색어로 치환합니다.
 * 파트너스·링크프라이스 등에서 받은 랜딩 URL을 그대로 넣되, 검색어 자리만 `{query}`로 두면 됩니다.
 */
function applyTemplate(
  template: string | undefined,
  encodedQuery: string,
): string | undefined {
  const t = template?.trim();
  if (!t) return undefined;
  return t.includes("{query}")
    ? t.replaceAll("{query}", encodedQuery)
    : t;
}

export function outboundLinks(query: string) {
  const q = encodeURIComponent(query);
  const naver =
    applyTemplate(process.env.NEXT_PUBLIC_NAVER_SHOPPING_URL_TEMPLATE, q) ??
    `https://search.shopping.naver.com/search/all?query=${q}`;
  const coupang =
    applyTemplate(process.env.NEXT_PUBLIC_COUPANG_SEARCH_URL_TEMPLATE, q) ??
    `https://www.coupang.com/np/search?component=&q=${q}`;
  const kakaoGift =
    applyTemplate(process.env.NEXT_PUBLIC_KAKAO_GIFT_SEARCH_URL_TEMPLATE, q) ??
    `https://gift.kakao.com/search/result?query=${q}&searchType=search_related_keyword_search_box`;
  return { naverShopping: naver, coupang, kakaoGift };
}
