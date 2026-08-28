"use client";

import { OptionGrid } from "@/components/OptionGrid";
import type { Relation } from "@/lib/types";

type RelationSection = {
  id: string;
  label: string;
  options: readonly Relation[];
};

const relationSections: readonly RelationSection[] = [
  {
    id: "family",
    label: "가족",
    options: ["부모님", "자녀", "형제/자매", "배우자", "시댁/처가 어른"],
  },
  {
    id: "work",
    label: "회사",
    options: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처"],
  },
  {
    id: "occasion",
    label: "기념일·시즌",
    options: ["가벼운 기념일(100일 등)", "특별한 기념일(생일, 1주년)", "어버이날", "스승의날"],
  },
  {
    id: "other",
    label: "그 외",
    options: ["정말 친한 절친", "가볍게 아는 지인", "선생님/은사님"],
  },
];

const OCCASION_SECTION_LABELS: Partial<Record<Relation, string>> = {
  "특별한 기념일(생일, 1주년)": "생일·기념일",
};

const OTHER_SECTION_LABELS: Partial<Record<Relation, string>> = {
  "정말 친한 절친": "친구",
  "가볍게 아는 지인": "지인",
  "선생님/은사님": "선생님",
};

type Props = {
  value?: Relation;
  onChange: (relation: Relation) => void;
};

export function RelationSectionPicker({ value, onChange }: Props) {
  return (
    <div className="grid gap-2">
      {relationSections.map((section) => (
        <div key={section.id}>
          <div className="mb-2 text-sm font-semibold text-soft">{section.label}</div>
          <OptionGrid
            value={value}
            options={section.options}
            onChange={onChange}
            labels={
              section.id === "other"
                ? OTHER_SECTION_LABELS
                : section.id === "occasion"
                  ? OCCASION_SECTION_LABELS
                  : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}
