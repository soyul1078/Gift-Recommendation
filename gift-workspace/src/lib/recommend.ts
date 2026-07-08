import { gifts } from "./gifts";
import { priceFitsBudgetBand } from "./budgetBand";
import type { Answers, Budget, Gift } from "./types";

/** 직접 입력에 자주 쓰이는 상황 키워드 → 해당 상황에 어울리는 선물 id 가점 */
const SITUATION_BOOSTS: ReadonlyArray<{
  needle: string;
  giftIds: readonly string[];
}> = [
  {
    needle: "퇴사",
    giftIds: ["tea-giftbox", "desk-mat", "perfume-hand-cream", "stanley-tumbler"],
  },
  { needle: "퇴직", giftIds: ["tea-giftbox", "desk-mat", "stanley-tumbler"] },
  {
    needle: "집들이",
    giftIds: ["tea-giftbox", "desk-mat", "wireless-charger", "hobby-kit"],
  },
  { needle: "이사", giftIds: ["tea-giftbox", "desk-mat", "wireless-charger"] },
  { needle: "새집", giftIds: ["tea-giftbox", "desk-mat", "hobby-kit"] },
  {
    needle: "승진",
    giftIds: ["stanley-tumbler", "tea-giftbox", "wireless-charger", "massage-gun"],
  },
  { needle: "취임", giftIds: ["tea-giftbox", "desk-mat", "wireless-charger"] },
  {
    needle: "생일",
    giftIds: ["hobby-kit", "perfume-hand-cream", "wireless-charger", "stanley-tumbler"],
  },
  {
    needle: "기념일",
    giftIds: ["hobby-kit", "perfume-hand-cream", "tea-giftbox"],
  },
  {
    needle: "결혼",
    giftIds: ["tea-giftbox", "massage-gun", "wireless-charger"],
  },
  { needle: "출산", giftIds: ["tea-giftbox", "perfume-hand-cream"] },
  {
    needle: "감사",
    giftIds: ["perfume-hand-cream", "tea-giftbox", "desk-mat"],
  },
  { needle: "답례", giftIds: ["perfume-hand-cream", "tea-giftbox", "desk-mat"] },
  {
    needle: "러닝",
    giftIds: ["massage-gun", "stanley-tumbler", "wireless-charger"],
  },
  { needle: "운동", giftIds: ["massage-gun", "stanley-tumbler", "tea-giftbox"] },
  { needle: "커피", giftIds: ["tea-giftbox", "stanley-tumbler", "desk-mat"] },
  { needle: "차", giftIds: ["tea-giftbox", "desk-mat"] },
  {
    needle: "어버이날",
    giftIds: ["tea-giftbox", "massage-gun", "perfume-hand-cream", "stanley-tumbler"],
  },
  { needle: "스승의 날", giftIds: ["tea-giftbox", "desk-mat", "perfume-hand-cream"] },
  { needle: "교사의 날", giftIds: ["tea-giftbox", "desk-mat", "perfume-hand-cream"] },
  {
    needle: "설날",
    giftIds: ["tea-giftbox", "massage-gun", "stanley-tumbler", "perfume-hand-cream"],
  },
  {
    needle: "추석",
    giftIds: ["tea-giftbox", "massage-gun", "stanley-tumbler", "perfume-hand-cream"],
  },
  {
    needle: "연말",
    giftIds: ["tea-giftbox", "perfume-hand-cream", "desk-mat", "wireless-charger"],
  },
  {
    needle: "크리스마스",
    giftIds: ["hobby-kit", "perfume-hand-cream", "tea-giftbox", "wireless-charger"],
  },
  { needle: "발렌타인", giftIds: ["perfume-hand-cream", "tea-giftbox", "hobby-kit"] },
  { needle: "화이트데이", giftIds: ["perfume-hand-cream", "tea-giftbox", "hobby-kit"] },
  {
    needle: "어버이",
    giftIds: ["tea-giftbox", "massage-gun", "perfume-hand-cream", "stanley-tumbler"],
  },
  { needle: "부모", giftIds: ["tea-giftbox", "massage-gun", "perfume-hand-cream"] },
  { needle: "카네이션", giftIds: ["tea-giftbox", "perfume-hand-cream"] },
];

function freeTextSituationScore(giftId: string, raw: string): number {
  const t = raw.trim().toLowerCase();
  if (!t) return 0;
  let add = 0;
  for (const row of SITUATION_BOOSTS) {
    if (t.includes(row.needle.toLowerCase()) && row.giftIds.includes(giftId)) {
      add += 3;
    }
  }
  return add;
}

function relationTargets(relation?: string): string[] {
  if (!relation) return [];
  if (relation === "생일·기념일") return ["특별한 기념일(생일, 1주년)", "가벼운 기념일(100일 등)"];
  if (relation === "어버이날") return ["부모님", "시댁/처가 어른"];
  if (relation === "스승의날") return ["선생님/은사님"];
  if (relation === "가벼운 기념일(100일 등)") return ["가벼운 기념일(100일 등)", "생일·기념일"];
  return [relation];
}

const HIGH_END_BUDGETS: ReadonlySet<Budget> = new Set(["50만 원 이상", "70~100만 원대", "100만 원 이상"]);
export const LUXURY_FALLBACK_GIFT_IDS: ReadonlySet<string> = new Set([
  "lv-pocket-organizer",
  "dior-oblique-wallet",
  "tag-heuer-aquaracer",
  "chanel-coco-crush-ring",
  "dior-prestige-cream",
  "royal-copenhagen-tea",
  "gucci-marmont-card-case",
  "burberry-trench-coat",
]);

function scoreGift(gift: Gift, a: Answers): number {
  let score = 0;
  // Gender is used only as a gate/filter (handled in recommendGifts); don't score it.
  if (a.age && gift.tags.age.includes(a.age)) score += 2;
  // Relation has lower weight: +1
  const targets = relationTargets(a.relation);
  if (a.relation && targets.some((r) => gift.tags.relation.includes(r as any))) score += 1;
  // Preferences get highest weight: +4 per matching preference
  const prefs = a.preferences ?? [];
  for (const p of prefs) {
    if (gift.tags.preference.includes(p)) score += 4;
  }

  if (a.budget && HIGH_END_BUDGETS.has(a.budget) && LUXURY_FALLBACK_GIFT_IDS.has(gift.id)) {
    score += 5;
  }

  const text = (a.freeText ?? "").trim();
  if (text.length > 0) {
    const t = text.toLowerCase();
    score += freeTextSituationScore(gift.id, text);
    const tokens = t.split(/[\s,/|·]+/).filter((x) => x.length >= 2);
    const hitDirect =
      gift.title.toLowerCase().includes(t) ||
      gift.shortReason.toLowerCase().includes(t);
    const hitToken = tokens.some(
      (tok) =>
        gift.title.toLowerCase().includes(tok) ||
        gift.shortReason.toLowerCase().includes(tok),
    );
    if (hitDirect) score += 2;
    else if (hitToken) score += 1;
  }

  return score;
}

function rotateGifts(list: Gift[], seed: number): Gift[] {
  if (seed === 0 || list.length <= 1) return list;
  const offset = seed % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)];
}

export function recommendGifts(
  answers: Answers,
  limit = gifts.length,
  seed = 0,
  excludeIds: string[] = [],
): Gift[] {
  // Gender is a gate filter (not a scoring weight).
  let pool = [...gifts];
  if (answers.gender) {
    pool = pool.filter((g) => g.tags.gender.includes(answers.gender!));
  }

  // Exclude previously shown items when requested (재추천 시 사용).
  if (excludeIds.length > 0) {
    const ex = new Set(excludeIds);
    pool = pool.filter((g) => !ex.has(g.id));
  }

  const ranked = pool
    .map((g) => ({ g, s: scoreGift(g, answers) }))
    .sort((a, b) => b.s - a.s || a.g.priceKRW - b.g.priceKRW)
    .filter((x) => x.s > 0);

  const band = answers.budget;
  if (!band) {
    return rotateGifts(
      ranked.slice(0, limit).map((x) => x.g),
      seed,
    );
  }

  const filtered = ranked.filter((x) => priceFitsBudgetBand(x.g.priceKRW, band));
  if (filtered.length > 0) {
    return rotateGifts(filtered.slice(0, limit).map((x) => x.g), seed);
  }

  const fallback = ranked.filter((x) => LUXURY_FALLBACK_GIFT_IDS.has(x.g.id));
  if (fallback.length > 0) {
    return rotateGifts(fallback.slice(0, limit).map((x) => x.g), seed);
  }

  return rotateGifts(ranked.slice(0, limit).map((x) => x.g), seed);
}

export function isLuxuryCatalogGift(giftId: string): boolean {
  return LUXURY_FALLBACK_GIFT_IDS.has(giftId);
}

export function getAddonForPreferences(preferences: string[] = []): string | null {
  if (!preferences || preferences.length === 0) return null;
  if (preferences.includes("감성/디자인 중시"))
    return "프리미엄 생화 꽃다발 또는 꾸뛰르 플라워 박스";
  if (preferences.includes("건강/웰빙형") || preferences.includes("미식가형"))
    return "최고급 호텔 디저트 또는 프리미엄 티 세트";
  return null;
}

export function buildReason(gift: Gift, answers: Answers): string {
  const bits: string[] = [];
  if (answers.relation) bits.push(`${answers.relation}에게 무난한 선택`);
  if (answers.budget) bits.push(`${answers.budget} 예산대에 잘 맞음`);
  const prefs = answers.preferences?.filter(Boolean) ?? [];
  if (prefs.length === 1) bits.push(`${prefs[0]} 성향과 궁합이 좋음`);
  else if (prefs.length > 1)
    bits.push(`선택한 성향(${prefs.join(", ")})과 잘 맞는 편`);

  const free = (answers.freeText ?? "").trim();
  if (free) bits.push(`“${free}” 상황을 고려해 선택`);

  const tail = bits.length ? `\n\n- ${bits.join("\n- ")}` : "";
  return `${gift.shortReason}${tail}`;
}

export function formatKRW(krw: number): string {
  return `${krw.toLocaleString("ko-KR")}원`;
}

