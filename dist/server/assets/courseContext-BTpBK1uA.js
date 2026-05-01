import { createContext, useContext } from "react";
var CourseContext = createContext({ courseName: "" });
function useCourseContext() {
	return useContext(CourseContext);
}
//#endregion
export { useCourseContext as n, CourseContext as t };
