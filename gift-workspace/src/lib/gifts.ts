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
    affiliateUrls: {
      naverShopping: "https://search.shopping.naver.com/search/all?query=%EB%A3%A8%EC%9D%B4%EB%B9%84%ED%88%AC%EC%8A%A4+%EA%B0%80%EC%A1%B1+%ED%8C%8C%EC%BB%B5+%EC%98%A4%EA%B1%B0%EB%82%98%EC%9D%B4%EC%A0%80",
      coupang: "https://www.coupang.com/np/search?q=%EB%A3%A8%EC%9D%B4%EB%B9%84%ED%88%AC%EC%8A%A4+%EA%B0%80%EC%A1%B1+%ED%8C%8C%EC%BB%B5+%EC%98%A4%EA%B1%B0%EB%82%98%EC%9D%B4%EC%A0%80",
      kakaoGift: "https://gift.kakao.com/search/result?query=%EB%A3%A8%EC%9D%B4%EB%B9%84%ED%88%AC%EC%8A%A4%20%EA%B0%80%EC%A1%B1%20%ED%8C%8C%EC%BB%B5%20%EC%98%A4%EA%B1%B0%EB%82%98%EC%9D%B4%EC%A0%80&searchType=search_related_keyword_search_box",
    },
    tags: {
      gender: ["남성", "무관"],
      age: ["30대", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"],
      preference: ["실용성 우선", "감성/디자인 중시"],
    },
  },
  {
    id: "dior-oblique-wallet",
    title: "디올 30 몽테뉴 로투스 3단 반지갑",
    priceKRW: 336_000,
    shortReason: "디올의 시그니처 패턴을 살린 고급 반지갑으로 선물 가치가 높습니다.",
    brandUrl: "https://www.dior.com/ko_kr",
    affiliateUrls: {
      naverShopping: "https://search.shopping.naver.com/search/all?query=%EB%94%94%EC%98%AC+30+%EB%AA%BD%ED%85%8C%EB%89%B4+%EB%A1%9C%ED%88%AC%EC%8A%A4+3%EB%8B%A8+%EB%B0%98%EC%A7%80%EA%B0%91",
      coupang: "https://www.coupang.com/vp/products/9633616706?itemId=28778154560&vendorItemId=95715299227&q=%EB%94%94%EC%98%AC+30+%EB%AA%BD%ED%85%8C%EB%89%B4+%EB%A1%9C%ED%88%AC%EC%8A%A4+3%EB%8B%A8+%EB%B0%98%EC%A7%80%EA%B0%91&searchId=6100d3575375421&sourceType=search&itemsCount=36&searchRank=0&rank=0&traceId=mrroeusi",
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
    tags: {
      gender: ["여성"],
      age: ["30대", "40대", "50대"],
      relation: ["배우자", "정말 친한 절친", "특별한 기념일(생일, 1주년)"] as any,
      preference: ["뷰티/그루밍형", "감성/디자인 중시"],
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
        "https://www.coupang.com/vp/products/6792297030?itemId=28754136502&vendorItemId=95692969028&q=%EC%8A%A4%ED%83%A0%EB%A6%AC+%ED%80%9C%EC%B2%98+H2.0+%ED%85%80%EB%B8%94%EB%9F%AC+887ml&searchId=f5c262825938132&sourceType=search&itemsCount=60&searchRank=0&rank=0&traceId=mrdl5qp2",
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
      preference: ["실용성 우선", "건강/웰빙형", "레저/캠핑형"],
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
        "https://www.coupang.com/vp/products/7279646307?itemId=18582944334&vendorItemId=90335345695&sourceType=srp_product_ads&clickEventId=8a8594b0-7ba0-11f1-9c68-9201e9ac44e9&korePlacement=15&koreSubPlacement=1&traceId=mrdl95qy",
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
    priceKRW: 12_800,
    shortReason:
      "애플 정품 맥세이프 충전기보다 낮고, 브랜드 스탠드 제품에서 흔한 대표가에 가깝게 맞춤.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/9606479201?itemId=28678659938&vendorItemId=94995973251&sourceType=srp_product_ads&clickEventId=325a3ac0-7c09-11f1-9703-882ef51fb9b9&korePlacement=15&koreSubPlacement=1&traceId=mrec0kq8",
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
    priceKRW: 21_200,
    shortReason:
      "백화점·몰에서 자주 보이는 구성 기준 가격. 휴식·담소 선물로 무난해요.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8474157902?itemId=24521096106&vendorItemId=91533821651&q=%EC%98%A4%EC%85%9C%EB%A1%9D&searchId=a9c2fbeb4453255&sourceType=search&itemsCount=60&searchRank=3&rank=3&traceId=mrebywz7",
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
        "https://www.coupang.com/vp/products/8853414422?itemId=25811757566&vendorItemId=93852895705&q=%EC%B7%A8%EB%AF%B8+%ED%82%A4%ED%8A%B8%28%ED%96%A5%EC%B4%88%2F%EA%B0%80%EC%A3%BD%EA%B3%B5%EC%98%88%2F%EA%B7%B8%EB%A6%BC+%EB%93%B1%29&searchId=a7cbf4d44455320&sourceType=search&itemsCount=33&searchRank=0&rank=0&traceId=mrec2ygu",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대"],
      relation: [
        "정말 친한 절친",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["미니어처/DIY형", "감성/디자인 중시"],
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
        "https://www.coupang.com/vp/products/8799085203?itemId=25619136028&vendorItemId=92609524987&sourceType=srp_product_ads&clickEventId=a27b9d30-7ba0-11f1-ae98-84258119afd8&korePlacement=15&koreSubPlacement=5&traceId=mrdla3gi",
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
      preference: ["미니어처/DIY형", "감성/디자인 중시"],
    },
  },
  {
    id: "malang-squishy",
    title: "말랑이(소프트 토이)",
    priceKRW: 11020,
    shortReason: "간단한 취미/스트레스 해소용 말랑이 토이입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8901021453?itemId=22510569626&vendorItemId=89552647246&sourceType=srp_product_ads&clickEventId=d2787710-7ba0-11f1-92b0-9cc8ac73deaa&korePlacement=15&koreSubPlacement=5&traceId=mrdlbu41",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["정말 친한 절친", "자녀", "가벼운 기념일(100일 등)", "특별한 기념일(생일, 1주년)"],
      preference: ["독서형"],
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
      preference: ["미니어처/DIY형", "감성/디자인 중시"],
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
      preference: ["미니어처/DIY형", "감성/디자인 중시"],
    },
  },
  {
    id: "massage-gun",
    title: "미니 마사지건",
    priceKRW: 89_000,
    shortReason:
      "어깨와 허리 통증을 일상에서 해소하는, 부피가 작아 실사용률이 높은 검증된 효도 아이템입니다.",
    parentValue: ["몸에 도움", "오래 사용"],
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
        "https://www.coupang.com/np/search?q=%EA%B0%80%EC%8A%B5%20%EA%B2%B8%EC%9A%A9%20%EC%86%8C%ED%98%95%20%EA%B3%B5%EA%B8%B0%EC%B2%AD%EC%A0%95%EA%B8%B0",
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
        "https://www.coupang.com/np/search?q=%EC%BA%A1%EC%8A%90%20%EC%BB%A4%ED%94%BC%EB%A8%B8%EC%8B%A0%20%EC%9B%90%ED%84%B0%EC%B9%98",
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
    id: "parent-flower-cash-box",
    title: "꽃다발 + 현금 용돈박스",
    priceKRW: 79_000,
    shortReason:
      "감성적인 꽃 비주얼과 가장 현실적인 실용성인 현금을 결합해 실패율이 없는 만족도 상위권 조합입니다.",
    parentValue: ["몸에 도움"],
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["40대", "50대", "60대 이상"],
      relation: ["부모님", "시댁/처가 어른", "어버이날"],
      preference: ["감성/디자인 중시", "실용성 우선"],
    },
  },
  {
    id: "parent-gongjindan",
    title: "공진단",
    priceKRW: 73_000,
    shortReason:
      "면역력과 기력 보충에 좋은 전통 건강 선물로, 1개 가격 73,000원에 부담 없이 챙겨드릴 수 있어요.",
    parentValue: ["몸에 도움"],
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/7523923017?itemId=25025332492&vendorItemId=94607411630&q=%EA%B3%B5%EC%A7%84%EB%8B%A8&searchId=d38966c712484958&sourceType=search&itemsCount=36&searchRank=0&rank=0&traceId=mrropw1i",
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
    title: "정관장 홍삼 스틱",
    priceKRW: 10_400,
    shortReason:
      "휴대와 섭취가 간편한 정관장 홍삼 스틱으로, 1개 10,400원 · 3개 세트 83,200원으로 용량에 맞게 고르기 좋아요.",
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
    id: "sanseoham-811",
    title: "산서함 811",
    priceKRW: 103_800,
    shortReason:
      "# 인삼정과 콩고물 도라지정과 도라지청 천혜향정과 생강편강 이바지음식 세트",
    parentValue: ["몸에 도움", "가족 경험"],
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8411366204?itemId=24320644739&vendorItemId=91336393929&q=%EC%82%B0%EC%84%9C%ED%95%A8+811&searchId=8519b74d11711477&sourceType=search&itemsCount=36&searchRank=0&rank=0&traceId=mrrovfq2",
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
        "https://www.coupang.com/vp/products/9016203048?itemId=26432790619&vendorItemId=93408536548&sourceType=srp_product_ads&clickEventId=b0823740-7b50-11f1-9e89-e8c704ca0aec&korePlacement=15&koreSubPlacement=1&traceId=mrd0ucs0",
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
      preference: ["레저/캠핑형", "실용성 우선"],
    },
  },
  {
    id: "reading-light-diffuser-set",
    title: "북라이트 & 아로마 디퓨저 세트",
    priceKRW: 39_000,
    shortReason:
      "집에서 책 읽고 쉬는 시간을 좋아하는 분께 잘 맞는 독서등(북라이트)과 아로마 디퓨저 구성의 홈힐링 아이템입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/np/search?q=%EB%B6%81%EB%9D%BC%EC%9D%B4%ED%8A%B8%20%EC%95%84%EB%A1%9C%EB%A7%88%20%EB%94%94%ED%93%A8%EC%A0%80%20%EC%84%B8%ED%8A%B8",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      relation: [
        "정말 친한 절친",
        "가볍게 아는 지인",
        "가벼운 기념일(100일 등)",
        "특별한 기념일(생일, 1주년)",
      ],
      preference: ["독서형"],
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
        "https://www.coupang.com/np/search?q=%EB%A7%88%EC%B9%B4%EB%A1%B1%20%EC%BC%80%EC%9D%B4%ED%81%AC%20%EC%A0%A4%EB%A6%AC%20%EB%94%94%EC%A0%80%ED%8A%B8%20%EB%B0%95%EC%8A%A4",
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
      preference: ["디저트형", "감성/디자인 중시"],
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
      preference: ["식사/간식형", "실용성 우선"],
    },
  },
  {
    id: "aubriez-leather-book-cover",
    title: "오브리즈 공방 클래식 가죽 북커버 (A5/B6 다이어리 커버)",
    priceKRW: 14_800,
    shortReason:
      "책과 다이어리를 즐겨 쓰는 집돌이·홈힐링형에게 잘 어울리는 클래식 가죽 북커버로, 감성 있게 노트를 보호해줍니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8307434602?itemId=23968615192&vendorItemId=90990020058&sourceType=srp_product_ads&clickEventId=ab824520-83fa-11f1-aea9-fe7fbed9da3d&korePlacement=15&koreSubPlacement=1&clickEventId=ab824520-83fa-11f1-aea9-fe7fbed9da3d&korePlacement=15&koreSubPlacement=1&traceId=mrss00ql",
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
    shortReason:
      "우드·메탈 소재의 고급 책갈피 겸 북클립으로, 독서를 즐기는 집돌이·홈힐링형에게 실용적이면서도 감성 있는 선물이 됩니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8583301827?itemId=24881056353&vendorItemId=91832662689&sourceType=srp_product_ads&clickEventId=e48d5900-83f9-11f1-87b1-16c5a0caae0a&korePlacement=15&koreSubPlacement=6&clickEventId=e48d5900-83f9-11f1-87b1-16c5a0caae0a&korePlacement=15&koreSubPlacement=6&traceId=mrsrsudm",
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
        "https://www.coupang.com/vp/products/6347793093?itemId=13344854140&vendorItemId=87059264410&q=%EB%B9%84%EB%82%98%EB%98%90+%28Rubinato%29+%EA%B8%80%EB%9D%BC%EC%8A%A4%2F%EA%B9%83%ED%8E%9C+%EC%84%B8%ED%8A%B8&searchId=5033a76a9795771&sourceType=search&itemsCount=60&searchRank=0&rank=0&traceId=mrsrrfgn",
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
    shortReason:
      "코드 없이 어디든 둘 수 있는 무선 무드등으로, 은은한 감성 인테리어 소품을 좋아하는 분께 좋은 선물입니다.",
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8911772249?itemId=26034021067&vendorItemId=93015600110&q=%EA%B0%90%EC%84%B1%EC%A0%81+%EC%A1%B0%EB%AA%85&searchId=7e0b98a97128243&sourceType=search&itemsCount=60&searchRank=10&rank=10&traceId=mrsrkmqi",
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
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/9009295299?itemId=26138689033&vendorItemId=93118823008&q=2.+%F0%9F%92%A1+%EC%A1%B0%EB%AA%85%3A+%EC%95%84%EB%A5%B4%EB%96%BC%EB%AF%B8%EB%8D%B0+%28Artemide%29+-+%EB%84%A4%EC%8B%9C%EB%85%B8+%28Nessino%29+%ED%85%8C%EC%9D%B4%EB%B8%94+%EB%9E%A8%ED%94%84&searchId=9644c75b1429497&sourceType=search&itemsCount=60&searchRank=2&rank=2&traceId=mrsrj2k7",
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
    affiliateUrls: {
      coupang:
        "https://www.coupang.com/vp/products/8658596958?itemId=25130237402&vendorItemId=93606348251&q=%EB%A3%A8%EC%9D%B4%EC%8A%A4%ED%8F%B4%EC%84%BC+%28Louis+Poulsen%29+-+PH+5+%EC%A1%B0%EB%AA%85&searchId=9f6c9172473559&sourceType=search&itemsCount=60&searchRank=2&rank=2&traceId=mrsrepi6",
    },
    tags: {
      gender: ["여성", "남성", "무관"],
      age: ["20대", "30대", "40대", "50대", "60대 이상"],
      relation: ["배우자", "정말 친한 절친", "부모님", "시댁/처가 어른", "특별한 기념일(생일, 1주년)"],
      preference: ["감성/디자인 중시"],
    },
  },
];


export const gifts: Gift[] = raw.map(finalize);



