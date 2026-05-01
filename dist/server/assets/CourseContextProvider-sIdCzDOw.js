import { t as CourseContext } from "./courseContext-BTpBK1uA.js";
import { jsx } from "react/jsx-runtime";
//#region src/app/course/[courseName]/context/CourseContextProvider.tsx
function CourseContextProvider({ localCourseName, children }) {
	return /* @__PURE__ */ jsx(CourseContext.Provider, {
		value: { courseName: localCourseName },
		children
	});
}
//#endregion
export { CourseContextProvider as t };
