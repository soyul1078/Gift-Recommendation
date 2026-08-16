"use client";

export function optionChipClass(active: boolean): string {
  return [
    "rounded-xl border-2 px-[18px] py-3 text-sm font-medium transition-colors",
    active
      ? "border-accent bg-accent text-white"
      : "border-line bg-surface text-zinc-800 hover:border-accent hover:bg-tint",
  ].join(" ");
}

type Base<T extends string> = {
  options: readonly T[];
  /** Optional display text override, keyed by option value. Falls back to the option itself. */
  labels?: Partial<Record<T, string>>;
};

type SingleProps<T extends string> = Base<T> & {
  mode?: "single";
  value?: T;
  onChange: (next: T) => void;
};

type MultiProps<T extends string> = Base<T> & {
  mode: "multiple";
  values: readonly T[];
  onChange: (next: readonly T[]) => void;
};

export type OptionGridProps<T extends string> = SingleProps<T> | MultiProps<T>;

export function OptionGrid<T extends string>(props: OptionGridProps<T>) {
  if (props.mode === "multiple") {
    const { values, options, onChange, labels } = props;
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (active) onChange(values.filter((v) => v !== opt));
                else onChange([...values, opt]);
              }}
              className={optionChipClass(active)}
            >
              {labels?.[opt] ?? opt}
            </button>
          );
        })}
      </div>
    );
  }

  const { value, options, onChange, labels } = props;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)} className={optionChipClass(active)}>
            {labels?.[opt] ?? opt}
          </button>
        );
      })}
    </div>
  );
}
