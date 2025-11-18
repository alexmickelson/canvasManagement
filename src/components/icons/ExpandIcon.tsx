import React from "react";

export default function ExpandIcon({
  style,
}: {
  style?: React.CSSProperties | undefined;
}) {
  const size = "24px";
  return (
    // <svg
    //   style={style}

    //   width={size}
    //   height={size}
    //   viewBox="0 0 17 17"
    //   version="1.1"
    //   className="si-glyph si-glyph-triangle-left transition-all ms-1 "
    // >
    //   <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    //     <path
    //       d="M3.446,10.052 C2.866,9.471 2.866,8.53 3.446,7.948 L9.89,1.506 C10.471,0.924 11.993,0.667 11.993,2.506 L11.993,15.494 C11.993,17.395 10.472,17.076 9.89,16.495 L3.446,10.052 L3.446,10.052 Z"
    //       className="si-glyph-fill"
    //       style={{
    //         fill: "rgb(148 163 184 / var(--tw-text-opacity))",
    //       }}
    //     ></path>
    //   </g>
    // </svg>
    <svg
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all"
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
          // stroke="#FFFFFF"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
    </svg>
  );
}
