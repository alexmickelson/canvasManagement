import { t as DayOfWeek } from "./localCourseSettings-ROLFk4Xg.js";
import { jsx } from "react/jsx-runtime";
//#region src/components/form/DayOfWeekInput.tsx
function DayOfWeekInput({ selectedDays, updateSettings }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex flex-row gap-3",
		children: Object.values(DayOfWeek).map((day) => {
			return /* @__PURE__ */ jsx("button", {
				role: "button",
				className: selectedDays.includes(day) ? "" : "unstyled btn-outline ",
				onClick: () => updateSettings(day),
				children: day
			}, day);
		})
	});
}
//#endregion
export { DayOfWeekInput as t };
