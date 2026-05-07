"use client";

type OptionGridProps<T extends string> = {
  value?: T;
  options: readonly T[];
  onChange: (next: T) => void;
};

export function OptionGrid<T extends string>({
  value,
  options,
  onChange,
}: OptionGridProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              "h-11 rounded-xl border px-3 text-sm font-medium transition",
              active
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

