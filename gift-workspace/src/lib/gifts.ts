import { primaryBudgetBandsForPrice } from "./budgetBand";
import type { Gift } from "./types";

/**
 * Representative KRW prices (typical major KR malls / official-ish, before coupons).
 * `tags.budget` is derived from these numbers so UI, filters, and links stay aligned.
 */
type GiftInput = Omit<Gift, "tags"> & {
  tags: Omit<Gift["tags"], "budget">;
};

function finalize(g: GiftInput): Gift {
  const bands = primaryBudgetBandsForPrice(g.priceKRW);
  if (!bands.length) {
    throw new Error(`gift ${g.id}: price ${g.priceKRW} fits no budget band`);
  }
  return {
    ...g,
    tags: { ...g.tags, budget: bands },
  };
}

const raw: GiftInput[] = [
  {
    id: "stanley-tumbler",
    title: "스탠리 퀜처 H2.0 텀블러 887ml",
    priceKRW: 49_000,
    shortReason:
      "국내 정가대에서 가장 많이 보이는 887ml 라인. 실용적이면서 색상 선택지도 많아요.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: [
        "10대",
        "20대 초반",
        "20대 후반",
        "30대 초반",
        "30대 후반",
        "40대",
      ],
      relation: [
        "직장 상사",
        "직장 동기",
        "직장 후배",
        "퇴사자/이직자",
        "거래처",
        "정말 친한 절친",
        "가볍게 아는 지인",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["실용성 우선", "건강/웰빙형", "특정 취미 진심형"],
    },
  },
  {
    id: "desk-mat",
    title: "프리미엄 데스크 매트",
    priceKRW: 25_900,
    shortReason:
      "대형 사이즈 기준 흔한 가격대. 책상 분위기·마우스 사용감이 바로 좋아져요.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: [
        "20대 초반",
        "20대 후반",
        "30대 초반",
        "30대 후반",
        "40대",
        "50대",
      ],
      relation: [
        "직장 상사",
        "직장 동기",
        "직장 후배",
        "퇴사자/이직자",
        "거래처",
        "선생님/은사님",
        "가볍게 아는 지인",
      ],
      preference: ["자기계발/워커홀릭", "실용성 우선"],
    },
  },
  {
    id: "perfume-hand-cream",
    title: "퍼퓸 핸드크림 세트",
    priceKRW: 21_900,
    shortReason:
      "브랜드 세트 기준으로 자주 보이는 가격대. 가벼운 답례·첫인상 선물로 부담이 적어요.",
    tags: {
      gender: ["여성", "무관"],
      age: [
        "10대",
        "20대 초반",
        "20대 후반",
        "30대 초반",
        "30대 후반",
      ],
      relation: [
        "가볍게 아는 지인",
        "정말 친한 절친",
        "퇴사자/이직자",
        "선생님/은사님",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["감성/디자인 중시", "뷰티/그루밍형"],
    },
  },
  {
    id: "wireless-charger",
    title: "맥세이프/무선 충전 스탠드",
    priceKRW: 44_900,
    shortReason:
      "애플 정품 맥세이프 충전기보다 낮고, 브랜드 스탠드 제품에서 흔한 대표가에 가깝게 맞춤.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: [
        "20대 초반",
        "20대 후반",
        "30대 초반",
        "30대 후반",
        "40대",
        "50대",
      ],
      relation: [
        "직장 상사",
        "직장 동기",
        "직장 후배",
        "거래처",
        "배우자",
        "정말 친한 절친",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["실용성 우선", "자기계발/워커홀릭"],
    },
  },
  {
    id: "tea-giftbox",
    title: "프리미엄 티/드립백 선물세트",
    priceKRW: 36_900,
    shortReason:
      "백화점·몰에서 자주 보이는 구성 기준 가격. 휴식·담소 선물로 무난해요.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: [
        "20대 후반",
        "30대 초반",
        "30대 후반",
        "40대",
        "50대",
        "60대 이상",
      ],
      relation: [
        "직장 상사",
        "직장 동기",
        "퇴사자/이직자",
        "거래처",
        "부모님",
        "시댁/처가 어른",
        "선생님/은사님",
        "가볍게 아는 지인",
      ],
      preference: ["미식가형", "건강/웰빙형", "감성/디자인 중시"],
    },
  },
  {
    id: "hobby-kit",
    title: "취미 키트(향초/가죽공예/그림 등)",
    priceKRW: 42_900,
    shortReason:
      "체험형 키트류에서 자주 보이는 중저가~중가 구간. 기억에 남는 선물로 좋아요.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: [
        "10대",
        "20대 초반",
        "20대 후반",
        "30대 초반",
        "30대 후반",
      ],
      relation: [
        "정말 친한 절친",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["특정 취미 진심형", "감성/디자인 중시"],
    },
  },
  {
    id: "massage-gun",
    title: "미니 마사지건",
    priceKRW: 89_000,
    shortReason:
      "입문형 미니 건 마사지기에서 흔한 출시가·할인 전 기준에 가깝게 맞춤.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: [
        "20대 후반",
        "30대 초반",
        "30대 후반",
        "40대",
        "50대",
        "60대 이상",
      ],
      relation: [
        "직장 상사",
        "직장 동기",
        "부모님",
        "시댁/처가 어른",
        "배우자",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["건강/웰빙형", "실용성 우선"],
    },
  },
  {
    id: "wireless-earbuds-entry",
    title: "무선 이어폰(입문형)",
    priceKRW: 119_000,
    shortReason:
      "에어팟·갤럭시 버즈 등 입문 라인에서 자주 보이는 가격대(할인 전·정가 기준).",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: [
        "10대",
        "20대 초반",
        "20대 후반",
        "30대 초반",
        "30대 후반",
        "40대",
      ],
      relation: [
        "직장 동기",
        "직장 후배",
        "정말 친한 절친",
        "배우자",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["실용성 우선", "자기계발/워커홀릭"],
    },
  },
];

export const gifts: Gift[] = raw.map(finalize);
