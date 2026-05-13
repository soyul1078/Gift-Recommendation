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

const btnBase =
  "rounded-2xl border px-3 text-sm font-medium shadow-sm transition duration-200";

const btnInactive =
  "border-rose-100 bg-white/90 text-rose-950 hover:border-rose-200 hover:bg-rose-50/90 hover:shadow-md hover:shadow-rose-100/50";

const btnActive =
  "border-transparent bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md shadow-rose-300/60 hover:from-rose-500 hover:to-pink-600";

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
                "min-h-11 py-2 text-left",
                btnBase,
                active ? btnActive : btnInactive,
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
              "h-11",
              btnBase,
              active ? btnActive : btnInactive,
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
