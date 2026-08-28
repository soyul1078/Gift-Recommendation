"use client";

import { useMemo, useState } from "react";
import { GiftThumbnail } from "@/components/GiftThumbnail";
import { OptionGrid, optionChipClass } from "@/components/OptionGrid";
import { RelationSectionPicker } from "@/components/RelationSectionPicker";
import { outboundLinksForGift } from "@/lib/affiliateLinks";
import { priceFitsBudgetBand } from "@/lib/budgetBand";
import { gifts } from "@/lib/gifts";
import {
  availableBudgetBands,
  budgetBandMatchCount,
  buildReason,
  formatKRW,
  recommendGifts,
  isLuxuryCatalogGift,
} from "@/lib/recommend";
import { trackAffiliateClick } from "@/lib/trackAffiliateClick";
import type { AgeBand, Answers, Gender, Preference } from "@/lib/types";

const landingExampleGifts = gifts.filter((g) => g.imageUrl).slice(0, 3);

const genderOptions: readonly Gender[] = ["여성", "남성", "무관"];
const genderLabels: Partial<Record<Gender, string>> = { "무관": "상관없어요" };
const ageOptions: readonly AgeBand[] = [
  "10대",
  "20대",
  "30대",
  "40대",
  "50대",
  "60대 이상",
];
const preferenceOptions: readonly Preference[] = [
  "실용성 우선",
  "감성/디자인 중시",
  "건강/웰빙형",
  "자기계발/워커홀릭",
  "독서형",
  "뷰티/그루밍형",
];
const preferenceLabels: Partial<Record<Preference, string>> = {
  "독서형": "독서 중시/독서 용품",
};
const foodOptions: readonly Preference[] = ["간식형"];
const foodLabels: Partial<Record<Preference, string>> = {
  "간식형": "🍪 간식파 (마카롱·과자·떡·약과 등)",
};
const hobbyOptions: readonly Preference[] = ["레저/캠핑형", "미니어처/DIY형"];
const hobbyLabels: Partial<Record<Preference, string>> = {
  "레저/캠핑형": "⛺ 캠핑/아웃도어파",
  "미니어처/DIY형": "🧱 미니어처/DIY파",
};

type StepId = "start" | "genderAge" | "relation" | "budget" | "preference" | "result";

export default function Home() {
  const [step, setStep] = useState<StepId>("start");
  const [answers, setAnswers] = useState<Answers>({ platform: "pc" });
  const [recommendSeed, setRecommendSeed] = useState(0);
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const selectedFoodPrefs = (answers.preferences ?? []).filter((p) => foodOptions.includes(p));
  const [foodPanelOpen, setFoodPanelOpen] = useState(false);
  const selectedHobbyPrefs = (answers.preferences ?? []).filter((p) => hobbyOptions.includes(p));
  const [hobbyPanelOpen, setHobbyPanelOpen] = useState(false);

  // Recomputed from the live catalog on every relevant answer change — never
  // hardcoded — so a band that's empty today reappears on its own once the
  // catalog grows into it.
  const visibleBudgetOptions = useMemo(() => availableBudgetBands(answers), [answers]);

  // Single point of mutation for `answers`. If the update makes the current
  // budget stop matching anything (e.g. relation/preference changed after a
  // budget was already picked), clear it in the same update instead of
  // leaving a 0-result selection sitting in state — the budget step
  // re-renders with nothing selected and the user has to pick again.
  function updateAnswers(updater: (prev: Answers) => Answers) {
    setAnswers((prev) => {
      const next = updater(prev);
      if (next.budget && budgetBandMatchCount(next, next.budget) === 0) {
        return { ...next, budget: undefined };
      }
      return next;
    });
  }

  const RECOMMEND_LIMIT = 5;
  const recommended = useMemo(
    () => recommendGifts(answers, RECOMMEND_LIMIT, recommendSeed, excludedIds),
    [answers, recommendSeed, excludedIds],
  );
  const isBudgetFallback =
    answers.budget &&
    recommended.length > 0 &&
    recommended.every((gift) => !priceFitsBudgetBand(gift.priceKRW, answers.budget!));

  const canNext =
    step === "start"
      ? true
      : step === "genderAge"
        ? Boolean(answers.gender && answers.age)
        : step === "relation"
          ? Boolean(answers.relation)
          : step === "preference"
            ? Boolean(answers.preferences && answers.preferences.length > 0)
            : step === "budget"
              ? Boolean(answers.budget)
              : true;

  const progressLabel =
    step === "genderAge" ? "1/5" : step === "relation" ? "2/5" : step === "preference" ? "3/5" : step === "budget" ? "4/5" : "0/5";
  const progressWidth =
    step === "genderAge" ? "20%" : step === "relation" ? "40%" : step === "preference" ? "60%" : step === "budget" ? "80%" : "0%";

  function next() {
    if (!canNext) return;
    setStep((s) => {
      if (s === "start") return "genderAge";
      if (s === "genderAge") return "relation";
      if (s === "relation") return "preference";
      if (s === "preference") return "budget";
      if (s === "budget") {
        setRecommendSeed(0);
        return "result";
      }
      return "result";
    });
  }

  function back() {
    setStep((s) => {
      if (s === "result") return "budget";
      if (s === "budget") return "preference";
      if (s === "preference") return "relation";
      if (s === "relation") return "genderAge";
      if (s === "genderAge") return "start";
      return "start";
    });
  }

  function recommendAgain() {
    const nextExcluded = [...new Set([...excludedIds, ...recommended.map((g) => g.id)])];
    const nextSeed = recommendSeed + 1;
    // If excluding everything shown so far would leave nothing to recommend,
    // start the exclusion list over so the button never gets stuck on "no results".
    const preview = recommendGifts(answers, RECOMMEND_LIMIT, nextSeed, nextExcluded);
    setExcludedIds(preview.length > 0 ? nextExcluded : []);
    setRecommendSeed(nextSeed);
  }

  

  return (
    <div className="min-h-screen flex flex-col bg-bg text-slate-900">
      <header className="border-b border-zinc-200 bg-surface">
        <div className="mx-auto flex max-w-[600px] items-center px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-sm font-semibold text-white">
              G
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">선물 추천</div>
              <div className="text-xs text-zinc-500">예산·취향에 맞는 선물을 바로 구매까지 연결해 드립니다.</div>
            </div>
          </div>
        </div>
      </header>

      {step !== "start" && step !== "result" && (
        <div className="sticky top-0 z-10 border-b border-zinc-200 bg-surface/95 backdrop-blur">
          <div className="mx-auto flex max-w-[600px] items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
              <div className="h-1.5 rounded-full bg-accent transition-all" style={{ width: progressWidth }} />
            </div>
            <span className="shrink-0 text-xs font-semibold text-accent-dark">진행도 {progressLabel}</span>
          </div>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-[600px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            {step === "start" && (
              <div className="mx-auto grid w-full max-w-[600px] gap-6 px-5 text-left">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-slate-900">
                    이 사람한테
                    <br />
                    <span className="text-accent">뭐 주지?</span>
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-soft">
                    상황을 몇 가지만 알려주시면 예산에 맞는 선물을 찾아드려요.
                    <br />
                    바로 구매까지 연결됩니다.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("genderAge")}
                  className="w-full rounded-[14px] bg-accent py-[18px] text-base font-semibold text-white"
                >
                  선물 찾기 시작하기
                </button>

                <div className="grid w-full min-w-0 gap-3">
                  <div className="text-left text-xs text-soft">이렇게 추천해 드려요</div>
                  <div className="grid w-full min-w-0 grid-cols-3 items-stretch gap-3">
                    {landingExampleGifts.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[14px] border border-line bg-surface p-3 text-left"
                      >
                        <div className="overflow-hidden rounded-lg">
                          <GiftThumbnail imageUrl={item.imageUrl} title={item.title} />
                        </div>
                        <div className="mt-2 line-clamp-2 text-[13px] font-semibold">{item.title}</div>
                        <div className="text-xs text-soft">{formatKRW(item.priceKRW)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === "relation" && (
              <div className="grid gap-4">
                <div>
                  <div className="text-2xl font-bold text-zinc-900">관계를 선택해 주세요</div>
                  <p className="mt-1 text-sm text-soft">누구에게 주는 선물인가요?</p>
                </div>
                <RelationSectionPicker
                  value={answers.relation}
                  onChange={(relation) => updateAnswers((p) => ({ ...p, relation }))}
                />
              </div>
            )}

            {step === "genderAge" && (
              <div className="grid gap-4">
                <div>
                  <div className="text-2xl font-bold text-zinc-900">누구에게 선물할지 먼저 알려주세요</div>
                  <p className="mt-1 text-sm text-soft">성별과 연령대를 선택하면 더 정확한 추천이 가능해요.</p>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold text-zinc-900">성별</div>
                    <OptionGrid value={answers.gender} options={genderOptions} labels={genderLabels} onChange={(gender) => updateAnswers((p) => ({ ...p, gender }))} />
                  </div>
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold text-zinc-900">연령대</div>
                    <OptionGrid value={answers.age} options={ageOptions} onChange={(age) => updateAnswers((p) => ({ ...p, age }))} />
                  </div>
                </div>
              </div>
            )}

            {step === "budget" && (
              <div className="grid gap-4">
                <div>
                  <div className="text-2xl font-bold text-zinc-900">예산 범위를 정해 주세요</div>
                  <p className="mt-1 text-sm text-soft">예산대에 맞춰 딱 맞는 추천을 드립니다.</p>
                </div>
                {visibleBudgetOptions.length === 0 ? (
                  <div className="rounded-2xl border border-warn bg-warn-bg p-4 text-sm text-warn shadow-sm">
                    선택하신 관계·성향 조건에 맞는 상품이 없어요. 이전 단계로 돌아가 성향이나 관계를 조정해 주세요.
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold text-zinc-900">예산</div>
                    <OptionGrid
                      value={answers.budget}
                      options={visibleBudgetOptions}
                      onChange={(budget) => updateAnswers((p) => ({ ...p, budget }))}
                    />
                  </div>
                )}
              </div>
            )}

            {step === "preference" && (
              <div className="grid gap-4">
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <div className="text-2xl font-bold text-zinc-900">상대방의 성향을 골라 주세요</div>
                    <span className="text-sm font-semibold text-accent-dark">
                      {(answers.preferences ?? []).length}개 선택됨
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-soft">해당하는 것을 모두 골라주세요.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferenceOptions.map((opt) => {
                    const active = (answers.preferences ?? []).includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          updateAnswers((p) => {
                            const cur = p.preferences ?? [];
                            const next = active ? cur.filter((v) => v !== opt) : [...cur, opt];
                            return { ...p, preferences: next };
                          });
                        }}
                        className={optionChipClass(active)}
                      >
                        {preferenceLabels[opt] ?? opt}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setFoodPanelOpen((v) => !v)}
                    className={optionChipClass(foodPanelOpen || selectedFoodPrefs.length > 0)}
                  >
                    음식이 중요해요
                    {selectedFoodPrefs.length > 0 && (
                      <span className="ml-2 text-xs font-normal opacity-90">
                        ({selectedFoodPrefs.map(() => "간식").join(", ")} 선택됨)
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHobbyPanelOpen((v) => !v)}
                    className={optionChipClass(hobbyPanelOpen || selectedHobbyPrefs.length > 0)}
                  >
                    취미가 있어요
                    {selectedHobbyPrefs.length > 0 && (
                      <span className="ml-2 text-xs font-normal opacity-90">
                        ({selectedHobbyPrefs
                          .map((p) => (p === "레저/캠핑형" ? "캠핑" : p === "미니어처/DIY형" ? "미니어처/DIY" : "홈힐링"))
                          .join(", ")} 선택됨)
                      </span>
                    )}
                  </button>
                </div>
                {foodPanelOpen && (
                  <div className="rounded-2xl border border-accent bg-tint p-3">
                    <div className="mb-2 text-sm text-zinc-600">어떤 간식을 좋아하세요?</div>
                    <OptionGrid
                      mode="multiple"
                      values={selectedFoodPrefs}
                      options={foodOptions}
                      labels={foodLabels}
                      onChange={(nextFood) => {
                        updateAnswers((p) => {
                          const base = (p.preferences ?? []).filter((pref) => !foodOptions.includes(pref));
                          return { ...p, preferences: [...base, ...nextFood] };
                        });
                      }}
                    />
                  </div>
                )}
                {hobbyPanelOpen && (
                  <div className="rounded-2xl border border-accent bg-tint p-3">
                    <div className="mb-2 text-sm text-zinc-600">어떤 취미가 있으세요?</div>
                    <OptionGrid
                      mode="multiple"
                      values={selectedHobbyPrefs}
                      options={hobbyOptions}
                      labels={hobbyLabels}
                      onChange={(nextHobby) => {
                        updateAnswers((p) => {
                          const base = (p.preferences ?? []).filter((pref) => !hobbyOptions.includes(pref));
                          return { ...p, preferences: [...base, ...nextHobby] };
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {step === "result" && (
              <div className="grid gap-4">
                <div>
                  <div className="text-2xl font-bold text-zinc-900">입력하신 조건에 맞는 선물이에요</div>
                  <p className="mt-1 text-sm text-soft">
                    마음에 들지 않으면 다른 추천을 받아보세요. 구매 버튼은 표시 가격대에 맞춰 검색합니다.
                  </p>
                </div>
                {recommended.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-200 bg-surface p-4 text-sm text-zinc-700 shadow-sm">
                    선택하신 조건에 맞는 상품이 없습니다. 이전 단계로 돌아가 예산을 변경하거나 다른 조건을 선택해 주세요.
                  </div>
                ) : (
                  <>
                    {isBudgetFallback && (
                      <div className="rounded-2xl border border-warn bg-warn-bg p-4 text-sm text-warn shadow-sm">
                        선택하신 예산대에 맞는 상품을 찾지 못했어요.
                      </div>
                    )}
                    {recommended.map((gift) => {
                      const links = outboundLinksForGift(gift);
                      const exactBudgetMatch = answers.budget ? priceFitsBudgetBand(gift.priceKRW, answers.budget) : false;
                      const isLuxuryGift = isLuxuryCatalogGift(gift.id);
                      const budgetNote = isBudgetFallback
                        ? "선택하신 예산대에 딱 맞는 상품은 없지만, 비슷한 스타일의 추천을 제공합니다."
                        : answers.budget
                          ? exactBudgetMatch
                            ? null
                            : "예산대에 근접한 추천입니다."
                          : "위 금액은 국내 주요 몰 기준 대표 소비자가예요. 구매 버튼은 이 가격대에 맞춰 검색·필터를 적용합니다.";

                      return (
                        <div key={gift.id} className="rounded-2xl border border-zinc-200 bg-surface p-4 shadow-sm">
                          <div className="flex gap-3">
                            <GiftThumbnail
                              imageUrl={gift.imageUrl}
                              title={gift.title}
                              fallbackEmoji={isLuxuryGift ? "✨" : "🎁"}
                              thumb
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="line-clamp-2 text-base font-semibold text-zinc-900 font-[family-name:var(--font-display)]">{gift.title}</div>
                                {isLuxuryGift && (
                                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                                    프리미엄
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 space-y-2">
                                <div className="text-xl font-bold tracking-tight text-slate-900 font-[family-name:var(--font-display)]">{formatKRW(gift.priceKRW)}</div>
                                <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                    {answers.budget ? (exactBudgetMatch ? "예산대 일치" : "예산대 불일치") : "예산 정보 없음"}
                                  </span>
                                  {gift.badge && (
                                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                      {gift.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            {budgetNote && (
                              <div className="mb-2 text-xs leading-relaxed text-slate-500">{budgetNote}</div>
                            )}
                            <div className="text-sm font-semibold text-zinc-900">이유</div>
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-700">{buildReason(gift, answers)}</p>
                          </div>
                          <a
                            className="mt-4 block w-full rounded-xl bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-accent-dark"
                            href={links.coupang}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackAffiliateClick("coupang", gift.id)}
                          >
                            쿠팡 바로가기
                          </a>
                          <div className="mt-2 flex justify-center gap-4 text-xs">
                            <a
                              className="font-medium text-zinc-500 underline-offset-2 hover:underline"
                              href={links.kakaoGift}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => trackAffiliateClick("kakao", gift.id)}
                            >
                              카카오톡 선물하기
                            </a>
                            <a
                              className="font-medium text-zinc-500 underline-offset-2 hover:underline"
                              href={links.naverShopping}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => trackAffiliateClick("naver", gift.id)}
                            >
                              네이버 쇼핑
                            </a>
                          </div>
                          <p className="mt-3 text-xs text-soft">
                            이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                          </p>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}

        <footer className="text-center text-xs leading-5 text-soft">
          개인정보를 수집하지 않습니다.
        </footer>
      </main>

      {step !== "start" && (
        <div
          className="sticky bottom-0 z-10 mt-8"
          style={{ background: "linear-gradient(to top, var(--color-bg) 74%, transparent)" }}
        >
          <div className="mx-auto flex max-w-[600px] items-center justify-between gap-3 px-4 pb-4 pt-6 sm:px-6 lg:px-8">
            {step === "result" ? (
              <>
                <button type="button" onClick={back} className="h-12 min-w-[48px] rounded-xl bg-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-300">
                  이전
                </button>
                <button
                  type="button"
                  onClick={recommendAgain}
                  className="h-12 min-w-[48px] rounded-xl bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-dark"
                >
                  다시 추천받기
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={back} className="h-12 min-w-[48px] rounded-xl bg-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-300">
                  이전
                </button>
                <button type="button" onClick={next} disabled={!canNext} className={["h-12 min-w-[48px] flex-1 max-w-[240px] rounded-xl px-5 text-sm font-semibold text-white transition", canNext ? "bg-accent hover:opacity-90" : "bg-zinc-300"].join(" ")}>
                  다음으로
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



