"use client";

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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
              className={[
                "min-h-11 rounded-2xl border-2 px-3 py-2 text-left text-sm font-medium transition",
                active
                  ? "border-accent bg-accent text-white"
                  : "border-zinc-200 bg-surface/90 text-zinc-800 shadow-sm hover:-translate-y-0.5 hover:border-accent hover:bg-tint",
              ].join(" ")}
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              "h-11 rounded-2xl border-2 px-3 text-sm font-medium transition",
              active
                ? "border-accent bg-accent text-white"
                : "border-zinc-200 bg-surface/90 text-zinc-800 shadow-sm hover:-translate-y-0.5 hover:border-accent hover:bg-tint",
            ].join(" ")}
          >
            {labels?.[opt] ?? opt}
          </button>
        );
      })}
    </div>
  );
}
