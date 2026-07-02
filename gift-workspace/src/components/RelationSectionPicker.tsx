"use client";

import { useState } from "react";
import { OptionGrid } from "@/components/OptionGrid";
import type { Relation } from "@/lib/types";

type RelationSection = {
  id: string;
  label: string;
  description: string;
  options: readonly Relation[];
};

const relationSections: readonly RelationSection[] = [
  {
    id: "family",
    label: "가족",
    description: "부모님, 배우자, 형제·시댁 등",
    options: ["부모님", "형제/자매", "배우자", "시댁/처가 어른"],
  },
  {
    id: "work",
    label: "회사 관계",
    description: "직장·거래처 등",
    options: ["직장 상사", "직장 동기", "직장 후배", "퇴사자/이직자", "거래처"],
  },
  {
    id: "occasion",
    label: "기념일",
    description: "100일, 생일, 어버이날, 스승의날 등",
    options: ["가벼운 기념일(100일 등)", "생일·기념일", "어버이날", "스승의날"],
  },
  {
    id: "other",
    label: "기타",
    description: "친구, 지인, 선생님 등",
    options: ["정말 친한 절친", "가볍게 아는 지인", "선생님/은사님"],
  },
];

function sectionIdForRelation(relation?: Relation): string | null {
  if (!relation) return null;
  return relationSections.find((s) => s.options.includes(relation))?.id ?? null;
}

type Props = {
  value?: Relation;
  onChange: (relation: Relation) => void;
};

export function RelationSectionPicker({ value, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(() => sectionIdForRelation(value));

  function toggleSection(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="grid gap-3">
      {relationSections.map((section) => {
        const open = expandedId === section.id;
        const selectedInSection = value != null && section.options.includes(value);

        return (
          <div key={section.id} className={[
            "overflow-hidden rounded-[24px] border bg-white/90 shadow-sm transition",
            open || selectedInSection ? "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-lime-50" : "border-zinc-200",
          ].join(" ")}>
            <button type="button" onClick={() => toggleSection(section.id)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left" aria-expanded={open}>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900">{section.label}</span>
                </div>
                <div className="mt-0.5 text-xs text-zinc-500">{section.description}</div>
              </div>
              <div className="flex items-center gap-2">
                {selectedInSection && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {value}
                  </span>
                )}
                <span className={["grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm transition", open ? "bg-emerald-700 text-white" : "bg-zinc-100 text-zinc-600"].join(" ")} aria-hidden>
                  {open ? "∧" : "∨"}
                </span>
              </div>
            </button>

            {open && (
              <div className="border-t border-zinc-200 px-4 pb-4 pt-3">
                <OptionGrid value={value} options={section.options} onChange={onChange} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
