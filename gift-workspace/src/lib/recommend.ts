import { gifts } from "./gifts";
import { bandDistance, priceFitsBudgetBand } from "./budgetBand";
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

const HIGH_END_BUDGETS: ReadonlySet<Budget> = new Set(["50만 원 이상", "70~100만 원대"]);
export const LUXURY_FALLBACK_GIFT_IDS: ReadonlySet<string> = new Set([
  "lv-pocket-organizer",
  "dior-oblique-wallet",
  "dior-prestige-cream",
  "royal-copenhagen-tea",
  "gucci-marmont-card-case",
]);

function scoreGift(gift: Gift, a: Answers): number {
  let score = 0;
  // Gender, age, and (when selected) preference are hard filters applied in
  // recommendGifts before scoring — every gift reaching this function already
  // satisfies them. Scoring below only breaks ties among the filtered pool.
  if (a.age && gift.tags.age.includes(a.age)) score += 2;
  // Relation has lower weight: +1
  const targets = relationTargets(a.relation);
  if (a.relation && targets.some((r) => gift.tags.relation.includes(r as any))) score += 1;
  // Preferences get highest weight: +4 per matching preference
  const prefs = a.preferences ?? [];
  for (const p of prefs) {
    if (gift.tags.preference.includes(p)) score += 4;
  }

  // 부모님(40~60대) 맞춤: '몸에 도움 / 오래 사용 / 가족 경험' 3대 가치와 겹치는
  // 검증 카탈로그를 최우선으로 노출한다.
  if (a.relation === "부모님" && gift.parentValue?.length) {
    score += gift.parentValue.length * 5;
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

function blockExcludedRelations(list: Gift[], answers: Answers): Gift[] {
  if (!answers.relation) return list;
  const targets = new Set([answers.relation, ...relationTargets(answers.relation)]);
  return list.filter((g) => !g.excludedRelations?.some((r) => targets.has(r)));
}

function rankAndScore(list: Gift[], answers: Answers) {
  return list
    .map((g) => ({ g, s: scoreGift(g, answers) }))
    .sort((a, b) => b.s - a.s || a.g.priceKRW - b.g.priceKRW)
    .filter((x) => x.s > 0);
}

export function recommendGifts(
  answers: Answers,
  limit = gifts.length,
  seed = 0,
  excludeIds: string[] = [],
): Gift[] {
  const ex = new Set(excludeIds);

  // Diversity cap only makes sense when multiple preferences are active —
  // with 0-1 selected, every match legitimately shares the same primary
  // preference, so capping would wrongly throw away good matches.
  const distinctPrefs = new Set(answers.preferences ?? []).size;
  const preferenceCap = distinctPrefs <= 1 ? Number.POSITIVE_INFINITY : 2;

  // Gender, age, and preference are gate filters (AND/교집합), not scoring
  // weights — a gift that doesn't match the selected age or any selected
  // preference is dropped from the candidate pool entirely, so unrelated
  // items never slip through just because they scored well on something else.
  let pool = gifts.filter((g) => !ex.has(g.id));
  if (answers.gender) {
    pool = pool.filter((g) => g.tags.gender.includes(answers.gender!));
  }
  if (answers.age) {
    pool = pool.filter((g) => g.tags.age.includes(answers.age!));
  }
  if (answers.preferences && answers.preferences.length > 0) {
    const selected = new Set(answers.preferences);
    pool = pool.filter((g) => g.tags.preference.some((p) => selected.has(p)));
  }
  pool = blockExcludedRelations(pool, answers);

  const ranked = rankAndScore(pool, answers);
  const band = answers.budget;

  const hasPreferences = Boolean(answers.preferences && answers.preferences.length > 0);

  const byBandProximity = (a: { g: Gift; s: number }, b: { g: Gift; s: number }) =>
    bandDistance(a.g.priceKRW, band!) - bandDistance(b.g.priceKRW, band!) ||
    b.s - a.s ||
    a.g.priceKRW - b.g.priceKRW;

  if (!band) {
    const strict = rotateGifts(ranked.slice(0, limit).map((x) => x.g), seed);
    if (strict.length > 0) return strict;
  } else {
    const filtered = ranked.filter((x) => priceFitsBudgetBand(x.g.priceKRW, band));
    if (filtered.length > 0) {
      return diversifyAndRotate(filtered.map((x) => x.g), limit, seed, preferenceCap);
    }

    // No preference selected + high-end budget: show the curated luxury
    // catalog (deliberately priced a bit under the band) ahead of a generic
    // nearest-price pick.
    if (!hasPreferences && HIGH_END_BUDGETS.has(band)) {
      const fallback = ranked.filter((x) => LUXURY_FALLBACK_GIFT_IDS.has(x.g.id));
      if (fallback.length > 0) {
        return diversifyAndRotate(fallback.map((x) => x.g), limit, seed, preferenceCap);
      }
    }

    // Budget didn't match exactly, but gender/age/preference did — prefer the
    // closest price band instead of an arbitrary score-ranked pick, so a
    // 1~3만 원대 pick doesn't surface something priced at 300,000원.
    if (ranked.length > 0) {
      const byProximity = [...ranked].sort(byBandProximity);
      return diversifyAndRotate(byProximity.map((x) => x.g), limit, seed, preferenceCap);
    }
  }

  // Preference-only fallback: a selected preference should always surface its
  // catalog, even if gender/age/budget happen not to line up for this visitor.
  // Still respects excludedRelations (hard "bad fit" blocks) and exclusion list,
  // and — when a budget is set — orders by closeness to it.
  if (hasPreferences) {
    const selected = new Set(answers.preferences);
    let fallbackPool = gifts.filter(
      (g) => !ex.has(g.id) && g.tags.preference.some((p) => selected.has(p)),
    );
    fallbackPool = blockExcludedRelations(fallbackPool, answers);
    let fallbackRanked = rankAndScore(fallbackPool, answers);
    if (band) {
      fallbackRanked = [...fallbackRanked].sort(byBandProximity);
    }
    const fallbackGifts = fallbackRanked.map((x) => x.g);
    if (fallbackGifts.length > 0) {
      return diversifyAndRotate(fallbackGifts, limit, seed, preferenceCap);
    }
  }

  // Nothing matched at all. Let the UI show the "no results" state so the
  // user can adjust the budget or other filters.
  return [];
}

function diversifyAndRotate(
  list: Gift[],
  limit: number,
  seed: number,
  maxPerPreference: number,
): Gift[] {
  const rotated = rotateGifts(list, seed);
  const seenTitle = new Set<string>();
  const preferenceCounts = new Map<string, number>();
  const out: Gift[] = [];

  for (const g of rotated) {
    if (out.length >= limit) break;
    const titleKey = g.title.trim().toLowerCase();
    if (seenTitle.has(titleKey)) continue;

    // compute primary preference (if any) to avoid over-recommending same category
    const primaryPref = g.tags.preference?.[0] ?? null;
    if (primaryPref) {
      const cur = preferenceCounts.get(primaryPref) ?? 0;
      if (cur >= maxPerPreference) continue;
      preferenceCounts.set(primaryPref, cur + 1);
    }

    seenTitle.add(titleKey);
    out.push(g);
  }

  return out;
}

export function isLuxuryCatalogGift(giftId: string): boolean {
  return LUXURY_FALLBACK_GIFT_IDS.has(giftId);
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

