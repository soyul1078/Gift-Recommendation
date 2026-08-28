import { primaryBudgetBandsForPrice } from "./budgetBand";
import type { Gift } from "./types";


/**
 * Representative KRW prices (typical major KR malls / official-ish, before coupons).
 * `tags.budget` is derived from these numbers so UI, filters, and links stay aligned.
 *
 * shortReason에는 구체적 금액을 쓰지 않는다. 가격은 priceKRW 필드로만 표시한다.
 * 쿠팡 가격은 쿠폰·시즌에 따라 수시로 바뀌므로 설명에 박아두면 금방 어긋난다.
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
    id: "dior-oblique-wallet",
    title: "디올 30 몽테뉴 로투스 3단 반지갑",
    priceKRW: 336_000,
    shortReason: "디올의 시그니처 패턴을 살린 고급 반지갑으로 선물 가치가 높습니다.",
    brandUrl: "https://www.dior.com/ko_kr",
    affiliateUrls: {
      naverShopping: "https://search.shopping.naver.com/search/all?query=%EB%94%94%EC%98%AC+30+%EB%AA%BD%ED%85%8C%EB%89%B4+%EB%A1%9C%ED%88%AC%EC%8A%A4+3%EB%8B%A8+%EB%B0%98%EC%A7%80%EA%B0%91",
      coupang:
        "https://link.coupang.com/a/fPloBte2Ro",
      kakaoGift: "https://gift.kakao.com/search/result?query=%EB%94%94%EC%98%AC%2030%20%EB%AA%BD%ED%85%8C%EB%89%B4%20%EB%A1%9C%ED%88%AC%EC%8A%A4%203%EB%8B%A8%20%EB%B0%98%EC%A7%80%EA%B0%91&searchType=search_related_keyword_search_box",
    },
    tags: {
      gender: ["남성", "무관"],
      age: ["20대", "30대", "40대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시", "실용성 우선"],
    },
  },
  {
    id: "dior-prestige-cream",
    title: "디올 프레스티지 라 크렘",
    priceKRW: 350_000,
    shortReason: "럭셔리 스킨케어로 특별한 사람에게 주기 좋은 고급 아이템입니다.",
    brandUrl: "https://www.dior.com/ko_kr",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPmnriufTg",
    },
    tags: {
      gender: ["여성"],
      age: ["30대", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"] as any,
      preference: ["뷰티/그루밍형", "감성/디자인 중시"],
    },
  },
  {
    id: "chanel-no1-camellia-lotion-serum-set",
    title: "샤넬 N°1 DE CHANEL 레드 까멜리아 에센스 로션&세럼 2종 세트",
    priceKRW: 369_000,
    shortReason: "샤넬 시그니처 까멜리아 성분의 로션&세럼 2종 세트로, 럭셔리 스킨케어를 선물하고 싶은 분께 좋은 고급 아이템입니다.",
    brandUrl: "https://www.chanel.com/kr/",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPmvQGQ0oC",
    },
    tags: {
      gender: ["여성"],
      age: ["30대", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["뷰티/그루밍형", "감성/디자인 중시"],
    },
  },
  {
    id: "royal-copenhagen-tea",
    title: "로얄 코펜하겐 티 컬렉션",
    priceKRW: 220_000,
    shortReason: "하이엔드 식기·홈웨어로 집들이나 기념일에 어울리는 고급 선물입니다.",
    brandUrl: "https://www.royalcopenhagen.com/",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPmAwZoh3s",
    },
    tags: {
      gender: ["무관"],
      age: ["30대", "40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시"],
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
      age: ["20대", "30대", "40대"],
      relation: ["정말 친한 절친", "배우자", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시", "실용성 우선"],
    },
  },

  {
    id: "stanley-tumbler",
    title: "스탠리 퀜처 H2.0 플로우 스테이트 텀블러",
    priceKRW: 49_000,
    shortReason:
      "국내 정가대에서 가장 많이 보이는 887ml 라인. 여행·캠핑에 들고 다니기 좋고 실용적이면서 색상 선택지도 많아요.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPmKtXcOSy",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
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
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "desk-mat",
    title: "프리미엄 데스크 매트",
    priceKRW: 25_900,
    shortReason:
      "대형 사이즈 기준 흔한 가격대. 책상 분위기·마우스 사용감이 바로 좋아져요.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPmRyD5DKm",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
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
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPmXaRIQsC",
    },
    tags: {
      gender: ["여성", "무관"],
      age: ["10대", "20대", "30대"],
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
    title: "무선충전기 아이폰 애플워치 에어팟 고속충전",
    priceKRW: 18_800,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/18e7/d5022048da9c9afdb70dce755b5f778c2e9bcb553123c3ff76836e2a7636.jpg",
    shortReason:
      "애플 정품 맥세이프 충전기보다 낮고, 브랜드 스탠드 제품에서 흔한 대표가에 가깝게 맞춤.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPm2xRXOV2",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
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
    title: "오설록 오 땡큐 티 선물세트, 티박스 6종, 1개",
    priceKRW: 60_260,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/d3fb/15722ce98d87564ddbffa56f6605ae87ade385cf3fe186b0fc86d00354e1.png",
    shortReason:
      "백화점·몰에서 자주 보이는 구성 기준 가격. 휴식·담소 선물로 무난해요.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPm7lVUNci",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
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
      preference: ["건강/웰빙형", "감성/디자인 중시"],
    },
  },
  {
    id: "hobby-kit",
    title: "미니 아트 도자기 만들기 DIY",
    priceKRW: 41_000,
    shortReason:
      "체험형 키트류에서 자주 보이는 중저가~중가 구간. 기억에 남는 선물로 좋아요.",
    excludedRelations: ["직장 상사", "선생님/은사님", "스승의날"],
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPnbIe2vFA",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대"],
      relation: [
        "정말 친한 절친",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "miniature-craft-kit",
    title: "미니어처 만들기 키트",
    priceKRW: 58_900,
    shortReason:
      "취미 활동을 즐기는 분께 5~10만 원대에 잘 맞는 미니어처 DIY 키트입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPngykhgNo",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
      relation: [
        "정말 친한 절친",
        "자녀",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "malang-squishy",
    title: "슬라임 랜덤박스",
    priceKRW: 47_600,
    shortReason: "간단한 취미/스트레스 해소용 슬라임 랜덤박스입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPnpLOLGoK",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["정말 친한 절친", "자녀", "가벼운 기념일(100일 등)", "특별한 기념일(생일, 1주년)"],
      preference: [],
    },
  },
  {
    id: "miniature-supplies-kit",
    title: "미니어처 공예 세트",
    priceKRW: 63_800,
    shortReason:
      "취미 활동 성향을 가진 분께 좋은 5~10만 원대 미니어처 공예 세트입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8485137127?itemId=12381363424&vendorItemId=79651074825&q=%EB%AF%B8%EB%8B%88%EC%96%B4%EC%B3%90+%EB%A7%8C%EB%93%A4%EA%B8%B0&searchId=07f6ddcc6240921&sourceType=search&itemsCount=60&searchRank=2&rank=2&traceId=mrd1i04l",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
      relation: [
        "정말 친한 절친",
        "자녀",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "miniature-assembly-kit",
    title: "미니어처 DIY 세트",
    priceKRW: 67_900,
    shortReason:
      "취미 활동을 즐기는 분께 추천하는 5~10만 원대 미니어처 DIY 세트입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8485577245?itemId=24868773397&vendorItemId=91875732291&sourceType=srp_product_ads&clickEventId=20555000-7b53-11f1-9b89-bc447aad98d3&korePlacement=15&koreSubPlacement=1&traceId=mrd1gnn6",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
      relation: [
        "정말 친한 절친",
        "자녀",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "miniature-beginner-kit",
    title: "미니어처 소품 만들기 키트 (입문형)",
    priceKRW: 19_900,
    shortReason: "가벼운 마음으로 시작하기 좋은 입문형 미니어처 키트로, 취미 삼아 손으로 만드는 걸 좋아하는 분께 부담 없는 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대"],
      relation: [
        "정말 친한 절친",
        "자녀",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "lego-ideas-series-set",
    title: "레고 아이디어스 시리즈 조립세트",
    priceKRW: 129_000,
    shortReason: "완성 후 인테리어 소품으로도 손색없는 레고 아이디어스 시리즈로, 조립·수집을 즐기는 분께 좋은 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
      relation: [
        "정말 친한 절친",
        "자녀",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "miniature-dollhouse-deluxe-set",
    title: "미니어처 돌하우스 조명 포함 디럭스 세트",
    priceKRW: 179_000,
    shortReason: "조명까지 들어가는 디럭스 구성의 미니어처 돌하우스로, 완성했을 때 만족도가 높은 취미 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
      relation: [
        "정말 친한 절친",
        "자녀",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "lego-creator-expert-series",
    title: "레고 크리에이터 엑스퍼트 시리즈",
    priceKRW: 259_000,
    shortReason: "디테일이 살아있는 레고 크리에이터 엑스퍼트 시리즈로, 조립 취미를 진지하게 즐기는 분께 어울리는 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
      relation: ["정말 친한 절친", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "lego-architecture-landmark-series",
    title: "레고 아키텍처 랜드마크 시리즈 (대형)",
    priceKRW: 399_000,
    shortReason: "유명 건축물을 정교하게 재현한 대형 레고 아키텍처 시리즈로, 조립 취미가 확고한 분께 특별한 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: ["정말 친한 절친", "배우자", "특별한 기념일(생일, 1주년)"],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "lego-technic-premium-large-set",
    title: "레고 테크닉 프리미엄 대형 세트",
    priceKRW: 599_000,
    shortReason: "기계 구조까지 정교하게 구현한 레고 테크닉 대형 세트로, 조립 취미에 진심인 분께 최고급 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: ["정말 친한 절친", "배우자", "특별한 기념일(생일, 1주년)"],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "lego-collectors-edition-flagship",
    title: "레고 컬렉터스 에디션 플래그십 세트",
    priceKRW: 899_000,
    shortReason: "브랜드 최상위 라인의 대형 컬렉터스 에디션으로, 조립 취미를 오래 즐겨온 분께 드리는 최고급 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["미니어처/DIY형"],
    },
  },
  {
    id: "massage-gun",
    title: "인사이디 무선 전동 미니 마사지건",
    priceKRW: 18_830,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/1025_amir_coupang_oct_80k/40d5/91c3804740c926bde075109da8d7fc620d6a8b609aa17666c9ed3ec607d2.jpg",
    shortReason:
      "어깨와 허리 통증을 일상에서 해소하는, 부피가 작아 실사용률이 높은 검증된 효도 아이템입니다.",
    parentValue: ["몸에 도움", "오래 사용"],
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/7937124717?itemId=21849951719&vendorItemId=86420134711&pickType=COU_PICK&q=%EB%AF%B8%EB%8B%88%EB%A7%88%EC%82%AC%EC%A7%80%EA%B1%B4&searchId=1cbd6d402413143&sourceType=search&itemsCount=60&searchRank=2&rank=2&traceId=mt26kp34",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
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
  // --- 부모님(40~60대) 맞춤: 몸에 도움 / 오래 사용 / 가족 경험 3대 가치 검증 카탈로그 ---
  {
    id: "parent-health-supplement-set",
    title: "홍삼·오메가3 건강기능식품 세트",
    priceKRW: 89_000,
    shortReason:
      "관절 및 피로 관리에 실질적인 도움을 주며 고급 포장으로 호불호가 없는 베스트 효도 선물입니다.",
    parentValue: ["몸에 도움"],
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/np/search?q=%ED%99%8D%EC%82%BC%20%EC%98%A4%EB%A9%94%EA%B0%803%20%EA%B1%B4%EA%B0%95%EA%B8%B0%EB%8A%A5%EC%8B%9D%ED%92%88%20%EC%84%A0%EB%AC%BC%EC%84%B8%ED%8A%B8",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "어버이날"],
      preference: ["건강/웰빙형", "실용성 우선"],
    },
  },
  {
    id: "parent-air-purifier-humidifier",
    title: "가습 겸용 소형 공기청정기",
    priceKRW: 129_000,
    shortReason:
      "미세먼지와 실내 건조함을 해결해 생활의 질과 호흡기 건강을 쾌적하게 지켜주는 실용 가전입니다.",
    parentValue: ["몸에 도움", "오래 사용"],
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPnZRFB6m4",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른"],
      preference: ["건강/웰빙형", "실용성 우선"],
    },
  },
  {
    id: "parent-capsule-coffee-machine",
    title: "원터치 캡슐 커피머신",
    priceKRW: 149_000,
    shortReason:
      "부모님이 집에서 편리하게 홈카페를 즐기며 일상의 여유와 힐링 시간을 나눌 수 있는 조작이 쉬운 원터치 캡슐 머신입니다.",
    parentValue: ["오래 사용", "가족 경험"],
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPn7fRu6IS",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["30대", "40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "배우자"],
      preference: ["실용성 우선"],
    },
  },
  {
    id: "parent-hotspring-healing-trip",
    title: "1박 2일 국내 온천 힐링 투어권",
    priceKRW: 259_000,
    shortReason:
      "일정을 잡기 수월하고 체력 부담이 적은 온천·힐링 투어로, 일상의 스트레스를 해소하고 가족 관계를 더욱 돈독하게 만들어주는 평생 기억에 남는 추억 선물입니다.",
    parentValue: ["가족 경험"],
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "어버이날"],
      preference: ["레저/캠핑형", "감성/디자인 중시"],
    },
  },
  {
    id: "parent-dining-department-voucher",
    title: "프리미엄 한우 다이닝·백화점 상품권",
    priceKRW: 100_000,
    shortReason:
      "호불호가 전혀 없으며 만족도를 최고 수준으로 즉각 체감할 수 있는, 가장 현실적인 프리미엄 기프트입니다.",
    parentValue: ["가족 경험", "몸에 도움"],
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "어버이날"],
      preference: ["실용성 우선"],
    },
  },
  {
    id: "parent-gongjindan",
    title: "공진단",
    priceKRW: 329_900,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/f503/02ceab55124b04b790f7d0e5b8d87dea58e1a4384b3783ca91f8e18f71af.jpg",
    shortReason:
      "면역력과 기력 보충에 좋은 전통 건강 선물로, 부담 없이 챙겨드릴 수 있는 실속 구성이에요.",
    parentValue: ["몸에 도움"],
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/5528234235?itemId=8666959215&vendorItemId=75954126623&q=%EA%B3%B5%EC%A7%84%EB%8B%A8&searchId=bb8046762641570&sourceType=search&itemsCount=60&searchRank=0&rank=0&traceId=mt26x3r7",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "어버이날"],
      preference: ["건강/웰빙형", "실용성 우선"],
    },
  },
  {
    id: "parent-ginseng-stick",
    title: "정관장 홍삼진고 바이탈스틱 (쇼핑백 포함)",
    priceKRW: 34_000,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/image_audit/prod/fa279752-94cd-487d-b85a-8737f08079bf_fixing_v2.png",
    shortReason:
      "휴대와 섭취가 간편한 정관장 정품 홍삼진고 바이탈스틱으로, 쇼핑백이 포함되어 바로 전달하기 좋아요.",
    parentValue: ["몸에 도움"],
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8297839707?itemId=23934641451&vendorItemId=90956614459&q=%EC%A0%95%EA%B4%80%EC%9E%A5+%ED%99%8D%EC%82%BC+%EC%8A%A4%ED%8B%B1&searchId=146e61b19936330&sourceType=search&itemsCount=36&searchRank=2&rank=2&traceId=mrrope6y",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "어버이날"],
      preference: ["건강/웰빙형", "실용성 우선"],
    },
  },
  {
    id: "jkj-chimhyanghwan-gold",
    title: "종근당 침향환 골드",
    priceKRW: 63_000,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/retail/images/33305798274524-92acde7d-0396-4c04-8ca3-80c741e172e7.jpg",
    shortReason:
      "면역력과 기력 보충에 좋은 침향환으로, 225g 구성으로 부담 없이 챙겨드릴 수 있는 전통 건강 선물입니다.",
    parentValue: ["몸에 도움"],
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8203535204?itemId=476855525&vendorItemId=4196527902&pickType=COU_PICK&q=%EC%A2%85%EA%B7%BC%EB%8B%B9+%EC%B9%A8%ED%96%A5%ED%99%98+%EA%B3%A8%EB%93%9C&searchId=50e242113079907&sourceType=search&itemsCount=60&searchRank=0&rank=0&traceId=mt26y4n6",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "어버이날"],
      preference: ["건강/웰빙형", "실용성 우선"],
    },
  },
  {
    id: "sanseoham-811",
    title: "산서함 811",
    priceKRW: 103_800,
    shortReason:
      "# 인삼정과 콩고물 도라지정과 도라지청 천혜향정과 생강편강 이바지음식 세트",
    parentValue: ["몸에 도움", "가족 경험"],
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPozaFGw7U",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "어버이날"],
      preference: ["건강/웰빙형"],
    },
  },
  {
    id: "wireless-earbuds-entry",
    title: "무선 이어폰(입문형)",
    priceKRW: 119_000,
    shortReason:
      "에어팟·갤럭시 버즈 등 입문 라인에서 자주 보이는 가격대(할인 전·정가 기준).",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPoFPJ1aOO",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
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
  {
    id: "wireless-earbuds-used",
    title: "무선 이어폰(중고)",
    badge: "중고",
    priceKRW: 89_000,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/ff9c/b57f70c2bc435e026785f6398180cdf5fb2f2b0e380375ac483c1a1cce9f.png",
    shortReason:
      "가성비를 중요하게 생각하는 분께 잘 맞는 중고 무선 이어폰입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8427819177?itemId=24379702680&vendorItemId=94887813438&q=%EB%AC%B4%EC%84%A0+%EC%9D%B4%EC%96%B4%ED%8F%B0%28%EC%9E%85%EB%AC%B8%ED%98%95%29&searchId=48ca1d742073263&sourceType=search&itemsCount=34&searchRank=1&rank=1&traceId=mrd0rch5",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
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
  // --- 취향 세부 카테고리 보강: 레저/캠핑, 집돌이/홈힐링, 음식(디저트·식사/간식) ---
  {
    id: "camping-lantern-table-set",
    title: "캠핑 랜턴 & 미니 테이블 세트",
    priceKRW: 55_000,
    shortReason:
      "야외 캠핑·차박에서 바로 쓰기 좋은 랜턴과 접이식 미니 테이블 구성으로, 아웃도어 활동을 즐기는 분께 실용적인 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/np/search?q=%EC%BA%A0%ED%95%91%20%EB%9E%9C%ED%84%B4%20%EB%AF%B8%EB%8B%88%20%ED%85%8C%EC%9D%B4%EB%B8%94%20%EC%84%B8%ED%8A%B8",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "reading-light-diffuser-set",
    title: "북라이트 & 아로마 디퓨저 세트",
    priceKRW: 59_900,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/image_audit/stage/manual/5806b4d23dca1b0fa77b3fdfba9192d1af218c97eaef3662697129f28ab7_1781744019902.jpg",
    shortReason:
      "집에서 책 읽고 쉬는 시간을 좋아하는 분께 잘 맞는 독서등(북라이트)과 아로마 디퓨저 구성의 홈힐링 아이템입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPoZM1eadw",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
        "자녀",
      ],
      preference: ["독서형", "건강/웰빙형"],
    },
  },
  {
    id: "macaron-cake-jelly-dessert-box",
    title: "마카롱·케이크·젤리 디저트 박스",
    priceKRW: 32_000,
    shortReason:
      "마카롱, 미니 케이크, 젤리 등을 골고루 담은 디저트 박스로, 달콤한 간식을 좋아하는 분께 부담 없이 건네기 좋아요.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPo3NopTiu",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
  {
    id: "premium-snack-mealkit-set",
    title: "프리미엄 간식·밀키트 세트",
    priceKRW: 45_000,
    shortReason:
      "한 끼 식사나 든든한 간식을 중요하게 여기는 분께 어울리는 정찬 밀키트·프리미엄 간식 구성입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/np/search?q=%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%84%20%EB%B0%80%ED%82%A4%ED%8A%B8%20%EC%84%A0%EB%AC%BC%EC%84%B8%ED%8A%B8",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: [
        "직장 상사",
        "직장 동기",
        "거래처",
        "부모님",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
  {
    id: "aubriez-leather-book-cover",
    title: "오브리즈 공방 클래식 가죽 북커버 (A5/B6 다이어리 커버)",
    priceKRW: 14_800,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/93b5/906a9d3a92e2da9456d1b425a23df3165f26ea913a8d89c3922d4dc22f02.jpg",
    shortReason:
      "책과 다이어리를 즐겨 쓰는 집돌이·홈힐링형에게 잘 어울리는 클래식 가죽 북커버로, 감성 있게 노트를 보호해줍니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPpp4HVcHI",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["독서형"],
    },
  },
  {
    id: "wood-metal-lucky-bookmark",
    title: "고급 책갈피 행운 북마크 (우드·메탈 북클립/북스토퍼)",
    priceKRW: 20_000,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/9c9e/20bf82cf4a9ad52bf1a5145a02821da6c6f78df933e64730145ef5e722bc.png",
    shortReason:
      "우드·메탈 소재의 고급 책갈피 겸 북클립으로, 독서를 즐기는 집돌이·홈힐링형에게 실용적이면서도 감성 있는 선물이 됩니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPpGK4BGdE",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["독서형"],
    },
  },
  {
    id: "calligraphy-feather-pen-set",
    title: "고급 깃털펜 캘리그라피 세트 (펜촉 교체형, 잉크 포함)",
    priceKRW: 15_900,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/845e/be81bac0a60208aacbcc72995b7f3952042e77776cbc07b5652c9e8f63f6.jpg",
    shortReason:
      "펜촉 교체형 깃털펜과 잉크가 함께 구성된 캘리그라피 세트로, 감성 있는 선물용 필기구를 찾는 분께 잘 어울립니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/9027906060?itemId=26479151785&vendorItemId=94154643483&sourceType=srp_product_ads&clickEventId=bbe9e7c0-83f9-11f1-924a-cce13befd0d3&korePlacement=15&koreSubPlacement=5&clickEventId=bbe9e7c0-83f9-11f1-924a-cce13befd0d3&korePlacement=15&koreSubPlacement=5&traceId=mrsrrwmv",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
        "선생님/은사님",
        "스승의날",
      ],
      preference: ["감성/디자인 중시"],
    },
  },
  {
    id: "wood-pen-glass-inkwell-set",
    title: "우드펜 + 글라스 잉크웰 세트",
    priceKRW: 108_000,
    shortReason:
      "원목 펜과 유리 잉크웰로 구성된 프리미엄 필기구 세트로, 격을 갖춰야 하는 자리에 어울리는 감성 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPpRnCgQeW",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "직장 상사",
        "거래처",
        "정말 친한 절친",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["감성/디자인 중시"],
    },
  },
  {
    id: "mood-lamp-wireless-nightlight",
    title: "감성 무드등 인테리어 조명 (무선 수면등)",
    priceKRW: 59_900,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/8b45/28da63f94cb5431c75758f2ea9ccf9e5547de29ba57086a7eb079dd9a433.png",
    shortReason:
      "코드 없이 어디든 둘 수 있는 무선 무드등으로, 은은한 감성 인테리어 소품을 좋아하는 분께 좋은 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPpXyAyuPI",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["감성/디자인 중시"],
    },
  },
  {
    id: "artemide-nessino-table-lamp",
    title: "아르떼미데 네시노 전기스탠드",
    priceKRW: 332_100,
    shortReason:
      "이탈리아 디자인 브랜드 아르떼미데의 시그니처 테이블 램프로, 인테리어 감각이 있는 분께 특별한 감성 선물이 됩니다.",
    imageUrl: "https://media.royaldesign.com/2/artemide-nessino-table-lamp-60",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPp6VumAJE",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["배우자", "정말 친한 절친", "부모님", "시댁/처가 어른", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시"],
    },
  },
  {
    id: "louis-poulsen-ph5-pendant-lamp",
    title: "루이스 폴센 PH5 펜던트 조명 (북유럽 인테리어 식탁등)",
    priceKRW: 105_710,
    shortReason:
      "북유럽 인테리어의 상징적인 루이스 폴센 PH5 펜던트 조명으로, 집 분위기를 중요하게 여기는 분께 어울리는 감성 선물입니다.",
    imageUrl:
      "https://dam.louispoulsen.dk/DigizuiteCore/LegacyService/api/assetstream/9846/50422.webp",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPqePvAobQ",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["배우자", "정말 친한 절친", "부모님", "시댁/처가 어른", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시"],
    },
  },
  {
    id: "authentic-road-bike",
    title: "어센틱 로드자전거",
    priceKRW: 189_340,
    shortReason:
      "라이딩을 즐기거나 운동을 시작하려는 분께 좋은 로드자전거로, 건강·웰빙 성향의 선물로 잘 맞습니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPqhV8Yw8q",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대"],
      relation: [
        "정말 친한 절친",
        "자녀",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["건강/웰빙형"],
    },
  },
  {
    id: "samsung-galaxy-watch-8",
    title: "삼성전자 갤럭시워치 8 스마트워치 (SM-L320N)",
    priceKRW: 398_000,
    shortReason:
      "심박수·수면·운동량을 챙겨주는 갤럭시워치 8로, 건강·웰빙을 중요하게 여기는 분께 실용적인 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPqqAyvBTw",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "배우자",
        "정말 친한 절친",
        "부모님",
        "자녀",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["건강/웰빙형", "실용성 우선"],
    },
  },
  {
    id: "daicoo-bluetooth-smartwatch",
    title: "DAICOO 다이코 통화가능 GPS 블루투스 스마트워치 42mm R8",
    priceKRW: 18_900,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/5f20/fb0c4642f019713b5a366a9bfc76c4d80c45c59aa9e4f5bc7f6abdd544de.jpg",
    shortReason:
      "통화 기능과 GPS를 지원하는 보급형 블루투스 스마트워치로, 부담 없이 건강 관리를 시작하기 좋은 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPqu83INgq",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "가볍게 아는 지인",
        "직장 동기",
        "자녀",
        "가벼운 기념일(100일 등)",
      ],
      preference: ["건강/웰빙형", "실용성 우선"],
    },
  },
  {
    id: "yoga-mat-pilates-hometraining-set",
    title: "요가매트 필라테스 홈트레이닝 세트",
    priceKRW: 39_000,
    shortReason: "요가매트·저항밴드·폼롤러가 함께 구성된 홈트레이닝 세트로, 운동을 시작하려는 분께 부담 없는 건강 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPqAS7HK44",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "가볍게 아는 지인",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["건강/웰빙형"],
    },
  },
  {
    id: "neck-shoulder-low-frequency-massager",
    title: "가정용 목·어깨 저주파 마사지기",
    priceKRW: 219_000,
    shortReason: "목과 어깨 뭉침을 집에서 관리할 수 있는 저주파 마사지기로, 몸 상태를 챙겨주고 싶은 분께 실용적인 건강 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["30대", "40대", "50대", "60대 이상"],
      relation: [
        "부모님",
        "시댁/처가 어른",
        "배우자",
        "직장 상사",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["건강/웰빙형"],
    },
  },
  {
    id: "premium-shiatsu-massage-cushion",
    title: "프리미엄 전동 안마의자 쿠션 (등·목 통합형)",
    priceKRW: 549_000,
    shortReason: "의자에 놓고 쓰는 전동 안마 쿠션으로, 안마의자보다 부담 없이 매일 관리할 수 있는 고급 건강 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "배우자", "특별한 기념일(생일, 1주년)"],
      preference: ["건강/웰빙형"],
    },
  },
  {
    id: "home-training-treadmill",
    title: "브랜드 홈트레이닝 러닝머신",
    priceKRW: 890_000,
    shortReason: "접이식으로 공간을 적게 차지하는 가정용 러닝머신으로, 건강 관리를 꾸준히 하고 싶은 분께 최고의 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPqIlYmV3s",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: ["배우자", "부모님", "특별한 기념일(생일, 1주년)"],
      preference: ["건강/웰빙형"],
    },
  },
  {
    id: "famille-milk-cake-frozen",
    title: "파미유 떠먹는 우유케익 (냉동, 150g x 2개)",
    priceKRW: 10_000,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/retail/images/2019/08/13/17/7/4c8a16af-4536-4124-a750-101acbbac678.jpg",
    shortReason:
      "떠먹는 우유케익 2개 구성으로, 부담 없이 건네기 좋은 디저트 간식 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPqQSwjVzE",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
  {
    id: "mont-chouchou-cheesecake",
    title: "몽슈슈 떠먹는 치즈케이크 (200g)",
    priceKRW: 18_500,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/retail/images/30977212222255-963074f9-2417-48ea-a330-01bf2c9525dc.jpg",
    shortReason: "부드러운 떠먹는 치즈케이크로, 달콤한 디저트를 좋아하는 분께 어울리는 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPq32Loy4W",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
  {
    id: "deobareun-pave-choco-rice-cake",
    title: "더바른 파베초코크림떡 개별포장 (1박스, 360g)",
    priceKRW: 16_400,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/cf1a/2f3fde93512940643a07902be7e9c190442a6697898cb9a71350d54d695d.jpg",
    shortReason: "초코크림이 들어간 개별포장 떡으로, 나눠주기 좋은 디저트 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPq7QE3l2y",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
  {
    id: "keebright-3in1-camping-lantern",
    title: "Keebright 3in1 감성 캠핑랜턴 (3000mAh, IP65방수, 접이식 무드등)",
    priceKRW: 13_000,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/debf/86ba03b6edb3e226eb8eeaf2a8ddcb53851d7526866b37a93b24a22ec986.jpg",
    shortReason:
      "숫자표시·IP65 방수·접이식이 되는 3in1 캠핑랜턴으로, 차박·비상조명까지 챙기는 캠핑족에게 실용적인 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPrmVF96Rg",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "breezmoon-camping-cutlery-set",
    title: "브리즈문 SUS304 무광 캠핑 식기 그릇 커트러리 28p 세트",
    priceKRW: 57_800,
    shortReason:
      "연마제로 세척한 SUS304 무광 스테인리스 식기·커트러리 28p 구성으로, 캠핑 살림을 제대로 챙기는 분께 좋은 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPrpDBHPiK",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "fittem-waterproof-cooler-bag",
    title: "핏템 대용량 방수 캠핑 쿨러백 (대형)",
    priceKRW: 39_000,
    shortReason:
      "대용량 방수 소재로 만들어진 캠핑 쿨러백으로, 야외 활동을 자주 즐기는 분께 실용적인 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPrvfW0pjw",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "suntouch-camping-burner-4-burner",
    title: "썬터치 통주물바디 고화력 캠핑버너 4구 (그리들버너, ST-DS1F)",
    priceKRW: 40_340,
    shortReason:
      "통주물바디 고화력 4구 버너로, 캠핑에서 직접 요리하는 걸 즐기는 분께 실용적인 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPrD7ORlAa",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "breezmoon-camping-cookware-15p-set",
    title: "브리즈문 3중 스텐 캠핑 코펠 냄비 15p 세트",
    priceKRW: 47_800,
    shortReason:
      "연마제로 세척한 3중 스텐 코펠 냄비 15p 구성으로, 캠핑 취사를 제대로 챙기는 분께 좋은 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8118221139?itemId=23018795728&vendorItemId=90419623430&q=%EC%BD%94%ED%8E%A0%20%EC%84%B8%ED%8A%B8&searchId=6f37e81a14607372&sourceType=search&itemsCount=59&searchRank=3&rank=3&traceId=mrxikp3f",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "lotticamp-lightweight-camping-chair-set",
    title: "로티캠프 경량 로우 캠핑 의자 2p + 전용가방 2p 세트",
    priceKRW: 35_800,
    shortReason: "경량 로우 캠핑 의자 2인 세트로, 캠핑을 함께 즐기는 분들께 실용적인 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPrLhXJHk4",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "kukalife-rectangular-tarp",
    title: "크크라이프 실버 블랙 코팅 210D 렉타 타프",
    priceKRW: 33_800,
    shortReason: "코팅 원단 렉타 타프로, 캠핑 사이트를 제대로 꾸미는 분께 실용적인 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPrZPbEqZN",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "comet-folding-fire-pit",
    title: "코멧 아웃도어 접이식 화로대",
    priceKRW: 22_390,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/1025_amir_coupang_oct_80k/6bc6/0f4eaea7e90f9b2bb57464376506a35c12d98866b3ea9b49279166c14662.jpg",
    shortReason: "접이식으로 휴대가 편한 화로대로, 캠핑·차박에서 불멍을 즐기는 분께 좋은 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPr4uXrJme",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "comet-mummy-sleeping-bag",
    title: "코멧 머미형 사계절용 침낭 (220 x 80cm, 1950g)",
    priceKRW: 25_540,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/1025_amir_coupang_oct_80k/080b/d85287e9fd3c72885c127643e86482c97cb1602646dc732c21f1b861febf.jpg",
    shortReason: "사계절 사용 가능한 머미형 침낭으로, 캠핑·백패킹을 즐기는 분께 실용적인 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPsaNlMmvA",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "one-touch-camping-tent-2p",
    title: "2인용 원터치 캠핑 텐트",
    priceKRW: 129_000,
    shortReason: "펼치기만 하면 설치가 끝나는 원터치 텐트로, 캠핑을 이제 막 시작하는 분께 부담 없는 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPsfdXgIhg",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "carpack-camping-air-mattress",
    title: "차박 캠핑 매트리스 에어매트",
    priceKRW: 179_000,
    shortReason: "차박용으로 딱 맞는 두께의 에어매트로, 캠핑·차박 잠자리 편의를 챙겨주고 싶은 분께 실용적인 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "wood-folding-camping-table-chair-set",
    title: "감성 캠핑 우드 폴딩 테이블·체어 세트",
    priceKRW: 349_000,
    shortReason: "우드 톤으로 통일된 폴딩 테이블·체어 세트로, 캠핑 사이트 분위기를 제대로 갖추고 싶은 분께 좋은 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: ["정말 친한 절친", "배우자", "특별한 기념일(생일, 1주년)"],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "hardshell-rooftop-tent",
    title: "브랜드 하드쉘 루프탑 텐트",
    priceKRW: 590_000,
    shortReason: "차량 지붕에 설치하는 하드쉘 루프탑 텐트로, 캠핑·차박을 진지하게 즐기는 분께 특별한 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["30대", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "premium-4p-living-tent-tarp-set",
    title: "프리미엄 4인용 거실형 텐트·타프 풀세트",
    priceKRW: 850_000,
    shortReason: "거실형 텐트와 타프를 함께 갖춘 풀세트로, 가족·친구와 캠핑을 자주 즐기는 분께 최고급 선물입니다.",
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["30대", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "campman-lightweight-field-cot",
    title: "캠프맨 경량 야전침대 와이드 코트 (75cm, 백패킹용)",
    priceKRW: 99_000,
    shortReason:
      "고하중을 지지하는 조립식 경량 야전침대로, 백패킹·캠핑에서 편안한 잠자리를 원하는 분께 좋은 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8026404479?itemId=22433075508&vendorItemId=89518411532&sourceType=srp_product_ads&clickEventId=3250f9a0-8696-11f1-bec3-1c09384ad114&korePlacement=15&koreSubPlacement=1&clickEventId=3250f9a0-8696-11f1-bec3-1c09384ad114&korePlacement=15&koreSubPlacement=1&traceId=mrxip3ql",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "직장 동기",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["레저/캠핑형"],
    },
  },
  {
    id: "tnr-samsung-cell-docking-power-bank",
    title: "티앤알 삼성배터리셀 도킹형 국산 보조배터리",
    priceKRW: 22_800,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/image_audit/stage/manual/4fe9423c-4025-45ae-afd2-fbd92dc30f50_1766475397502_1783993081718.jpeg",
    shortReason: "국산 삼성 배터리셀을 쓴 도킹형 보조배터리로, 실용성을 중요하게 여기는 분께 좋은 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPsGbMtOSq",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "직장 상사",
        "직장 동기",
        "직장 후배",
        "거래처",
        "정말 친한 절친",
        "가볍게 아는 지인",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["실용성 우선"],
    },
  },
  {
    id: "sinjimoru-car-wireless-charger-mount",
    title: "신지모루 차량용 고속 무선충전 거치대 (오그랩엑스)",
    priceKRW: 26_900,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/retail/images/941329713570088-1bd31dcf-182e-4e31-9d61-5529987fbc31.jpg",
    shortReason: "강력 고정되는 차량용 고속 무선충전 거치대로, 실용적인 선물을 찾는 분께 좋습니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPsTIsiD8K",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "직장 상사",
        "직장 동기",
        "직장 후배",
        "거래처",
        "정말 친한 절친",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["실용성 우선"],
    },
  },
  {
    id: "phone-tablet-stand",
    title: "하우스나인 2세대 170cm 휴대폰 태블릿 스탠드 거치대",
    priceKRW: 10_000,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/2b2c/68a3b0e99a8a52ef89de2aa4242e8bc05d74b275d81d160619a9d01c9f65.png",
    shortReason:
      "높이 각도 조절이 되는 휴대폰·태블릿 거치대로, 책상 작업 시 화면을 편하게 볼 수 있는 실용적인 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPsZdsf0ua",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처", "부모님", "형제/자매", "배우자", "시댁/처가 어른", "정말 친한 절친", "가볍게 아는 지인", "선생님/은사님", "가벼운 기념일(100일 등)", "어버이날", "스승의날", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["자기계발/워커홀릭"],
    },
  },
  {
    id: "wireless-keyboard-han-sung",
    title: "한성컴퓨터 OfficeMaster 유무선 저소음 멤브레인 키보드",
    priceKRW: 29_000,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/retail/images/2025/09/28/9/3/e7cbdbc5-b57b-49ed-b6b4-e24a54abb82f.jpg",
    shortReason:
      "유무선을 모두 지원하는 저소음 멤브레인 키보드로, 업무 효율을 높이고 싶어하는 분께 어울리는 실용 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPs4KPn3wO",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처", "부모님", "형제/자매", "배우자", "시댁/처가 어른", "정말 친한 절친", "가볍게 아는 지인", "선생님/은사님", "가벼운 기념일(100일 등)", "어버이날", "스승의날", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["자기계발/워커홀릭"],
    },
  },
  {
    id: "notebook-cooling-stand",
    title: "홈플래닛 와이드형 메탈 쿨링홀 노트북 거치대",
    priceKRW: 22_870,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/1025_amir_coupang_oct_80k/e0f4/e0e58e8a793ee9dca353b2e3a576146a2d9062b37bef78e5a4223eea25a1.jpg",
    shortReason:
      "높이와 각도를 자유롭게 조절할 수 있는 노트북 거치대로, 자세 개선과 노트북 열 관리를 동시에 해결하는 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPs70hExCC",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처", "부모님", "형제/자매", "배우자", "시댁/처가 어른", "정말 친한 절친", "가볍게 아는 지인", "선생님/은사님", "가벼운 기념일(100일 등)", "어버이날", "스승의날", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["자기계발/워커홀릭"],
    },
  },
  {
    id: "apple-ipad-2025-a16",
    title: "Apple 2025 아이패드 (A16 모델)",
    priceKRW: 645_000,
    shortReason:
      "A16 칩셋으로 강력한 성능을 갖춘 아이패드로, 업무와 창의적 작업을 하는 프로페셔널에게 최고의 도구가 됩니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPti4EGxvU",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처", "부모님", "형제/자매", "배우자", "시댁/처가 어른", "정말 친한 절친", "가볍게 아는 지인", "선생님/은사님", "가벼운 기념일(100일 등)", "어버이날", "스승의날", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["자기계발/워커홀릭"],
    },
  },
  {
    id: "apple-iphone-17-pro",
    title: "Apple 아이폰 17 Pro 자급제",
    priceKRW: 1_772_100,
    shortReason:
      "최신 프로 라인 아이폰으로, 프리미엄 스마트폰을 원하는 분께 최고급 선물이 됩니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPoMs0ef8e",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["자기계발/워커홀릭", "감성/디자인 중시"],
    },
  },
  {
    id: "sony-wh1000xm6-headphones",
    title: "소니 노이즈캔슬링 블루투스 헤드폰 WH-1000XM6 플래티넘 실버",
    priceKRW: 480_490,
    shortReason:
      "업계 최고의 노이즈캔슬링 기술과 40시간 배터리 지원으로, 출장과 재택근무를 자주 하는 분께 완벽한 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPtmO7qevQ",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처", "부모님", "형제/자매", "배우자", "시댁/처가 어른", "정말 친한 절친", "가볍게 아는 지인", "선생님/은사님", "가벼운 기념일(100일 등)", "어버이날", "스승의날", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["자기계발/워커홀릭"],
    },
  },
  {
    id: "apple-airpods-pro-3-usb-c",
    title: "Apple 2025 에어팟 프로 3 USB-C 블루투스 이어폰",
    priceKRW: 322_100,
    shortReason:
      "최신 세대 에어팟 프로로 향상된 음질과 노이즈캔슬링 성능으로, 프리미엄 이어폰을 찾는 분께 최고의 선택입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPtq9Lvuvs",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처", "부모님", "형제/자매", "배우자", "시댁/처가 어른", "정말 친한 절친", "가볍게 아는 지인", "선생님/은사님", "가벼운 기념일(100일 등)", "어버이날", "스승의날", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["자기계발/워커홀릭"],
    },
  },
  {
    id: "samsung-galaxy-tab-s10-light",
    title: "삼성전자 갤럭시탭S10라이트 27.7cm(10.9형) S펜포함",
    priceKRW: 555_000,
    shortReason:
      "S펜이 포함된 10.9인치 태블릿으로 문서 작성과 드로잉이 편하며, 멀티태스킹이 많은 분께 완벽한 생산성 도구입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPtACmBuQC",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처", "부모님", "형제/자매", "배우자", "시댁/처가 어른", "정말 친한 절친", "가볍게 아는 지인", "선생님/은사님", "가벼운 기념일(100일 등)", "어버이날", "스승의날", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["자기계발/워커홀릭"],
    },
  },
  {
    id: "amazon-kindle-11-gen",
    title: "아마존 올뉴 킨들 11세대 마차 Amazon Kindle 16GB",
    priceKRW: 150_220,
    shortReason:
      "16GB 용량의 킨들로 수천 권의 전자책을 담을 수 있으며, 독서 습관을 기르고 싶은 분께 완벽한 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPtGBMPSLI",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처", "부모님", "형제/자매", "배우자", "시댁/처가 어른", "정말 친한 절친", "가볍게 아는 지인", "선생님/은사님", "가벼운 기념일(100일 등)", "어버이날", "스승의날", "자녀", "특별한 기념일(생일, 1주년)"],
      preference: ["자기계발/워커홀릭"],
    },
  },
  {
    id: "dyson-airwrap-id-multi-styler",
    title: "다이슨 에어랩 id 멀티 스타일러 앤 드라이어",
    priceKRW: 526_470,
    shortReason:
      "열 손상 없이 스타일링과 드라이를 동시에 해결하는 다이슨 에어랩으로, 뷰티·그루밍에 진심인 분께 최고의 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPvLamZGNM",
    },
    tags: {
      gender: ["여성", "무관"],
      age: ["20대", "30대", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "부모님", "시댁/처가 어른", "특별한 기념일(생일, 1주년)"],
      preference: ["뷰티/그루밍형"],
    },
  },
  {
    id: "chanel-no5-eau-de-parfum",
    title: "샤넬 넘버5 오드빠르펭 + 쇼퍼백 (100ml)",
    priceKRW: 145_600,
    shortReason: "시대를 초월한 샤넬의 시그니처 향수로, 격을 갖춘 뷰티 선물을 찾는 분께 좋습니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPvOQ65Ym4",
    },
    tags: {
      gender: ["여성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["배우자", "정말 친한 절친", "부모님", "시댁/처가 어른", "특별한 기념일(생일, 1주년)"],
      preference: ["뷰티/그루밍형"],
    },
  },
  {
    id: "dior-addict-eau-fraiche",
    title: "디올 어딕트 오 프레쉬 오드뚜왈렛 + 쇼퍼백 (30ml)",
    priceKRW: 89_550,
    shortReason: "산뜻한 시트러스 플로럴 향의 디올 시그니처 향수로, 부담 없이 건네기 좋은 뷰티 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPvXbX0Eou",
    },
    tags: {
      gender: ["여성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "배우자",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["뷰티/그루밍형"],
    },
  },
  {
    id: "dolce-gabbana-my-juicy-sheer-lipstick",
    title: "돌체앤가바나 뷰티 립스틸로 마이 쥬시 시어 립스틱 (MY1702)",
    priceKRW: 51_850,
    shortReason: "달콤하고 자연스러운 쥬시 핑크 톤의 립스틱으로, 가볍게 건네기 좋은 뷰티 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPv5dO0NUa",
    },
    tags: {
      gender: ["여성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["뷰티/그루밍형"],
    },
  },
  {
    id: "grilled-cheese-bar-original",
    title: "구워먹는 쫀득 치즈바 오리지널 (530g)",
    priceKRW: 13_000,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/image_audit/stage/manual/bef8ab5a-60d7-41f9-af60-e25209bfe25a_1752729447559.jpeg",
    shortReason: "구워 먹으면 쫀득해지는 치즈바로, 부담 없이 나눠주기 좋은 간식 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPv74uMAUK",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
  {
    id: "pinebrick-salt-butter-yakgwa-set",
    title: "파인브릭 소금버터 개성약과 선물세트",
    priceKRW: 29_900,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/image_audit/prod/b0bbb722-65fb-4b1f-8c47-e62a4743f6b2_fixing_v2.png",
    shortReason: "짭짤한 소금버터 풍미의 개성약과 선물세트로, 전통 간식을 좋아하는 분께 잘 어울립니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPwi1SgqGq",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "부모님",
        "시댁/처가 어른",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
  {
    id: "saenggwabang-handmade-yakgwa-set",
    title: "생과방 수제약과 선물세트 (12개입, 480g)",
    priceKRW: 46_490,
    shortReason: "수제로 만든 전통 한과·약과 12개입 선물세트로, 격식 있게 건네기 좋은 간식 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/9392098812?itemId=28438804487&vendorItemId=94446197674&q=%ED%91%B8%EB%A5%B8%EB%B1%80+%EC%95%BD%EA%B3%BC+%EC%84%B8%ED%8A%B8&searchId=567f9b1413609504&sourceType=search&itemsCount=36&searchRank=3&rank=3&traceId=mrxmgvkf",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "직장 상사",
        "거래처",
        "부모님",
        "시댁/처가 어른",
        "선생님/은사님",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
  {
    id: "ddeokbo-rice-cake-cake-1",
    title: "[떡보의하루 본사] 떡케이크 행복담1호",
    priceKRW: 43_500,
    shortReason: "전국 매장에서 직접 배달되는 떡케이크로, 특별한 날 함께 나누기 좋은 간식 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8761233593?itemId=25475908882&vendorItemId=92468309910&q=%EC%B0%BD%EC%96%B5%EB%96%A1+%EC%BC%80%EC%9D%B4%ED%81%AC&searchId=cbc494b32325512&sourceType=search&itemsCount=36&searchRank=0&rank=0&traceId=mrxmk3ow",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "부모님",
        "시댁/처가 어른",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
  {
    id: "shiroi-koibito-mix-24",
    title: "시로이고이비토 믹스 24개입",
    priceKRW: 39_230,
    imageUrl:
      "https://thumbnail.coupangcdn.com/thumbnails/remote/657x657q90trim/image/vendor_inventory/4338/a8525837b68784ac01a5a0720459f2fc5ab9385427a841e17245bb7855da.jpg",
    shortReason: "화이트·밀크 초콜릿 쿠키가 함께 든 시로이고이비토 믹스로, 부담 없이 건네기 좋은 간식 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://link.coupang.com/a/fPwwQ2OUCG",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "직장 동기",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["간식형"],
    },
  },
];


export const gifts: Gift[] = raw.map(finalize);



