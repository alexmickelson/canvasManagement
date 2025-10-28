import type { FC } from "react";

export const Toggle: FC<{
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, value, onChange }) => {
  return (
    <label
      className="
        flex align-middle p-2 cursor-pointer
        text-gray-300
        hover:text-blue-400
        transition-colors duration-200 ease-in-out
      "
    >
      <input
        type="checkbox"
        className="appearance-none peer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`
          w-12 h-6 flex items-center flex-shrink-0 mx-3 p-1
          bg-gray-600 rounded-full
          duration-300 ease-in-out
          peer-checked:bg-blue-600
          after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md
          after:duration-300 peer-checked:after:translate-x-6
          group-hover:after:translate-x-1
        `}
      ></span>
      <span className="">{label}</span>
    </label>
  );
};
