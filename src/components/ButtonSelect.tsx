import React from "react";

export default function ButtonSelect<T>({
  options,
  getOptionName,
  setValue,
  value,
  label,
  center = false,
}: {
  options: T[];
  getOptionName: (value: T | undefined) => string;
  setValue: (value: T | undefined) => void;
  value: T | undefined;
  label: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <label>{label}</label>
      <div
        className={
          "flex flex-row gap-3 flex-wrap " + (center ? "justify-center" : "")
        }
      >
        {options.map((o) => (
          <button
            type="button"
            key={getOptionName(o)}
            className={
              getOptionName(o) === getOptionName(value)
                ? "  "
                : "unstyled btn-outline"
            }
            onClick={() => setValue(o)}
          >
            {getOptionName(o)}
          </button>
        ))}
      </div>
    </div>
  );
}
