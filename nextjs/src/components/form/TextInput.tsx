import React from "react";

export default function TextInput({
  value,
  setValue,
  label,
  className,
}: {
  value: string;
  setValue: (newValue: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <label className={"block " + className}>
      {label}
      <br />
      <input
        className="bg-slate-800 border border-slate-500 rounded-md w-full px-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}
