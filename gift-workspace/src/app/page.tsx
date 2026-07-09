"use client";

import { useMemo, useState } from "react";
import { OptionGrid } from "@/components/OptionGrid";
import { RelationSectionPicker } from "@/components/RelationSectionPicker";
import { outboundLinksForGift } from "@/lib/affiliateLinks";
import { priceFitsBudgetBand } from "@/lib/budgetBand";
import { buildReason, formatKRW, recommendGifts, getAddonForPreferences, isLuxuryCatalogGift } from "@/lib/recommend";
import { trackAffiliateClick } from "@/lib/trackAffiliateClick";
import type { AgeBand, Answers, Budget, Gender, Preference } from "@/lib/types";

const genderOptions: readonly Gender[] = ["여성", "남성", "무관"];
const ageOptions: readonly AgeBand[] = [
  "10대",
  "20대 초반",
  "20대 후반",
  "30대 초반",
  "30대 후반",
  "40대",
  "50대",
  "60대 이상",
];
const budgetOptions: readonly Budget[] = [
  "1~3만 원대",
  "3~5만 원대",
  "5~10만 원대",
  "10~15만 원대",
  "15~20만 원대",
  "20~30만 원대",
  "30~50만 원대",
  "50만 원 이상",
  "70~100만 원대",
  "100만 원 이상",
];
const preferenceOptions: readonly Preference[] = [
  "실용성 우선",
  "감성/디자인 중시",
  "건강/웰빙형",
  "자기계발/워커홀릭",
  "특정 취미 진심형",
  "미식가형",
  "뷰티/그루밍형",
];

type StepId = "start" | "genderAge" | "relation" | "budget" | "preference" | "result";

export default function Home() {
  const [step, setStep] = useState<StepId>("start");
  const [answers, setAnswers] = useState<Answers>({});
  const [recommendSeed, setRecommendSeed] = useState(0);
  const [excludedIds, setExcludedIds] = useState<string[]>([]);

  const RECOMMEND_LIMIT = 5;
  const recommended = useMemo(
    () => recommendGifts(answers, RECOMMEND_LIMIT, recommendSeed, excludedIds),
    [answers, recommendSeed, excludedIds],
  );
  const isBudgetFallback =
    answers.budget &&
    recommended.length > 0 &&
    recommended.every((gift) => !priceFitsBudgetBand(gift.priceKRW, answers.budget!));
  const addon = useMemo(() => getAddonForPreferences(answers.preferences ?? []), [answers.preferences]);

  const canNext =
    step === "start"
      ? true
      : step === "genderAge"
        ? Boolean(answers.gender && answers.age)
        : step === "relation"
          ? Boolean(answers.relation)
          : step === "budget"
            ? Boolean(answers.budget)
            : step === "preference"
              ? Boolean(answers.preferences && answers.preferences.length > 0)
              : true;

  const progressLabel =
    step === "genderAge" ? "1/5" : step === "relation" ? "2/5" : step === "budget" ? "3/5" : step === "preference" ? "4/5" : "0/5";
  const progressWidth =
    step === "genderAge" ? "20%" : step === "relation" ? "40%" : step === "budget" ? "60%" : step === "preference" ? "80%" : "0%";

  function next() {
    if (!canNext) return;
    setStep((s) => {
      if (s === "start") return "genderAge";
      if (s === "genderAge") return "relation";
      if (s === "relation") return "budget";
      if (s === "budget") return "preference";
      if (s === "preference") {
        setRecommendSeed(0);
        return "result";
      }
      return "result";
    });
  }

  function back() {
    setStep((s) => {
      if (s === "result") return "preference";
      if (s === "preference") return "budget";
      if (s === "budget") return "relation";
      if (s === "relation") return "genderAge";
      if (s === "genderAge") return "start";
      return "start";
    });
  }

  function reset() {
    setAnswers({});
    setRecommendSeed(0);
    setExcludedIds([]);
    setStep("start");
  }

  function recommendAgain() {
    setExcludedIds((prev) => [...new Set([...prev, ...recommended.map((g) => g.id)])]);
    setRecommendSeed((s) => s + 1);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-sm font-semibold text-white">
              G
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">선물 추천</div>
              <div className="text-xs text-zinc-500">예산·취향에 맞는 선물을 바로 구매까지 연결해 드립니다.</div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mt-6 rounded-[28px] border border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-amber-50/70 p-4 shadow-inner sm:p-6">
            {step === "start" && (
              <div className="grid gap-5 rounded-[24px] border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-900 text-3xl text-white shadow">
                  ✨
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900">선물 추천을 시작해 볼까요?</div>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    5가지 질문만으로 예산에 맞는 선물 3~5개를 추천하고, 카카오·쿠팡·네이버에서 바로 구매할 수 있어요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("genderAge")}
                  className="mx-auto inline-flex h-12 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow transition hover:bg-slate-800"
                >
                  시작하기
                </button>
              </div>
            )}

            {step === "relation" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">관계를 선택해 주세요</div>
                      <p className="mt-1 text-sm text-zinc-500">가장 자연스러운 선물 포인트가 보이도록 관계를 골라주세요.</p>
                    </div>
                    <div className="min-w-[180px] max-w-[220px] rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                      <div className="flex items-center justify-between text-xs text-emerald-700">
                        <span>진행도</span>
                        <span className="font-semibold text-emerald-900">{progressLabel}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-zinc-200">
                        <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: progressWidth }} />
                      </div>
                    </div>
                  </div>
                </div>
                <RelationSectionPicker
                  value={answers.relation}
                  onChange={(relation) => setAnswers((p) => ({ ...p, relation }))}
                />
              </div>
            )}

            {step === "genderAge" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">누구에게 선물할지 먼저 알려주세요</div>
                      <p className="mt-1 text-sm text-zinc-500">성별과 연령대를 선택하면 더 정확한 추천이 가능해요.</p>
                    </div>
                    <div className="min-w-[180px] max-w-[220px] rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                      <div className="flex items-center justify-between text-xs text-emerald-700">
                        <span>진행도</span>
                        <span className="font-semibold text-emerald-900">{progressLabel}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-zinc-200">
                        <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: progressWidth }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold text-zinc-900">성별</div>
                    <OptionGrid value={answers.gender} options={genderOptions} onChange={(gender) => setAnswers((p) => ({ ...p, gender }))} />
                  </div>
                  <div className="grid gap-2">
                    <div className="text-sm font-semibold text-zinc-900">연령대</div>
                    <OptionGrid value={answers.age} options={ageOptions} onChange={(age) => setAnswers((p) => ({ ...p, age }))} />
                  </div>
                </div>
              </div>
            )}

            {step === "budget" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">예산 범위를 정해 주세요</div>
                      <p className="mt-1 text-sm text-zinc-500">예산대에 맞춰 딱 맞는 추천을 드립니다.</p>
                    </div>
                    <div className="min-w-[180px] max-w-[220px] rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                      <div className="flex items-center justify-between text-xs text-emerald-700">
                        <span>진행도</span>
                        <span className="font-semibold text-emerald-900">{progressLabel}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-zinc-200">
                        <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: progressWidth }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-semibold text-zinc-900">예산</div>
                  <OptionGrid value={answers.budget} options={budgetOptions} onChange={(budget) => setAnswers((p) => ({ ...p, budget }))} />
                </div>
              </div>
            )}

            {step === "preference" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">상대방의 성향을 골라 주세요</div>
                      <p className="mt-1 text-sm text-zinc-500">여러 개를 선택하면 더 잘 맞는 선물을 찾아드립니다.</p>
                    </div>
                    <div className="min-w-[180px] max-w-[220px] rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                      <div className="flex items-center justify-between text-xs text-emerald-700">
                        <span>진행도</span>
                        <span className="font-semibold text-emerald-900">{progressLabel}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-zinc-200">
                        <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: progressWidth }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-semibold text-zinc-900">
                    성향 <span className="font-normal text-zinc-500">(해당되는 항목을 모두 눌러 주세요)</span>
                  </div>
                  <OptionGrid mode="multiple" values={answers.preferences ?? []} options={preferenceOptions} onChange={(preferences) => setAnswers((p) => ({ ...p, preferences: [...preferences] }))} />
                </div>
              </div>
            )}

            {step === "result" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-zinc-900">입력하신 조건에 맞는 선물이에요</div>
                  <p className="mt-1 text-sm text-zinc-500">
                    마음에 들지 않으면 다른 추천을 받아보세요. 구매 버튼은 표시 가격대에 맞춰 검색합니다.
                  </p>
                </div>
                {recommended.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-sm">
                    선택하신 조건에 맞는 상품이 없습니다. 이전 단계로 돌아가 예산을 변경하거나 다른 조건을 선택해 주세요.
                  </div>
                ) : (
                  <>
                    {isBudgetFallback && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
                        선택하신 예산대에 딱 맞는 상품은 없지만, 비슷한 스타일의 프리미엄 선물 3~5개를 추천해 드립니다.
                      </div>
                    )}
                    {recommended.map((gift) => {
                      const links = outboundLinksForGift(gift);
                      const exactBudgetMatch = answers.budget ? priceFitsBudgetBand(gift.priceKRW, answers.budget) : false;
                      const hasDirectAffiliateLink = Boolean(
                        gift.affiliateUrls?.naverShopping || gift.affiliateUrls?.coupang || gift.affiliateUrls?.kakaoGift,
                      );
                      const isLuxuryGift = isLuxuryCatalogGift(gift.id);

                      return (
                        <div key={gift.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                          <div className="grid gap-4 lg:grid-cols-[170px_minmax(0,1fr)] lg:items-start">
                            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-100 via-white to-amber-50">
                              {gift.imageUrl ? (
                                <img src={gift.imageUrl} alt={gift.title} className="h-44 w-full object-cover" />
                              ) : (
                                <div className="flex h-44 flex-col items-center justify-center gap-2 px-3 text-center">
                                  <span className="text-3xl" aria-hidden>
                                    {isLuxuryGift ? "✨" : "🎁"}
                                  </span>
                                  <span className="text-xs font-semibold leading-5 text-zinc-500">{gift.title}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="max-w-2xl">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="text-lg font-semibold text-zinc-900">{gift.title}</div>
                                    {isLuxuryGift && (
                                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                                        프리미엄
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-2 space-y-2">
                                    <div className="text-2xl font-bold tracking-tight text-slate-900">{formatKRW(gift.priceKRW)}</div>
                                    <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                                      <span>선택 예산: {answers.budget ?? "—"}</span>
                                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                        {answers.budget ? (exactBudgetMatch ? "예산대 일치" : "예산대 불일치") : "예산 정보 없음"}
                                      </span>
                                      {hasDirectAffiliateLink && (
                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                          직접 추천 링크
                                        </span>
                                      )}
                                      {gift.badge && (
                                        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                          {gift.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs leading-relaxed text-slate-500">
                                      {isBudgetFallback
                                        ? "선택하신 예산대에 딱 맞는 상품은 없지만, 비슷한 스타일의 추천을 제공합니다."
                                        : answers.budget
                                          ? exactBudgetMatch
                                            ? "예산대에 잘 맞는 추천입니다."
                                            : "예산대에 근접한 추천입니다."
                                          : "위 금액은 국내 주요 몰 기준 대표 소비자가예요. 구매 버튼은 이 가격대에 맞춰 검색·필터를 적용합니다."}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <a
                                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
                                    href={links.kakaoGift}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => trackAffiliateClick("kakao", gift.id)}
                                  >
                                    카카오톡 선물하기
                                  </a>
                                  <a
                                    className="rounded-xl border border-zinc-200 bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    href={links.coupang}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => trackAffiliateClick("coupang", gift.id)}
                                  >
                                    쿠팡 바로가기
                                  </a>
                                  <a
                                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
                                    href={links.naverShopping}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => trackAffiliateClick("naver", gift.id)}
                                  >
                                    네이버 쇼핑
                                  </a>
                                </div>
                              </div>
                              {addon && (
                                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
                                  자동 구성 1+1: {gift.title} & {addon}
                                </div>
                              )}
                              <div className="mt-4">
                                <div className="text-sm font-semibold text-zinc-900">이유</div>
                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-700">{buildReason(gift, answers)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            {step === "start" ? null : step === "result" ? (
              <>
                <button type="button" onClick={back} className="h-11 rounded-xl bg-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-300">
                  이전
                </button>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button type="button" onClick={reset} className="h-11 rounded-xl bg-zinc-100 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200">
                    초기화
                  </button>
                  <button
                    type="button"
                    onClick={recommendAgain}
                    className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    다시 추천받기
                  </button>
                </div>
              </>
            ) : (
              <>
                <button type="button" onClick={back} className="h-11 rounded-xl bg-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-300">
                  이전
                </button>
                <button type="button" onClick={next} disabled={!canNext} className={["h-11 rounded-xl px-5 text-sm font-semibold text-white transition", canNext ? "bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-600 hover:opacity-90" : "bg-zinc-300"].join(" ")}>
                  다음으로
                </button>
              </>
            )}
          </div>
        </section>

        <footer className="text-center text-xs leading-5 text-zinc-500">
          개인정보·결제정보는 수집하지 않습니다. 제휴 구매 버튼 클릭 시 익명으로 채널·추천 ID만 기록해 CTR 분석에 쓸 수 있으며, 웹훅을 설정하지 않으면 서버에 저장되지 않습니다.
        </footer>
      </main>
    </div>
  );
}



