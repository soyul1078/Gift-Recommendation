export type AffiliateMerchant = "kakao" | "coupang" | "naver";

export function trackAffiliateClick(
  merchant: AffiliateMerchant,
  giftId: string,
): void {
  void fetch("/api/affiliate-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ merchant, giftId }),
    keepalive: true,
  });
}
