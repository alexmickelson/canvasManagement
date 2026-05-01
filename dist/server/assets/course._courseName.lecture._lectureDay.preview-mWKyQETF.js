import { a as getDateOnlyMarkdownString, r as getDateFromStringOrThrow } from "./timeUtils-DjiIXWRA.js";
import { t as Route } from "./course._courseName.lecture._lectureDay.preview-BjUR-Pc2.js";
import { t as BreadCrumbs } from "./BreadCrumbs-xctKec6Z.js";
import { r as useLecturesSuspenseQuery } from "./lectureHooks-SnCvPM2E.js";
import { t as LecturePreview$1 } from "./LecturePreview-BZ_0CmeK.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/app/course/[courseName]/lecture/[lectureDay]/preview/LecturePreviewPage.tsx
function LecturePreviewPage({ lectureDay }) {
	const { data: weeks } = useLecturesSuspenseQuery();
	const lecture = weeks.flatMap(({ lectures }) => lectures.map((lecture) => lecture)).find((l) => l.date === lectureDay);
	if (!lecture) return /* @__PURE__ */ jsx("div", { children: "lecture not found for day" });
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-full xl:flex-row flex-col ",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex-shrink flex-1 pb-1 ms-3 xl:ms-0 flex flex-row flex-wrap gap-3 content-start ",
				children: /* @__PURE__ */ jsx(BreadCrumbs, {})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex  justify-center min-h-0 px-2",
				children: /* @__PURE__ */ jsx("div", {
					className: "\n            w-full max-w-screen-lg \n            border-slate-700 border-4 rounded-md bg-gray-900/50\n            p-3 overflow-auto \n          ",
					children: /* @__PURE__ */ jsx(LecturePreview$1, { lecture })
				})
			}),
			/* @__PURE__ */ jsx("div", { className: "flex-shrink flex-1" })
		]
	});
}
//#endregion
//#region src/routes/course.$courseName.lecture.$lectureDay.preview.tsx?tsr-split=component
function LecturePreview() {
	const { lectureDay } = Route.useParams();
	return /* @__PURE__ */ jsx(LecturePreviewPage, { lectureDay: getDateOnlyMarkdownString(getDateFromStringOrThrow(decodeURIComponent(lectureDay), "lecture day in lecture page")) });
}
//#endregion
export { LecturePreview as component };
