import React from "react";

export default function ExpandIcon({
  style,
}: {
  style?: React.CSSProperties | undefined;
}) {
  const size = "24px";
  return (
    <svg
      style={style}
      width={size}
      height={size}
      className="transition-all"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          className="stroke-slate-300"
          d="M9 6L15 12L9 18"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
    </svg>
  );
}
