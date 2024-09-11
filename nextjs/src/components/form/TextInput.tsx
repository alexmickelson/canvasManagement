import React from "react";

export default function TextInput({
  value,
  setValue,
  label,
}: {
  value: string;
  setValue: (newValue: string) => void;
  label: string;
}) {
  return (
    <label className="block">
      {label}
      <br />
      <input
        className="bg-slate-800 rounded-md  px-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}
