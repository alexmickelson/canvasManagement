import React from "react";

export default function ButtonSelect<T>({
  options,
  getName,
  setSelectedOption,
  selectedOption,
}: {
  options: T[];
  getName: (value: T | undefined) => string;
  setSelectedOption: (value: T | undefined) => void;
  selectedOption: T | undefined;
}) {
  return (
    <div className="flex flex-row gap-3">
      {options.map((o) => (
        <button
          type="button"
          key={getName(o)}
          className={
            getName(o) === getName(selectedOption) ? "  " : "unstyled btn-outline"
          }
          onClick={() => setSelectedOption(o)}
        >
          {getName(o)}
        </button>
      ))}
    </div>
  );
}
