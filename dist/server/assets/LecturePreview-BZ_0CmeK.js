import { r as MarkdownDisplay } from "./BreadCrumbs-xctKec6Z.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/app/course/[courseName]/lecture/[lectureDay]/LecturePreview.tsx
function LecturePreview({ lecture }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("section", {
		className: "border-b-slate-700 border-b-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-center font-extrabold",
			children: lecture.name
		}), /* @__PURE__ */ jsx("div", {
			className: "text-center font-bold text-slate-400",
			children: lecture.date
		})]
	}), /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx(MarkdownDisplay, {
		markdown: lecture.content,
		convertImages: false
	}) })] });
}
//#endregion
export { LecturePreview as t };
