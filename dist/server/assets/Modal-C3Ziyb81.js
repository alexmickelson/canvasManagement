import { useCallback, useMemo, useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/services/urlUtils.ts
function getModuleItemUrl(courseName, moduleName, type, itemName) {
	return "/course/" + encodeURIComponent(courseName) + "/modules/" + encodeURIComponent(moduleName) + `/${type}/` + encodeURIComponent(itemName);
}
function getLectureUrl(courseName, lectureDate) {
	return "/course/" + encodeURIComponent(courseName) + "/lecture/" + encodeURIComponent(lectureDate);
}
function getLecturePreviewUrl(courseName, lectureDate) {
	return getLectureUrl(courseName, lectureDate) + "/preview";
}
function getCourseUrl(courseName) {
	return "/course/" + encodeURIComponent(courseName);
}
function getCourseSettingsUrl(courseName) {
	return "/course/" + encodeURIComponent(courseName) + "/settings";
}
//#endregion
//#region src/components/Modal.tsx
function useModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState(void 0);
	const openModal = useCallback((pos) => {
		setPosition(pos);
		setIsOpen(true);
	}, []);
	const closeModal = useCallback(() => {
		setIsOpen(false);
		setPosition(void 0);
	}, []);
	return useMemo(() => ({
		isOpen,
		openModal,
		closeModal,
		position
	}), [
		closeModal,
		isOpen,
		openModal,
		position
	]);
}
function Modal({ children, buttonText = "", buttonClass = "", modalWidth = "w-1/3", modalControl, buttonComponent, backgroundCoverColor = "bg-black/80" }) {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [buttonComponent ? buttonComponent({ openModal: () => modalControl.openModal() }) : buttonText && /* @__PURE__ */ jsx("button", {
		onClick: () => modalControl.openModal(),
		className: buttonClass,
		children: buttonText
	}), /* @__PURE__ */ jsx("div", {
		className: modalControl.isOpen ? `transition-all duration-400 fixed inset-0 ${modalControl.position ? "" : "flex items-center justify-center"} h-screen ${backgroundCoverColor} z-50 w-screen` : "hidden h-0 w-0 p-1 -z-50",
		onClick: modalControl.closeModal,
		children: /* @__PURE__ */ jsx("div", {
			onClick: (e) => {
				e.stopPropagation();
			},
			className: `bg-slate-800 ${modalControl.position ? "" : "p-6"} rounded-lg shadow-lg ${modalControl.position ? "" : modalWidth} transition-all duration-400 ${modalControl.isOpen ? "opacity-100" : "opacity-0"}`,
			style: modalControl.position ? {
				position: "fixed",
				left: modalControl.position.x,
				top: modalControl.position.y
			} : void 0,
			children: modalControl.isOpen && children({ closeModal: modalControl.closeModal })
		})
	})] });
}
//#endregion
export { getLecturePreviewUrl as a, getCourseUrl as i, useModal as n, getLectureUrl as o, getCourseSettingsUrl as r, getModuleItemUrl as s, Modal as t };
