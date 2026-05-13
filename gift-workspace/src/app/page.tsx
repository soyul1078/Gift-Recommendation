"use client";

import { useMemo, useState } from "react";
import { OptionGrid } from "@/components/OptionGrid";
import { outboundLinks } from "@/lib/affiliateLinks";
import { buildReason, formatKRW, recommendGifts } from "@/lib/recommend";
import { trackAffiliateClick } from "@/lib/trackAffiliateClick";
import type { AgeBand, Answers, Budget, Gender, Preference, Relation } from "@/lib/types";

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
const relationOptions: readonly Relation[] = [
  "직장 상사",
  "직장 동기",
  "직장 후배",
  "퇴사자/이직자",
  "거래처",
  "부모님",
  "형제/자매",
  "배우자",
  "시댁/처가 어른",
  "정말 친한 절친",
  "가볍게 아는 지인",
  "선생님/은사님",
  "가벼운 기념일(100일 등)",
  "특별한 기념일(생일, 1주년)",
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

type StepId = "genderAge" | "relation" | "budget" | "preference" | "result";

export default function Home() {
  const [step, setStep] = useState<StepId>("genderAge");
  const [answers, setAnswers] = useState<Answers>({});

  const recommended = useMemo(() => recommendGifts(answers), [answers]);

  const canNext =
    step === "genderAge"
      ? Boolean(answers.gender && answers.age)
      : step === "relation"
        ? Boolean(answers.relation)
        : step === "budget"
          ? Boolean(answers.budget)
          : step === "preference"
            ? Boolean(answers.preferences && answers.preferences.length > 0)
            : true;

  function next() {
    if (!canNext) return;
    setStep((s) => {
      if (s === "genderAge") return "relation";
      if (s === "relation") return "budget";
      if (s === "budget") return "preference";
      if (s === "preference") return "result";
      return "result";
    });
  }

  function back() {
    setStep((s) => {
      if (s === "result") return "preference";
      if (s === "preference") return "budget";
      if (s === "budget") return "relation";
      if (s === "relation") return "genderAge";
      return "genderAge";
    });
  }

  function reset() {
    setAnswers({});
    setStep("genderAge");
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-rose-100/80 bg-white/75 shadow-sm shadow-rose-100/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 text-sm font-bold text-white shadow-lg shadow-rose-300/50">
              G
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-rose-950">
                선물 추천 워크스페이스
              </div>
              <div className="text-xs text-rose-700/70">
                고민은 줄이고 센스는 더하고, 결제는 한 번에
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-8">
        <section className="rounded-3xl border border-rose-100/90 bg-white/85 p-5 shadow-xl shadow-rose-200/30 backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-rose-950">
                {step === "genderAge" && "성별 및 연령대"}
                {step === "relation" && "나와의 관계"}
                {step === "budget" && "예산 범위"}
                {step === "preference" && "상대방 성향(복수 선택)"}
                {step === "result" && "선물 추천"}
              </div>
              <div className="mt-1 text-sm text-rose-800/75">
                카테고리를 선택하거나, 특수한 상황이면 직접 입력해도 돼요.
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100/80 hover:text-rose-950"
            >
              초기화
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-rose-950">
                직접 입력(선택)
              </span>
              <textarea
                value={answers.freeText ?? ""}
                onChange={(e) =>
                  setAnswers((p) => ({ ...p, freeText: e.target.value }))
                }
                placeholder="예: 어버이날 / 스승의 날 / 퇴사 선물 / 집들이 / 승진 / 설날 / 커피 좋아함..."
                className="min-h-[84px] w-full resize-y rounded-2xl border border-rose-100 bg-white/95 px-3 py-2 text-sm text-rose-950 shadow-inner shadow-rose-50 outline-none ring-2 ring-transparent transition focus:border-rose-200 focus:ring-rose-200/40"
              />
            </label>

            {step === "genderAge" && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="text-sm font-medium text-rose-950">성별</div>
                  <OptionGrid
                    value={answers.gender}
                    options={genderOptions}
                    onChange={(gender) => setAnswers((p) => ({ ...p, gender }))}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium text-rose-950">연령대</div>
                  <OptionGrid
                    value={answers.age}
                    options={ageOptions}
                    onChange={(age) => setAnswers((p) => ({ ...p, age }))}
                  />
                </div>
              </div>
            )}

            {step === "relation" && (
              <div className="grid gap-2">
                <div className="text-sm font-medium text-rose-950">관계</div>
                <OptionGrid
                  value={answers.relation}
                  options={relationOptions}
                  onChange={(relation) =>
                    setAnswers((p) => ({ ...p, relation }))
                  }
                />
              </div>
            )}

            {step === "budget" && (
              <div className="grid gap-2">
                <div className="text-sm font-medium text-rose-950">예산</div>
                <OptionGrid
                  value={answers.budget}
                  options={budgetOptions}
                  onChange={(budget) => setAnswers((p) => ({ ...p, budget }))}
                />
              </div>
            )}

            {step === "preference" && (
              <div className="grid gap-2">
                <div className="text-sm font-medium text-rose-950">
                  성향{" "}
                  <span className="font-normal text-rose-700/70">
                    (해당되는 항목을 모두 눌러 주세요)
                  </span>
                </div>
                <OptionGrid
                  mode="multiple"
                  values={answers.preferences ?? []}
                  options={preferenceOptions}
                  onChange={(preferences) =>
                    setAnswers((p) => ({ ...p, preferences: [...preferences] }))
                  }
                />
              </div>
            )}

            {step === "result" && (
              <div className="grid gap-4">
                {recommended.length === 0 ? (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-4 text-sm text-amber-950/90">
                    아직 조건이 충분하지 않아요. 이전 단계로 돌아가서 선택을
                    추가해 주세요.
                  </div>
                ) : (
                  <>
                    {recommended.map((gift) => {
                    const links = outboundLinks(gift.title);
                    return (
                      <div
                        key={gift.id}
                        className="rounded-3xl border border-rose-100/90 bg-gradient-to-br from-white via-rose-50/40 to-amber-50/30 p-5 shadow-md shadow-rose-100/60"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold text-rose-950">
                              {gift.title}
                            </div>
                            <div className="mt-1">
                              <div className="text-base font-semibold text-rose-900">
                                {answers.budget ?? "—"}
                              </div>
                              <div className="mt-1 text-xs leading-relaxed text-rose-700/75">
                                판매처·옵션에 따라 달라요 · 참고 시세 약{" "}
                                {formatKRW(gift.priceKRW)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <a
                              className="rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-300 px-3 py-2 text-sm font-semibold text-amber-950 shadow-sm shadow-amber-200/80 transition hover:from-amber-200 hover:to-yellow-200"
                              href={links.kakaoGift}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() =>
                                trackAffiliateClick("kakao", gift.id)
                              }
                            >
                              카카오톡 선물하기
                            </a>
                            <a
                              className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-rose-300/50 transition hover:from-rose-600 hover:to-pink-700"
                              href={links.coupang}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() =>
                                trackAffiliateClick("coupang", gift.id)
                              }
                            >
                              쿠팡 바로가기
                            </a>
                            <a
                              className="rounded-2xl border border-violet-200 bg-white/95 px-3 py-2 text-sm font-semibold text-violet-900 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
                              href={links.naverShopping}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() =>
                                trackAffiliateClick("naver", gift.id)
                              }
                            >
                              네이버 쇼핑
                            </a>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="text-sm font-semibold text-rose-950">
                            이유
                          </div>
                          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-rose-900/85">
                            {buildReason(gift, answers)}
                          </p>
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
            <button
              type="button"
              onClick={back}
              disabled={step === "genderAge"}
              className={[
                "h-11 rounded-2xl border px-4 text-sm font-semibold transition",
                step === "genderAge"
                  ? "cursor-not-allowed border-rose-100 bg-rose-50/50 text-rose-300"
                  : "border-rose-100 bg-white text-rose-950 shadow-sm hover:border-rose-200 hover:bg-rose-50",
              ].join(" ")}
            >
              이전
            </button>

            {step !== "result" ? (
              <button
                type="button"
                onClick={next}
                disabled={!canNext}
                className={[
                  "h-11 rounded-2xl px-6 text-sm font-semibold text-white shadow-lg transition",
                  canNext
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-300/50 hover:from-rose-600 hover:to-pink-600"
                    : "cursor-not-allowed bg-rose-200 text-white/90 shadow-none",
                ].join(" ")}
              >
                다음으로
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="h-11 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-300/40 transition hover:from-violet-600 hover:to-fuchsia-600"
              >
                다시 추천받기
              </button>
            )}
          </div>
        </section>

        <footer className="mt-6 text-xs leading-5 text-rose-800/55">
          개인정보·결제정보는 수집하지 않습니다. 제휴 구매 버튼 클릭 시
          익명으로 채널·추천 ID만 기록해 CTR 분석에 쓸 수 있으며, 웹훅을
          설정하지 않으면 서버에 저장되지 않습니다.
        </footer>
      </main>
    </div>
  );
}
