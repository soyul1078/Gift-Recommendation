"use client";

import { useMemo, useState } from "react";
import { OptionGrid } from "@/components/OptionGrid";
import { RelationSectionPicker } from "@/components/RelationSectionPicker";
import { outboundLinksForGift } from "@/lib/affiliateLinks";
import { priceFitsBudgetBand } from "@/lib/budgetBand";
import { buildReason, formatKRW, recommendGifts, getAddonForPreferences } from "@/lib/recommend";
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

  const RECOMMEND_LIMIT = 4;
  const recommended = useMemo(
    () => recommendGifts(answers, RECOMMEND_LIMIT, recommendSeed, excludedIds),
    [answers, recommendSeed, excludedIds],
  );
  const addon = useMemo(() => getAddonForPreferences(answers.preferences ?? []), [answers.preferences]);

  const showBudgetFallbackNote = useMemo(() => {
    const b = answers.budget;
    if (!b) return false;
    return recommended.some((g) => !priceFitsBudgetBand(g.priceKRW, b));
  }, [answers.budget, recommended]);

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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.18),_transparent_28%),linear-gradient(135deg,_#fff7ed_0%,_#fdf2f8_48%,_#f5f3ff_100%)] text-zinc-900">
      <header className="border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-600 text-sm font-semibold text-white shadow-lg">
              G
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">선물 추천 워크스페이스</div>
              <div className="text-xs text-zinc-500">고민은 줄이고 센스는 더하고, 결제는 한 번에</div>
            </div>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            AI 추천
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-2xl font-semibold text-zinc-900">
                {step === "start" && "선물 추천 시작"}
                {step === "relation" && "나와의 관계"}
                {step === "genderAge" && "성별 및 연령대"}
                {step === "budget" && "예산 범위"}
                {step === "preference" && "상대방 성향(복수 선택)"}
                {step === "result" && "선물 추천"}
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-600">
                {step === "start" && "아래 버튼을 눌러 간단한 질문으로 선물 추천을 시작하세요."}
                {step === "relation" && "카테고리를 눌러 관계를 선택해 주세요."}
                {step === "genderAge" && "선물 받을 분의 성별과 연령대를 골라 주세요."}
                {step === "budget" && "예산 범위를 선택해 주세요."}
                {step === "preference" && "해당되는 성향을 모두 선택해 주세요."}
                {step === "result" && "입력하신 조건에 맞는 선물이에요."}
              </div>
            </div>

            <div className="w-full max-w-[280px] rounded-2xl border border-zinc-200 bg-zinc-50/90 p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm text-zinc-600">
                <span>진행도</span>
                <span className="font-semibold text-zinc-900">{progressLabel}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-zinc-200">
                <div className="h-2 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-600 transition-all" style={{ width: progressWidth }} />
              </div>
              <div className="mt-3 text-sm text-zinc-500">{step === "result" ? "추천 완료" : "다음 질문만 남았어요"}</div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-amber-50/70 p-4 shadow-inner sm:p-6">
            {step === "start" && (
              <div className="grid gap-5 rounded-[24px] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-violet-50 p-6 text-center shadow-sm">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-600 text-3xl text-white shadow-lg">
                  ✨
                </div>
                <div>
                  <div className="text-2xl font-semibold text-zinc-900">선물 추천을 시작해 볼까요?</div>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
                    성별과 연령대를 먼저 선택한 후, 상대방과의 관계와 예산, 성향을 입력하면 최적의 선물을 제안해 드립니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("genderAge")}
                  className="mx-auto inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  시작하기
                </button>
              </div>
            )}

            {step === "relation" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-sm font-semibold text-zinc-900">관계를 선택해 주세요</div>
                  <p className="mt-1 text-sm text-zinc-500">가장 자연스러운 선물 포인트가 보이도록 관계를 골라주세요.</p>
                </div>
                <RelationSectionPicker
                  value={answers.relation}
                  onChange={(relation) => setAnswers((p) => ({ ...p, relation }))}
                />
              </div>
            )}

            {step === "genderAge" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-sm font-semibold text-zinc-900">누구에게 선물할지 먼저 알려주세요</div>
                  <p className="mt-1 text-sm text-zinc-500">성별과 연령대를 선택하면 더 정확한 추천이 가능해요.</p>
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
                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-sm font-semibold text-zinc-900">예산 범위를 정해 주세요</div>
                  <p className="mt-1 text-sm text-zinc-500">예산대에 맞춰 현실적인 추천을 보여드릴게요.</p>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-semibold text-zinc-900">예산</div>
                  <OptionGrid value={answers.budget} options={budgetOptions} onChange={(budget) => setAnswers((p) => ({ ...p, budget }))} />
                </div>
              </div>
            )}

            {step === "preference" && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm">
                  <div className="text-sm font-semibold text-zinc-900">상대방의 성향을 골라 주세요</div>
                  <p className="mt-1 text-sm text-zinc-500">여러 개를 선택하면 더 잘 맞는 선물을 찾아드릴 수 있어요.</p>
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
                {recommended.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-700 shadow-sm">
                    아직 조건이 충분하지 않아요. 이전 단계로 돌아가서 선택을 추가해 주세요.
                  </div>
                ) : (
                  <>
                    {showBudgetFallbackNote && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950 shadow-sm">
                        이 예산 구간에 맞는 대표 상품이 카탈로그에 없어, 가장 가까운 추천을 보여 드려요. 가격은 아래 표기(대표 소비자가)를 참고해 주세요.
                      </div>
                    )}
                    {recommended.map((gift) => {
                      const links = outboundLinksForGift(gift);
                      return (
                        <div key={gift.id} className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="max-w-2xl">
                              <div className="text-lg font-semibold text-zinc-900">{gift.title}</div>
                              <div className="mt-2 space-y-1">
                                <div className="text-2xl font-bold tracking-tight text-zinc-900">{formatKRW(gift.priceKRW)}</div>
                                <div className="text-sm font-medium text-zinc-600">선택 예산: {answers.budget ?? "—"}</div>
                                <div className="text-xs leading-relaxed text-zinc-500">
                                  위 금액은 국내 주요 몰 기준 대표 소비자가예요. 구매 버튼은 이 가격대에 맞춰 검색·필터를 적용해요. 옵션·할인·배송비에 따라 결제가는 조금 달라질 수 있어요.
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <a className="rounded-xl bg-yellow-400 px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-yellow-300" href={links.kakaoGift} target="_blank" rel="noreferrer" onClick={() => trackAffiliateClick("kakao", gift.id)}>
                                카카오톡 선물하기
                              </a>
                              <a className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800" href={links.coupang} target="_blank" rel="noreferrer" onClick={() => trackAffiliateClick("coupang", gift.id)}>
                                쿠팡 바로가기
                              </a>
                              <a className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50" href={links.naverShopping} target="_blank" rel="noreferrer" onClick={() => trackAffiliateClick("naver", gift.id)}>
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
                <button type="button" onClick={reset} className="h-11 rounded-xl bg-zinc-100 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200">
                  초기화
                </button>
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



