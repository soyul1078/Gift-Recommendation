"use client";

type Base<T extends string> = {
  options: readonly T[];
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
    const { values, options, onChange } = props;
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                "min-h-11 rounded-xl border px-3 py-2 text-left text-sm font-medium transition",
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

  const { value, options, onChange } = props;
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
