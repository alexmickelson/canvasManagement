import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { o as getLectureUrl, s as getModuleItemUrl } from "./Modal-C3Ziyb81.js";
import { n as useCoursePagesByModuleByDateQuery, r as useCourseQuizzesByModuleByDateQuery, t as useCourseAssignmentsByModuleByDateQuery } from "./localCourseModuleHooks-C-SVMIE7.js";
import { r as useLecturesSuspenseQuery } from "./lectureHooks-SnCvPM2E.js";
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/editor/MonacoEditor.tsx
var InnerMonacoEditor = lazy(() => import("./InnerMonacoEditorOther-CWn_KWYe.js"));
var MonacoEditor = ({ value, onChange }) => {
	const [salt, setSalt] = useState(Date.now());
	useEffect(() => {
		setSalt(Date.now());
	}, [onChange]);
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: null,
		children: /* @__PURE__ */ jsx(InnerMonacoEditor, {
			value,
			onChange
		}, salt)
	});
};
//#endregion
//#region src/app/course/[courseName]/hooks/navigationLogic.ts
function getOrderedItems(courseName, ...calendars) {
	const itemTypes = [
		{
			key: "assignments",
			type: "assignment"
		},
		{
			key: "quizzes",
			type: "quiz"
		},
		{
			key: "pages",
			type: "page"
		}
	];
	return calendars.flatMap((calendar) => Object.entries(calendar).flatMap(([date, modules]) => Object.entries(modules).flatMap(([moduleName, moduleData]) => itemTypes.flatMap(({ key, type }) => (moduleData[key] || []).map((item) => ({
		type,
		name: item.name,
		moduleName,
		date,
		url: getModuleItemUrl(courseName, moduleName, type, item.name)
	})))))).sort((a, b) => {
		const dateCompare = a.date.localeCompare(b.date);
		if (dateCompare !== 0) return dateCompare;
		return a.name.localeCompare(b.name);
	});
}
function getOrderedLectures(weeks, courseName) {
	return weeks.flatMap((week) => week.lectures).map((lecture) => ({
		type: "lecture",
		name: lecture.date,
		date: lecture.date,
		url: getLectureUrl(courseName, lecture.date)
	}));
}
function getNavigationLinks(list, type, name, moduleName) {
	const index = list.findIndex((item) => {
		if (type === "lecture") return item.date === name;
		return item.name === name && item.type === type && item.moduleName === moduleName;
	});
	if (index === -1) return {
		previousUrl: null,
		nextUrl: null
	};
	const previousIndex = (index - 1 + list.length) % list.length;
	const nextIndex = (index + 1) % list.length;
	return {
		previousUrl: list[previousIndex].url,
		nextUrl: list[nextIndex].url
	};
}
//#endregion
//#region src/app/course/[courseName]/hooks/useOrderedCourseItems.ts
function useOrderedCourseItems() {
	const { courseName } = useCourseContext();
	const { data: weeks } = useLecturesSuspenseQuery();
	return {
		orderedItems: getOrderedItems(courseName, useCourseAssignmentsByModuleByDateQuery(), useCourseQuizzesByModuleByDateQuery(), useCoursePagesByModuleByDateQuery()),
		orderedLectures: getOrderedLectures(weeks, courseName)
	};
}
//#endregion
//#region src/app/course/[courseName]/hooks/useItemNavigation.ts
function useItemNavigation(type, name, moduleName) {
	const { orderedItems, orderedLectures } = useOrderedCourseItems();
	return getNavigationLinks(type === "lecture" ? orderedLectures : orderedItems, type, name, moduleName);
}
//#endregion
//#region src/app/course/[courseName]/components/ItemNavigationButtons.tsx
function ItemNavigationButtons({ previousUrl, nextUrl }) {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [previousUrl && /* @__PURE__ */ jsx(Link, {
		className: "btn",
		to: previousUrl,
		children: "Previous"
	}), nextUrl && /* @__PURE__ */ jsx(Link, {
		className: "btn",
		to: nextUrl,
		children: "Next"
	})] });
}
//#endregion
//#region src/app/course/[courseName]/utils/useAuthoritativeUpdates.tsx
function useAuthoritativeUpdates({ serverUpdatedAt, startingText }) {
	const [text, setText] = useState(startingText);
	const [clientDataUpdatedAt, setClientDataUpdatedAt] = useState(serverUpdatedAt);
	const [updateMonacoKey, setUpdateMonacoKey] = useState(1);
	const clientIsAuthoritative = useMemo(() => {
		return serverUpdatedAt <= clientDataUpdatedAt + 500;
	}, [clientDataUpdatedAt, serverUpdatedAt]);
	const textUpdate = useCallback((t, updateMonaco = false) => {
		setText(t);
		setClientDataUpdatedAt(Date.now());
		if (updateMonaco) setUpdateMonacoKey((t) => t + 1);
	}, []);
	return useMemo(() => ({
		clientIsAuthoritative,
		serverUpdatedAt,
		clientDataUpdatedAt,
		textUpdate,
		text,
		monacoKey: updateMonacoKey
	}), [
		clientDataUpdatedAt,
		clientIsAuthoritative,
		serverUpdatedAt,
		text,
		textUpdate,
		updateMonacoKey
	]);
}
//#endregion
//#region src/components/EditLayout.tsx
var EditLayout = ({ Header, Body, Footer }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "h-full flex flex-col align-middle px-1 max-w-[2400px] mx-auto bg-gray-900 rounded",
		children: [
			Header,
			/* @__PURE__ */ jsx("div", {
				className: "min-h-0 flex flex-row w-full flex-grow",
				children: Body
			}),
			Footer
		]
	});
};
//#endregion
export { MonacoEditor as a, useItemNavigation as i, useAuthoritativeUpdates as n, ItemNavigationButtons as r, EditLayout as t };
