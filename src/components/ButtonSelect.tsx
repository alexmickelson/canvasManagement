import React from "react";

export default function ButtonSelect<T>({
  options,
  getName,
  setSelectedOption,
  selectedOption,
  label
}: {
  options: T[];
  getName: (value: T | undefined) => string;
  setSelectedOption: (value: T | undefined) => void;
  selectedOption: T | undefined;
  label: string;
}) {
  return (
    <div>
      <label>{label}</label>
      <div  className="flex flex-row gap-3 flex-wrap">

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
    </div>
  );
}
