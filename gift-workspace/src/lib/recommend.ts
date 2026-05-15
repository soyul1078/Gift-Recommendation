import { gifts } from "./gifts";
import {
  catalogHasGiftInBudgetBand,
  priceFitsBudgetBand,
} from "./budgetBand";
import type { Answers, Gift } from "./types";

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

function scoreGift(gift: Gift, a: Answers): number {
  let score = 0;
  if (a.gender && gift.tags.gender.includes(a.gender)) score += 2;
  if (a.age && gift.tags.age.includes(a.age)) score += 2;
  if (a.relation && gift.tags.relation.includes(a.relation)) score += 2;
  if (a.budget && gift.tags.budget.includes(a.budget)) score += 3;
  const prefs = a.preferences ?? [];
  for (const p of prefs) {
    if (gift.tags.preference.includes(p)) score += 3;
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

export function recommendGifts(answers: Answers, limit = gifts.length): Gift[] {
  const ranked = [...gifts]
    .map((g) => ({ g, s: scoreGift(g, answers) }))
    .sort((a, b) => b.s - a.s || a.g.priceKRW - b.g.priceKRW)
    .filter((x) => x.s > 0);

  const band = answers.budget;
  if (!band) {
    return ranked.slice(0, limit).map((x) => x.g);
  }

  const anyInBand = catalogHasGiftInBudgetBand(gifts, band);
  const filtered = ranked.filter((x) => {
    if (priceFitsBudgetBand(x.g.priceKRW, band)) return true;
    if (!anyInBand && x.g.tags.budget.includes(band)) return true;
    return false;
  });

  const list = filtered.length > 0 ? filtered : ranked;
  return list.slice(0, limit).map((x) => x.g);
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

