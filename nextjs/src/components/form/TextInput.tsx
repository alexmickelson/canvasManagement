import React from "react";

export default function TextInput({
  value,
  setValue,
  label,
  className,
  isTextArea = false,
}: {
  value: string;
  setValue: (newValue: string) => void;
  label: string;
  className?: string;
  isTextArea?: boolean;
}) {
  return (
    <label className={"flex flex-col  " + className}>
      {label}
      <br />
      {!isTextArea && (
        <input
          className="bg-slate-800 border border-slate-500 rounded-md w-full px-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
      {isTextArea && (
        <textarea
          className="bg-slate-800 border border-slate-500 rounded-md w-full px-1 flex-grow"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}
    </label>
  );
}
