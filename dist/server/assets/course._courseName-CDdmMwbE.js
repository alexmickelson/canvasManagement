import { t as Route } from "./course._courseName-ClWNfaik.js";
import { t as CourseContextProvider } from "./CourseContextProvider-sIdCzDOw.js";
import { Suspense } from "react";
import { Outlet } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
//#region src/routes/course.$courseName.tsx?tsr-split=component
function CourseLayout() {
	const { courseName } = Route.useParams();
	const decodedCourseName = decodeURIComponent(courseName);
	if (courseName.includes(".js.map")) return /* @__PURE__ */ jsx("div", {});
	return /* @__PURE__ */ jsx(Suspense, { children: /* @__PURE__ */ jsx(CourseContextProvider, {
		localCourseName: decodedCourseName,
		children: /* @__PURE__ */ jsx(Outlet, {})
	}) });
}
//#endregion
export { CourseLayout as component };
