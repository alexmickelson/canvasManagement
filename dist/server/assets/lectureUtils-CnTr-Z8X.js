import { a as getDateOnlyMarkdownString } from "./timeUtils-DjiIXWRA.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/ButtonSelect.tsx
function ButtonSelect({ options, getOptionName, setValue, value, label, center = false }) {
	return /* @__PURE__ */ jsxs("div", {
		className: center ? "text-center" : "",
		children: [/* @__PURE__ */ jsx("label", { children: label }), /* @__PURE__ */ jsx("div", {
			className: "flex flex-row gap-3 flex-wrap " + (center ? "justify-center" : ""),
			children: options.map((o) => /* @__PURE__ */ jsx("button", {
				type: "button",
				className: getOptionName(o) === getOptionName(value) ? "  " : "unstyled btn-outline",
				onClick: () => setValue(o),
				children: getOptionName(o)
			}, getOptionName(o)))
		})]
	});
}
//#endregion
//#region src/features/local/utils/lectureUtils.ts
function getLectureForDay(weeks, dayAsDate) {
	return weeks.flatMap((w) => w.lectures).find((l) => l.date == getDateOnlyMarkdownString(dayAsDate));
}
//#endregion
export { ButtonSelect as n, getLectureForDay as t };
