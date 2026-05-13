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
    <div className="min-h-full bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-3xl items-center px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-zinc-900 text-sm font-semibold text-white">
              G
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-zinc-900">
                선물 추천 워크스페이스
              </div>
              <div className="text-xs text-zinc-500">
                고민은 줄이고 센스는 더하고, 결제는 한 번에
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-8">
        <section className="rounded-2xl border bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-zinc-900">
                {step === "genderAge" && "성별 및 연령대"}
                {step === "relation" && "나와의 관계"}
                {step === "budget" && "예산 범위"}
                {step === "preference" && "상대방 성향(복수 선택)"}
                {step === "result" && "선물 추천"}
              </div>
              <div className="mt-1 text-sm text-zinc-500">
                카테고리를 선택하거나, 특수한 상황이면 직접 입력해도 돼요.
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              초기화
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-zinc-900">
                직접 입력(선택)
              </span>
              <textarea
                value={answers.freeText ?? ""}
                onChange={(e) =>
                  setAnswers((p) => ({ ...p, freeText: e.target.value }))
                }
                placeholder="예: 어버이날 / 스승의 날 / 퇴사 선물 / 집들이 / 승진 / 설날 / 커피 좋아함..."
                className="min-h-[84px] w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-400"
              />
            </label>

            {step === "genderAge" && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="text-sm font-medium text-zinc-900">성별</div>
                  <OptionGrid
                    value={answers.gender}
                    options={genderOptions}
                    onChange={(gender) => setAnswers((p) => ({ ...p, gender }))}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium text-zinc-900">연령대</div>
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
                <div className="text-sm font-medium text-zinc-900">관계</div>
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
                <div className="text-sm font-medium text-zinc-900">예산</div>
                <OptionGrid
                  value={answers.budget}
                  options={budgetOptions}
                  onChange={(budget) => setAnswers((p) => ({ ...p, budget }))}
                />
              </div>
            )}

            {step === "preference" && (
              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-900">
                  성향{" "}
                  <span className="font-normal text-zinc-500">
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
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
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
                          className="rounded-2xl border border-zinc-200 bg-white p-5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="text-lg font-semibold text-zinc-900">
                                {gift.title}
                              </div>
                              <div className="mt-1">
                                <div className="text-base font-semibold text-zinc-900">
                                  {answers.budget ?? "—"}
                                </div>
                                <div className="mt-1 text-xs leading-relaxed text-zinc-500">
                                  판매처·옵션에 따라 달라요 · 참고 시세 약{" "}
                                  {formatKRW(gift.priceKRW)}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <a
                                className="rounded-xl bg-yellow-400 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-yellow-300"
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
                                className="rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
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
                                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
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
                            <div className="text-sm font-semibold text-zinc-900">
                              이유
                            </div>
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-700">
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
                "h-11 rounded-xl px-4 text-sm font-semibold transition",
                step === "genderAge"
                  ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                  : "bg-zinc-200 text-zinc-900 hover:bg-zinc-300",
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
                  "h-11 rounded-xl px-5 text-sm font-semibold text-white transition",
                  canNext ? "bg-zinc-900 hover:bg-zinc-800" : "bg-zinc-300",
                ].join(" ")}
              >
                다음으로
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="h-11 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                다시 추천받기
              </button>
            )}
          </div>
        </section>

        <footer className="mt-6 text-xs leading-5 text-zinc-500">
          개인정보·결제정보는 수집하지 않습니다. 제휴 구매 버튼 클릭 시
          익명으로 채널·추천 ID만 기록해 CTR 분석에 쓸 수 있으며, 웹훅을
          설정하지 않으면 서버에 저장되지 않습니다.
        </footer>
      </main>
    </div>
  );
}
