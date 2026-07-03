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
  // --- High-end single items (top 1%) ---
  {
    id: "lv-pocket-organizer",
    title: "루이비통 가죽 포켓 오거나이저",
    priceKRW: 450_000,
    shortReason: "루이비통의 고급 가죽 포켓 오거나이저는 실용적이면서도 명품 감성을 전달합니다.",
    brandUrl: "https://kr.louisvuitton.com/kor-kr/products/",
    tags: {
      gender: ["남성", "무관"],
      age: ["30대 초반", "30대 후반", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["실용성 우선", "감성/디자인 중시"],
    },
  },
  {
    id: "dior-oblique-wallet",
    title: "디올 오블리크 자카드 반지갑",
    priceKRW: 420_000,
    shortReason: "디올의 시그니처 패턴을 살린 고급 반지갑으로 선물 가치가 높습니다.",
    brandUrl: "https://www.dior.com/ko_kr",
    tags: {
      gender: ["남성", "무관"],
      age: ["20대 후반", "30대 초반", "30대 후반", "40대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시", "실용성 우선"],
    },
  },
  {
    id: "tag-heuer-aquaracer",
    title: "태그호이어 아쿠아레이서 프로페셔널",
    priceKRW: 2_800_000,
    shortReason: "하이엔드 스포츠 워치로 만족도가 높고 오랫동안 간직하기 좋은 아이템입니다.",
    brandUrl: "https://www.tagheuer.com/ko-kr",
    tags: {
      gender: ["남성"],
      age: ["30대 초반", "30대 후반", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["실용성 우선", "감성/디자인 중시"],
    },
  },
  {
    id: "chanel-coco-crush-ring",
    title: "샤넬 코코 크러쉬 링 미디움",
    priceKRW: 1_200_000,
    shortReason: "파인 주얼리로서 기념일 선물에 적합한 샤넬의 아이코닉 링입니다.",
    brandUrl: "https://www.chanel.com/kr/",
    tags: {
      gender: ["여성"],
      age: ["20대 후반", "30대 초반", "30대 후반", "40대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시", "뷰티/그루밍형"],
    },
  },
  {
    id: "dior-prestige-cream",
    title: "디올 프레스티지 라 크렘",
    priceKRW: 350_000,
    shortReason: "럭셔리 스킨케어로 특별한 사람에게 주기 좋은 고급 아이템입니다.",
    brandUrl: "https://www.dior.com/ko_kr",
    tags: {
      gender: ["여성"],
      age: ["30대 초반", "30대 후반", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"] as any,
      preference: ["뷰티/그루밍형", "감성/디자인 중시"],
    },
  },
  {
    id: "burberry-trench-coat",
    title: "버버리 클래식 트렌치코트",
    priceKRW: 1_150_000,
    shortReason: "정통 하이엔드 클래식 트렌치로 특별한 날에 어울리는 럭셔리 패션 선물입니다.",
    brandUrl: "https://www.burberry.com/",
    tags: {
      gender: ["여성", "남성"],
      age: ["20대 후반", "30대 초반", "30대 후반", "40대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시", "뷰티/그루밍형"],
    },
  },
  {
    id: "royal-copenhagen-tea",
    title: "로얄 코펜하겐 티 컬렉션",
    priceKRW: 220_000,
    shortReason: "하이엔드 식기·홈웨어로 집들이나 기념일에 어울리는 고급 선물입니다.",
    brandUrl: "https://www.royalcopenhagen.com/",
    tags: {
      gender: ["무관"],
      age: ["30대 초반", "30대 후반", "40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시", "미식가형"],
    },
  },
  {
    id: "gucci-marmont-card-case",
    title: "구찌 마몽 GG 가죽 카드 케이스",
    priceKRW: 260_000,
    shortReason: "실용적이면서도 명품 포인트를 줄 수 있는 가죽 카드 케이스입니다.",
    brandUrl: "https://www.gucci.com/kr/ko/",
    tags: {
      gender: ["무관"],
      age: ["20대 후반", "30대 초반", "30대 후반", "40대"],
      relation: ["정말 친한 절친", "배우자", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시", "실용성 우선"],
    },
  },

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



