export type Gender = "여성" | "남성" | "무관";
export type AgeBand =
  | "10대"
  | "20대 초반"
  | "20대 후반"
  | "30대 초반"
  | "30대 후반"
  | "40대"
  | "50대"
  | "60대 이상";

export type Relation =
  | "직장 상사"
  | "직장 동기"
  | "직장 후배"
  | "퇴사자/이직자"
  | "거래처"
  | "부모님"
  | "형제/자매"
  | "배우자"
  | "시댁/처가 어른"
  | "정말 친한 절친"
  | "가볍게 아는 지인"
  | "선생님/은사님"
  | "가벼운 기념일(100일 등)"
  | "특별한 기념일(생일, 1주년)";

export type Budget =
  | "1~3만 원대"
  | "3~5만 원대"
  | "5~10만 원대"
  | "10~15만 원대"
  | "15~20만 원대"
  | "20~30만 원대"
  | "30~50만 원대"
  | "50만 원 이상";

export type Preference =
  | "실용성 우선"
  | "감성/디자인 중시"
  | "건강/웰빙형"
  | "자기계발/워커홀릭"
  | "특정 취미 진심형"
  | "미식가형"
  | "뷰티/그루밍형";

export type Gift = {
  id: string;
  title: string;
  priceKRW: number;
  shortReason: string;
  tags: {
    gender: Gender[];
    age: AgeBand[];
    relation: Relation[];
    budget: Budget[];
    preference: Preference[];
  };
};

export type Answers = {
  gender?: Gender;
  age?: AgeBand;
  relation?: Relation;
  budget?: Budget;
  preference?: Preference;
  freeText?: string;
};

