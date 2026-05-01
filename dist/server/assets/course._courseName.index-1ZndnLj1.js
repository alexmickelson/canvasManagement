import { t as ClientOnly } from "./ClientOnly-BaIsMvon.js";
import { n as getDayOfWeek, t as DayOfWeek } from "./localCourseSettings-ROLFk4Xg.js";
import { a as useTRPC, n as Spinner } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { a as getDateOnlyMarkdownString, n as getDateFromString, r as getDateFromStringOrThrow, t as dateToMarkdownString } from "./timeUtils-DjiIXWRA.js";
import { n as validateFileName } from "./fileNameValidation-Budh13ot.js";
import { n as getWeekNumber, t as getMonthsBetweenDates } from "./calendarMonthUtils-C5qccPhc.js";
import { r as baseCanvasUrl } from "./canvasWebRequestUtils-BTUhiXsN.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { n as useModal, o as getLectureUrl, r as getCourseSettingsUrl, s as getModuleItemUrl, t as Modal } from "./Modal-C3Ziyb81.js";
import { t as TextInput } from "./TextInput-BDfN6cG0.js";
import { a as markdownToHTMLSafe, r as MarkdownDisplay, t as BreadCrumbs } from "./BreadCrumbs-xctKec6Z.js";
import { a as useUpdateAssignmentInCanvasMutation, c as useCreateAssignmentMutation, i as useDeleteAssignmentFromCanvasMutation, l as useDeleteAssignmentMutation, n as useAddAssignmentToCanvasMutation, o as useAssignmentNamesQuery, r as useCanvasAssignmentsQuery, t as canvasAssignmentKeys, u as useUpdateAssignmentMutation } from "./canvasAssignmentHooks-QjIsauvt.js";
import { i as useReorderCanvasModuleItemsMutation, n as useAddCanvasModuleMutation, r as useCanvasModulesQuery, t as canvasCourseModuleKeys } from "./canvasModuleHooks-CfBKJ1j2.js";
import { d as useUpdateQuizMutation, i as useCanvasQuizzesQuery, n as canvasQuizKeys, r as useAddQuizToCanvasMutation, s as useCreateQuizMutation, t as CheckIcon, u as useQuizzesQueries } from "./CheckIcon-CmVj9-Zn.js";
import { i as useDeleteCanvasPageMutation, l as usePagesQueries, n as useCanvasPagesQuery, o as useCreatePageMutation, r as useCreateCanvasPageMutation, s as useDeletePageMutation, t as canvasPageKeys, u as useUpdatePageMutation } from "./canvasPageHooks-BRhUmr_q.js";
import { n as ButtonSelect, t as getLectureForDay } from "./lectureUtils-CnTr-Z8X.js";
import { o as SelectInput, t as canvasCourseKeys } from "./canvasCourseHooks-DYyGn1q3.js";
import { a as useModuleNamesQuery, i as useCreateModuleMutation, n as useCoursePagesByModuleByDateQuery, r as useCourseQuizzesByModuleByDateQuery, t as useCourseAssignmentsByModuleByDateQuery } from "./localCourseModuleHooks-C-SVMIE7.js";
import { n as useLectureUpdateMutation, r as useLecturesSuspenseQuery } from "./lectureHooks-SnCvPM2E.js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { createPortal } from "react-dom";
//#region src/components/Expandable.tsx
function Expandable({ children, ExpandableElement, defaultExpanded = false }) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const expandRef = useRef(null);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(ExpandableElement, {
		setIsExpanded,
		isExpanded
	}), /* @__PURE__ */ jsx("div", {
		ref: expandRef,
		className: ` overflow-hidden transition-all `,
		style: { maxHeight: isExpanded ? expandRef?.current?.scrollHeight : "0" },
		children
	})] });
}
//#endregion
//#region src/app/course/[courseName]/context/drag/draggingContext.tsx
var DraggingContext = createContext({
	itemDropOnDay: () => {},
	itemDropOnModule: () => {}
});
function useDraggingContext() {
	return useContext(DraggingContext);
}
//#endregion
//#region src/components/useTooltip.ts
var useTooltip = (delayMs = 150) => {
	const [visible, setVisible] = useState(false);
	const timeoutRef = useRef(null);
	return {
		visible,
		targetRef: useRef(null),
		showTooltip: useCallback(() => {
			timeoutRef.current = setTimeout(() => {
				setVisible(true);
			}, delayMs);
		}, [delayMs]),
		hideTooltip: useCallback(() => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
			setVisible(false);
		}, [])
	};
};
var DragStyleContext = createContext({ setIsDragging: () => {} });
function useDragStyleContext() {
	return useContext(DragStyleContext);
}
function DragStyleContextProvider({ children }) {
	const [isDragging, setIsDragging] = useState(false);
	return /* @__PURE__ */ jsx(DragStyleContext.Provider, {
		value: { setIsDragging },
		children: /* @__PURE__ */ jsx("div", {
			className: "h-full flex flex-col " + (isDragging ? " dragging " : ""),
			children
		})
	});
}
//#endregion
//#region src/components/Tooltip.tsx
var Tooltip = ({ message, targetRef, visible }) => {
	const rect = targetRef.current?.getBoundingClientRect();
	return createPortal(/* @__PURE__ */ jsx("div", {
		style: {
			top: (rect?.bottom ?? 0) + window.scrollY + 10,
			left: (rect?.left ?? 0) + window.scrollX + (rect?.width ?? 0) / 2
		},
		className: " absolute -translate-x-1/2  bg-gray-900 text-slate-200 text-sm  rounded-md py-1 px-2  transition-opacity duration-150  border border-slate-700 shadow-[0px_0px_10px_5px] shadow-slate-500/20  max-w-sm max-h-64 overflow-hidden " + (visible ? " opacity-100 " : " opacity-0 pointer-events-none hidden "),
		role: "tooltip",
		children: message
	}), document.body);
};
//#endregion
//#region src/app/course/[courseName]/context/calendarItemsContext.ts
var CalendarItemsContext = createContext({});
function useCalendarItemsContext() {
	return useContext(CalendarItemsContext);
}
//#endregion
//#region src/app/course/[courseName]/calendar/day/itemInDay/AssignmentDayItemContextMenu.tsx
function getDuplicateName$2(name, existingNames) {
	const match = name.match(/^(.*)\s+(\d+)$/);
	const baseName = match ? match[1] : name;
	let num = match ? parseInt(match[2]) + 1 : 2;
	while (existingNames.includes(`${baseName} ${num}`)) num++;
	return `${baseName} ${num}`;
}
var AssignmentDayItemContextMenu = ({ modalControl, item, moduleName }) => {
	const queryClient = useQueryClient();
	const { courseName } = useCourseContext();
	const calendarItems = useCalendarItemsContext();
	const createAssignmentMutation = useCreateAssignmentMutation();
	const deleteLocalMutation = useDeleteAssignmentMutation();
	const updateInCanvasMutation = useUpdateAssignmentInCanvasMutation();
	const deleteFromCanvasMutation = useDeleteAssignmentFromCanvasMutation();
	const addToCanvasMutation = useAddAssignmentToCanvasMutation();
	const { data: canvasAssignments } = useCanvasAssignmentsQuery();
	const { data: settings } = useLocalCourseSettingsQuery();
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [renaming, setRenaming] = useState(false);
	const [newName, setNewName] = useState(item.name);
	const updateAssignmentMutation = useUpdateAssignmentMutation();
	const assignmentInCanvas = canvasAssignments?.find((a) => a.name === item.name);
	const canvasUrl = assignmentInCanvas ? `${baseCanvasUrl}/courses/${settings.canvasId}/assignments/${assignmentInCanvas.id}` : void 0;
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				setConfirmingDelete(false);
				modalControl.closeModal();
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [modalControl]);
	const handleClose = () => {
		for (let i = 1; i <= 8; i += 2) setTimeout(() => {
			queryClient.invalidateQueries({ queryKey: canvasAssignmentKeys.assignments(settings.canvasId) });
		}, i * 1e3);
		setConfirmingDelete(false);
		setRenaming(false);
		modalControl.closeModal();
	};
	const handleRename = async (e) => {
		e.preventDefault();
		if (newName === item.name) {
			handleClose();
			return;
		}
		const assignment = item;
		await updateAssignmentMutation.mutateAsync({
			assignment: {
				...assignment,
				name: newName
			},
			moduleName,
			assignmentName: newName,
			previousModuleName: moduleName,
			previousAssignmentName: item.name,
			courseName
		});
		handleClose();
	};
	const handleDuplicate = () => {
		const assignment = item;
		const existingNames = Object.values(calendarItems).flatMap((modules) => (modules[moduleName]?.assignments ?? []).map((a) => a.name));
		const newName = getDuplicateName$2(item.name, existingNames);
		createAssignmentMutation.mutate({
			courseName,
			moduleName,
			assignmentName: newName,
			assignment: {
				...assignment,
				name: newName
			}
		});
		handleClose();
	};
	const handleDelete = () => {
		deleteLocalMutation.mutate({
			courseName,
			moduleName,
			assignmentName: item.name
		});
		handleClose();
	};
	const handleUpdateCanvas = () => {
		if (assignmentInCanvas) {
			updateInCanvasMutation.mutate({
				canvasAssignmentId: assignmentInCanvas.id,
				assignment: item
			});
			handleClose();
		}
	};
	const handleDeleteFromCanvas = () => {
		if (assignmentInCanvas) {
			deleteFromCanvasMutation.mutate({
				canvasAssignmentId: assignmentInCanvas.id,
				assignmentName: item.name
			});
			handleClose();
		}
	};
	const handleAddToCanvas = () => {
		addToCanvasMutation.mutate({
			assignment: item,
			moduleName
		});
		handleClose();
	};
	const baseButtonClasses = " font-bold text-left py-1";
	const normalButtonClass = "hover:bg-blue-900   disabled:opacity-50 bg-blue-900/50 text-blue-50 border border-blue-800/70 rounded ";
	const dangerClasses = "bg-rose-900/30 hover:bg-rose-950 disabled:opacity-50 text-rose-50 border border-rose-900/40 rounded";
	return /* @__PURE__ */ jsx(Modal, {
		modalControl,
		backgroundCoverColor: "bg-black/30",
		children: () => /* @__PURE__ */ jsxs("div", {
			className: "p-2",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-center p-1 text-slate-200 ",
				children: item.name
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-col gap-2",
				children: confirmingDelete ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx("div", {
						className: ``,
						children: "Delete from disk?"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: handleClose,
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Cancel"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: handleDelete,
						className: `unstyled ${baseButtonClasses} ${dangerClasses}`,
						children: "Yes, delete"
					})
				] }) : renaming ? /* @__PURE__ */ jsxs("form", {
					onSubmit: handleRename,
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ jsx(TextInput, {
							value: newName,
							setValue: setNewName,
							label: "New Name"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setRenaming(false),
							className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
							children: "Cancel"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: updateAssignmentMutation.isPending || !newName.trim(),
							className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
							children: "Save"
						})
					]
				}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
					canvasUrl && /* @__PURE__ */ jsxs(Fragment$1, { children: [
						/* @__PURE__ */ jsx("a", {
							href: canvasUrl,
							target: "_blank",
							rel: "noreferrer",
							className: ` block px-3 ${baseButtonClasses} ${normalButtonClass}`,
							onClick: handleClose,
							children: "View in Canvas"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: handleUpdateCanvas,
							disabled: updateInCanvasMutation.isPending,
							className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
							children: "Update in Canvas"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: handleDeleteFromCanvas,
							disabled: deleteFromCanvasMutation.isPending,
							className: `unstyled ${baseButtonClasses} ${dangerClasses}`,
							children: "Delete from Canvas"
						})
					] }),
					!canvasUrl && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
						onClick: handleAddToCanvas,
						disabled: addToCanvasMutation.isPending,
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Add to Canvas"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setConfirmingDelete(true),
						className: `unstyled ${baseButtonClasses} ${dangerClasses}`,
						children: "Delete from Disk"
					})] }),
					/* @__PURE__ */ jsx("button", {
						onClick: handleDuplicate,
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Duplicate"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => {
							setNewName(item.name);
							setRenaming(true);
						},
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Rename"
					})
				] })
			})]
		})
	});
};
//#endregion
//#region src/app/course/[courseName]/calendar/day/itemInDay/QuizDayItemContextMenu.tsx
function getDuplicateName$1(name, existingNames) {
	const match = name.match(/^(.*)\s+(\d+)$/);
	const baseName = match ? match[1] : name;
	let num = match ? parseInt(match[2]) + 1 : 2;
	while (existingNames.includes(`${baseName} ${num}`)) num++;
	return `${baseName} ${num}`;
}
var QuizDayItemContextMenu = ({ modalControl, item, moduleName }) => {
	const { courseName } = useCourseContext();
	const calendarItems = useCalendarItemsContext();
	const createQuizMutation = useCreateQuizMutation();
	const updateQuizMutation = useUpdateQuizMutation();
	const addToCanvasMutation = useAddQuizToCanvasMutation();
	const [renaming, setRenaming] = useState(false);
	const [newName, setNewName] = useState(item.name);
	const handleClose = () => {
		setRenaming(false);
		modalControl.closeModal();
	};
	const handleRename = async (e) => {
		e.preventDefault();
		if (newName === item.name) {
			handleClose();
			return;
		}
		const quiz = item;
		await updateQuizMutation.mutateAsync({
			quiz: {
				...quiz,
				name: newName
			},
			moduleName,
			quizName: newName,
			previousModuleName: moduleName,
			previousQuizName: item.name,
			courseName
		});
		handleClose();
	};
	const handleDuplicate = () => {
		const quiz = item;
		const existingNames = Object.values(calendarItems).flatMap((modules) => (modules[moduleName]?.quizzes ?? []).map((q) => q.name));
		const duplicateName = getDuplicateName$1(item.name, existingNames);
		createQuizMutation.mutate({
			courseName,
			moduleName,
			quizName: duplicateName,
			quiz: {
				...quiz,
				name: duplicateName
			}
		});
		handleClose();
	};
	const handleAddToCanvas = () => {
		addToCanvasMutation.mutate({
			quiz: item,
			moduleName
		});
		handleClose();
	};
	const baseButtonClasses = " font-bold text-left py-1";
	const normalButtonClass = "hover:bg-blue-900   disabled:opacity-50 bg-blue-900/50 text-blue-50 border border-blue-800/70 rounded ";
	return /* @__PURE__ */ jsx(Modal, {
		modalControl,
		backgroundCoverColor: "bg-black/30",
		children: () => /* @__PURE__ */ jsxs("div", {
			className: "p-2",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-center p-1 text-slate-200 ",
				children: item.name
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-col gap-2",
				children: renaming ? /* @__PURE__ */ jsxs("form", {
					onSubmit: handleRename,
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ jsx(TextInput, {
							value: newName,
							setValue: setNewName,
							label: "New Name"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setRenaming(false),
							className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
							children: "Cancel"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: updateQuizMutation.isPending || !newName.trim(),
							className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
							children: "Save"
						})
					]
				}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx("button", {
						onClick: handleAddToCanvas,
						disabled: addToCanvasMutation.isPending,
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Add to Canvas"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: handleDuplicate,
						disabled: createQuizMutation.isPending,
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Duplicate"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => {
							setNewName(item.name);
							setRenaming(true);
						},
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Rename"
					})
				] })
			})]
		})
	});
};
//#endregion
//#region src/app/course/[courseName]/calendar/day/itemInDay/PageDayItemContextMenu.tsx
function getDuplicateName(name, existingNames) {
	const match = name.match(/^(.*)\s+(\d+)$/);
	const baseName = match ? match[1] : name;
	let num = match ? parseInt(match[2]) + 1 : 2;
	while (existingNames.includes(`${baseName} ${num}`)) num++;
	return `${baseName} ${num}`;
}
var PageDayItemContextMenu = ({ modalControl, item, moduleName }) => {
	const queryClient = useQueryClient();
	const { courseName } = useCourseContext();
	const calendarItems = useCalendarItemsContext();
	const createPageMutation = useCreatePageMutation();
	const deleteLocalMutation = useDeletePageMutation();
	const addToCanvasMutation = useCreateCanvasPageMutation();
	const deleteFromCanvasMutation = useDeleteCanvasPageMutation();
	const { data: canvasPages } = useCanvasPagesQuery();
	const { data: settings } = useLocalCourseSettingsQuery();
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [renaming, setRenaming] = useState(false);
	const [newName, setNewName] = useState(item.name);
	const updatePageMutation = useUpdatePageMutation();
	const pageInCanvas = canvasPages?.find((p) => p.title === item.name);
	const canvasUrl = pageInCanvas ? `${baseCanvasUrl}/courses/${settings.canvasId}/pages/${pageInCanvas.url}` : void 0;
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				setConfirmingDelete(false);
				modalControl.closeModal();
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [modalControl]);
	const handleClose = () => {
		for (let i = 1; i <= 8; i += 2) setTimeout(() => {
			queryClient.invalidateQueries({ queryKey: canvasPageKeys.pagesInCourse(settings.canvasId) });
		}, i * 1e3);
		setConfirmingDelete(false);
		setRenaming(false);
		modalControl.closeModal();
	};
	const handleRename = async (e) => {
		e.preventDefault();
		if (newName === item.name) {
			handleClose();
			return;
		}
		const page = item;
		await updatePageMutation.mutateAsync({
			page: {
				...page,
				name: newName
			},
			moduleName,
			pageName: newName,
			previousModuleName: moduleName,
			previousPageName: item.name,
			courseName
		});
		handleClose();
	};
	const handleDelete = () => {
		deleteLocalMutation.mutate({
			courseName,
			moduleName,
			pageName: item.name
		});
		handleClose();
	};
	const handleDeleteFromCanvas = () => {
		if (pageInCanvas) {
			deleteFromCanvasMutation.mutate(pageInCanvas.page_id);
			handleClose();
		}
	};
	const handleAddToCanvas = () => {
		addToCanvasMutation.mutate({
			page: item,
			moduleName
		});
		handleClose();
	};
	const handleDuplicate = () => {
		const page = item;
		const existingNames = Object.values(calendarItems).flatMap((modules) => (modules[moduleName]?.pages ?? []).map((p) => p.name));
		const duplicateName = getDuplicateName(item.name, existingNames);
		createPageMutation.mutate({
			courseName,
			moduleName,
			pageName: duplicateName,
			page: {
				...page,
				name: duplicateName
			}
		});
		handleClose();
	};
	const baseButtonClasses = " font-bold text-left py-1";
	const normalButtonClass = "hover:bg-blue-900   disabled:opacity-50 bg-blue-900/50 text-blue-50 border border-blue-800/70 rounded ";
	const dangerClasses = "bg-rose-900/30 hover:bg-rose-950 disabled:opacity-50 text-rose-50 border border-rose-900/40 rounded";
	return /* @__PURE__ */ jsx(Modal, {
		modalControl,
		backgroundCoverColor: "bg-black/30",
		children: () => /* @__PURE__ */ jsxs("div", {
			className: "p-2",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-center p-1 text-slate-200 ",
				children: item.name
			}), /* @__PURE__ */ jsx("div", {
				className: "flex flex-col gap-2",
				children: confirmingDelete ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
					/* @__PURE__ */ jsx("div", {
						className: ``,
						children: "Delete from disk?"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: handleClose,
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Cancel"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: handleDelete,
						className: `unstyled ${baseButtonClasses} ${dangerClasses}`,
						children: "Yes, delete"
					})
				] }) : renaming ? /* @__PURE__ */ jsxs("form", {
					onSubmit: handleRename,
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ jsx(TextInput, {
							value: newName,
							setValue: setNewName,
							label: "New Name"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setRenaming(false),
							className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
							children: "Cancel"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: updatePageMutation.isPending || !newName.trim(),
							className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
							children: "Save"
						})
					]
				}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
					canvasUrl && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("a", {
						href: canvasUrl,
						target: "_blank",
						rel: "noreferrer",
						className: ` block px-3 ${baseButtonClasses} ${normalButtonClass}`,
						onClick: handleClose,
						children: "View in Canvas"
					}), /* @__PURE__ */ jsx("button", {
						onClick: handleDeleteFromCanvas,
						disabled: deleteFromCanvasMutation.isPending,
						className: `unstyled ${baseButtonClasses} ${dangerClasses}`,
						children: "Delete from Canvas"
					})] }),
					!canvasUrl && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("button", {
						onClick: handleAddToCanvas,
						disabled: addToCanvasMutation.isPending,
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Add to Canvas"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setConfirmingDelete(true),
						className: `unstyled ${baseButtonClasses} ${dangerClasses}`,
						children: "Delete from Disk"
					})] }),
					/* @__PURE__ */ jsx("button", {
						onClick: handleDuplicate,
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Duplicate"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => {
							setNewName(item.name);
							setRenaming(true);
						},
						className: `unstyled ${baseButtonClasses} ${normalButtonClass}`,
						children: "Rename"
					})
				] })
			})]
		})
	});
};
//#endregion
//#region src/app/course/[courseName]/calendar/day/itemInDay/GetPreviewContent.tsx
var GetPreviewContent = ({ type, item }) => {
	if (type === "assignment" && "description" in item) {
		const assignment = item;
		return /* @__PURE__ */ jsx(MarkdownDisplay, {
			markdown: assignment.description,
			replaceText: [{
				source: "insert_github_classroom_url",
				destination: assignment.githubClassroomAssignmentShareLink || ""
			}]
		});
	} else if (type === "page" && "text" in item) return /* @__PURE__ */ jsx(MarkdownDisplay, { markdown: item.text });
	else if (type === "quiz" && "questions" in item) return item.questions.map((q, i) => /* @__PURE__ */ jsx("div", {
		className: "",
		children: /* @__PURE__ */ jsx(MarkdownDisplay, { markdown: q.text })
	}, i));
	return null;
};
//#endregion
//#region src/app/course/[courseName]/ItemTypeIcon.tsx
var ItemTypeIcon = ({ type }) => {
	if (type === "assignment") return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className: "text-sky-400/30",
		children: [
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_bgCarrier",
				"stroke-width": "0"
			}),
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_tracerCarrier",
				"stroke-linecap": "round",
				"stroke-linejoin": "round"
			}),
			/* @__PURE__ */ jsxs("g", {
				id: "SVGRepo_iconCarrier",
				children: [
					/* @__PURE__ */ jsx("path", {
						d: "M21 5.4A2.4 2.4 0 0 0 18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v15.2A2.4 2.4 0 0 0 5.4 23h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4Z",
						fill: "currentColor",
						fillOpacity: ".16",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeMiterlimit: "10",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ jsx("path", {
						d: "M15.2 1H8.8a.8.8 0 0 0-.8.8v2.4a.8.8 0 0 0 .8.8h6.4a.8.8 0 0 0 .8-.8V1.8a.8.8 0 0 0-.8-.8Z",
						className: "fill-sky-950",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeMiterlimit: "10"
					}),
					/* @__PURE__ */ jsx("path", {
						d: "M7 13h10M7 10h10M7 16h6",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeMiterlimit: "10",
						strokeLinecap: "round"
					})
				]
			})
		]
	});
	if (type === "quiz") return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className: "text-orange-400/30",
		children: [
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_bgCarrier",
				strokeWidth: "0"
			}),
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_tracerCarrier",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ jsxs("g", {
				id: "SVGRepo_iconCarrier",
				children: [
					/* @__PURE__ */ jsx("path", {
						d: "M21 7v11.6c0 1.33-1.07 2.4-2.4 2.4H5.4C4.07 21 3 19.93 3 18.6V7",
						fill: "currentColor",
						fillOpacity: ".16"
					}),
					/* @__PURE__ */ jsx("path", {
						d: "M21 7v11.6c0 1.33-1.07 2.4-2.4 2.4H5.4C4.07 21 3 19.93 3 18.6V7",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeMiterlimit: "10",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ jsx("path", {
						d: "M21.4 3H2.6A1.6 1.6 0 0 0 1 4.6v.8A1.6 1.6 0 0 0 2.6 7h18.8A1.6 1.6 0 0 0 23 5.4v-.8A1.6 1.6 0 0 0 21.4 3Z",
						className: "fill-orange-950/20",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeMiterlimit: "10"
					}),
					/* @__PURE__ */ jsx("path", {
						d: "M8 11h8",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeMiterlimit: "10",
						strokeLinecap: "round"
					})
				]
			})
		]
	});
	if (type === "page") return /* @__PURE__ */ jsxs("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className: "text-indigo-300/50",
		children: [
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_bgCarrier",
				strokeWidth: "0"
			}),
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_tracerCarrier",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ jsxs("g", {
				id: "SVGRepo_iconCarrier",
				children: [/* @__PURE__ */ jsx("path", {
					d: "M18.6 3H5.4A2.4 2.4 0 0 0 3 5.4v13.2A2.4 2.4 0 0 0 5.4 21h13.2a2.4 2.4 0 0 0 2.4-2.4V5.4A2.4 2.4 0 0 0 18.6 3Z",
					fill: "currentColor",
					fillOpacity: ".16",
					stroke: "currentColor",
					strokeWidth: "1.5",
					strokeMiterlimit: "10"
				}), /* @__PURE__ */ jsx("path", {
					d: "M12 12V6M7 14V6M17 16V6",
					stroke: "currentColor",
					strokeWidth: "1.5",
					strokeMiterlimit: "10",
					strokeLinecap: "round"
				})]
			})
		]
	});
	return /* @__PURE__ */ jsx(Fragment$1, {});
};
//#endregion
//#region src/app/course/[courseName]/calendar/day/itemInDay/ItemInDay.tsx
var ItemInDay = ({ type, moduleName, status, item, message }) => {
	const { courseName } = useCourseContext();
	const { setIsDragging } = useDragStyleContext();
	const { visible, targetRef, showTooltip, hideTooltip } = useTooltip(500);
	const modalControl = useModal();
	const handleContextMenu = (e) => {
		if (type !== "assignment" && type !== "quiz" && type !== "page") return;
		e.preventDefault();
		e.stopPropagation();
		modalControl.openModal({
			x: e.clientX,
			y: e.clientY
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: " relative group ",
		children: [/* @__PURE__ */ jsx(Link, {
			to: getModuleItemUrl(courseName, moduleName, type, item.name),
			className: " border rounded-sm sm:px-1 sm:mx-1 break-words mb-1 truncate sm:text-wrap text-nowrap  bg-slate-800  block " + (status === "localOnly" && " text-slate-500 border-slate-600 ") + (status === "incomplete" && " border-rose-900 ") + (status === "published" && " border-green-800 "),
			role: "button",
			draggable: "true",
			onDragStart: (e) => {
				const draggableItem = {
					type,
					item,
					sourceModuleName: moduleName
				};
				e.dataTransfer.setData("draggableItem", JSON.stringify(draggableItem));
				setIsDragging(true);
			},
			onMouseEnter: showTooltip,
			onMouseLeave: hideTooltip,
			onContextMenu: handleContextMenu,
			ref: targetRef,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex-1",
					children: item.name
				}), /* @__PURE__ */ jsx("div", {
					className: "w-7 p-1",
					children: /* @__PURE__ */ jsx(ItemTypeIcon, { type })
				})]
			})
		}), /* @__PURE__ */ jsxs(ClientOnly, { children: [
			status === "published" ? /* @__PURE__ */ jsx(Tooltip, {
				message: /* @__PURE__ */ jsx("div", {
					className: "max-w-md",
					children: /* @__PURE__ */ jsx(GetPreviewContent, {
						type,
						item
					})
				}),
				targetRef,
				visible
			}) : /* @__PURE__ */ jsx(Tooltip, {
				message,
				targetRef,
				visible
			}),
			type === "assignment" && /* @__PURE__ */ jsx(AssignmentDayItemContextMenu, {
				modalControl,
				item,
				moduleName
			}),
			type === "quiz" && /* @__PURE__ */ jsx(QuizDayItemContextMenu, {
				modalControl,
				item,
				moduleName
			}),
			type === "page" && /* @__PURE__ */ jsx(PageDayItemContextMenu, {
				modalControl,
				item,
				moduleName
			})
		] })]
	});
};
//#endregion
//#region src/services/utils/htmlIsCloseEnough.ts
var scriptTagRegex = /<script.*?<\/script>/g;
var linkTagRegex = /<link\s+rel="[^"]*"\s+href="[^"]*"[^>]*>/g;
var nonHrefAttributeRegex = /\s+(?!href\s*=)[\w-]+="[^"]*"|\s+(?!href\s*=)[\w-]+='[^']*'|\s+(?!href\s*=)[\w-]+=[^\s>]+/g;
var courseIdInImageUrlRegex = /(<img[^>]*src=")([^"]*)(\/courses\/\d+)([^"]*")/g;
var queryParametersInImageUrlRegex = /(<img[^>]*src="[^"]*)\?[^"]*"/g;
var escapedQuoteRegex = /\\"/g;
var whitespaceRegex = /\s/g;
var hrTagRegex = /<hr\s*\/?>/g;
var brTagRegex = /<br\s*\/?>/g;
var htmlGreaterThanRegex = /&gt;/g;
var htmlLessThanRegex = /&lt;/g;
var greaterThanRegex = />/g;
var lessThanRegex = /</g;
var htmlQuoteRegex = /&quot;/g;
var quoteRegex = /"/g;
var htmlAmpersandRegex = /&amp;/g;
var ampersandRegex = /&/g;
var unicodeEscapeRegex = /\\u[\dA-Fa-f]{4}/g;
function replaceUnicodeEscapes(input) {
	return input.replace(unicodeEscapeRegex, (match) => {
		return String.fromCharCode(parseInt(match.slice(2), 16));
	});
}
var removeHtmlDetails = (html) => {
	let processed = replaceUnicodeEscapes(html).replaceAll(scriptTagRegex, "").replaceAll(linkTagRegex, "");
	processed = processed.replaceAll(nonHrefAttributeRegex, "");
	processed = processed.replace(courseIdInImageUrlRegex, "$1$2$4").replace(queryParametersInImageUrlRegex, "$1\"");
	return processed.replaceAll(escapedQuoteRegex, "\"").replaceAll(whitespaceRegex, "").replaceAll(hrTagRegex, "<hr>").replaceAll(brTagRegex, "<br>").replaceAll(htmlGreaterThanRegex, "").replaceAll(htmlLessThanRegex, "").replaceAll(greaterThanRegex, "").replaceAll(lessThanRegex, "").replaceAll(htmlQuoteRegex, "").replaceAll(quoteRegex, "").replaceAll(htmlAmpersandRegex, "").replaceAll(ampersandRegex, "");
};
var logDifferences = (simple1, simple2, original1, original2) => {
	const len1 = simple1.length;
	const len2 = simple2.length;
	const maxLen = Math.max(len1, len2);
	let firstDiff = -1;
	const diffs = [];
	for (let i = 0; i < maxLen; i++) {
		const a = simple1[i] ?? "∅";
		const b = simple2[i] ?? "∅";
		if (a !== b) {
			if (firstDiff === -1) firstDiff = i;
			diffs.push({
				index: i,
				a,
				b
			});
		}
	}
	const diffGroups = [];
	let currentGroup = null;
	for (const diff of diffs) if (currentGroup && diff.index === currentGroup.endIndex + 1) {
		currentGroup.endIndex = diff.index;
		currentGroup.a += diff.a;
		currentGroup.b += diff.b;
	} else {
		if (currentGroup) diffGroups.push(currentGroup);
		currentGroup = {
			startIndex: diff.index,
			endIndex: diff.index,
			a: diff.a,
			b: diff.b
		};
	}
	if (currentGroup) diffGroups.push(currentGroup);
	const ctx = 30;
	const start = Math.max(0, (firstDiff === -1 ? 0 : firstDiff) - ctx);
	const end1 = Math.min(len1, (firstDiff === -1 ? 0 : firstDiff) + ctx);
	const end2 = Math.min(len2, (firstDiff === -1 ? 0 : firstDiff) + ctx);
	const mark = (s, sStart, idx, sEnd) => {
		if (idx < 0) return s.slice(sStart, sEnd);
		return `${s.slice(sStart, idx)}[${s[idx] ?? "∅"}]${s.slice(idx + 1, sEnd)}`;
	};
	console.log("htmlIsCloseEnough: differences detected");
	console.log(`len1=${len1}, len2=${len2}`);
	if (firstDiff !== -1) {
		console.log(`firstDiffAt=${firstDiff}`);
		console.log("s1:", mark(simple1, start, firstDiff, end1));
		console.log("s2:", mark(simple2, start, firstDiff, end2));
	}
	console.log("difference groups:", diffGroups.slice(0, 10), original1, original2);
};
var htmlIsCloseEnough = (html1, html2) => {
	const simple1 = removeHtmlDetails(html1);
	const simple2 = removeHtmlDetails(html2);
	if (simple1 !== simple2) logDifferences(simple1, simple2, html1, html2);
	return simple1 === simple2;
};
//#endregion
//#region src/app/course/[courseName]/calendar/day/getStatus.tsx
var getStatus = ({ item, canvasItem, type, settings }) => {
	if (!canvasItem) return {
		status: "localOnly",
		message: "not in canvas"
	};
	if (!canvasItem.published) return {
		status: "incomplete",
		message: "not published in canvas"
	};
	if (type === "page") {
		if (!canvasItem.published) return {
			status: "incomplete",
			message: "canvas page not published"
		};
		return {
			status: "published",
			message: ""
		};
	} else if (type === "quiz") {
		const quiz = item;
		const canvasQuiz = canvasItem;
		if (!canvasQuiz.due_at) return {
			status: "incomplete",
			message: "due date not in canvas"
		};
		if (quiz.lockAt && !canvasQuiz.lock_at) return {
			status: "incomplete",
			message: "lock date not in canvas"
		};
		const localDueDate = dateToMarkdownString(getDateFromStringOrThrow(quiz.dueAt, "comparing due dates for day"));
		const canvasDueDate = dateToMarkdownString(getDateFromStringOrThrow(canvasQuiz.due_at, "comparing canvas due date for day"));
		if (localDueDate !== canvasDueDate) return {
			status: "incomplete",
			message: /* @__PURE__ */ jsxs("div", { children: [
				"due date different",
				/* @__PURE__ */ jsx("div", { children: localDueDate }),
				/* @__PURE__ */ jsx("div", { children: canvasDueDate })
			] })
		};
	} else if (type === "assignment") {
		const assignment = item;
		const canvasAssignment = canvasItem;
		if (!canvasAssignment.due_at) return {
			status: "incomplete",
			message: "due date not in canvas"
		};
		if (assignment.lockAt && !canvasAssignment.lock_at) return {
			status: "incomplete",
			message: "lock date not in canvas"
		};
		const localDueDate = dateToMarkdownString(getDateFromStringOrThrow(assignment.dueAt, "comparing due dates for day"));
		const canvasDueDate = dateToMarkdownString(getDateFromStringOrThrow(canvasAssignment.due_at, "comparing canvas due date for day"));
		if (localDueDate !== canvasDueDate) return {
			status: "incomplete",
			message: /* @__PURE__ */ jsxs("div", { children: [
				"due date different",
				/* @__PURE__ */ jsx("div", { children: localDueDate }),
				/* @__PURE__ */ jsx("div", { children: canvasDueDate })
			] })
		};
		try {
			if (!htmlIsCloseEnough(markdownToHTMLSafe({
				markdownString: assignment.description,
				settings,
				replaceText: [{
					source: "insert_github_classroom_url",
					destination: assignment.githubClassroomAssignmentShareLink || ""
				}]
			}), canvasAssignment.description)) return {
				status: "incomplete",
				message: "Canvas description is different"
			};
		} catch (exception) {
			return {
				status: "incomplete",
				message: "Error parsing markdown " + exception
			};
		}
	}
	return {
		status: "published",
		message: ""
	};
};
//#endregion
//#region src/app/course/[courseName]/calendar/day/useTodaysItems.tsx
function useTodaysItems(day) {
	const { data: settings } = useLocalCourseSettingsQuery();
	const dayAsDate = getDateFromStringOrThrow(day, "calculating same month in day items");
	const todaysModules = useCalendarItemsContext()[getDateOnlyMarkdownString(dayAsDate)];
	const { data: canvasAssignments } = useCanvasAssignmentsQuery();
	const { data: canvasQuizzes } = useCanvasQuizzesQuery();
	const { data: canvasPages } = useCanvasPagesQuery();
	const assignments = todaysModules ? Object.keys(todaysModules).flatMap((moduleName) => todaysModules[moduleName].assignments.map((assignment) => {
		const canvasAssignment = canvasAssignments?.find((c) => c.name === assignment.name);
		return {
			type: "assignment",
			item: assignment,
			moduleName,
			...getStatus({
				item: assignment,
				canvasItem: canvasAssignment,
				type: "assignment",
				settings
			})
		};
	})) : [];
	const quizzes = todaysModules ? Object.keys(todaysModules).flatMap((moduleName) => todaysModules[moduleName].quizzes.map((quiz) => {
		const canvasQuiz = canvasQuizzes?.find((q) => q.title === quiz.name);
		return {
			type: "quiz",
			item: quiz,
			moduleName,
			...getStatus({
				item: quiz,
				canvasItem: canvasQuiz,
				type: "quiz",
				settings
			})
		};
	})) : [];
	const pages = todaysModules ? Object.keys(todaysModules).flatMap((moduleName) => todaysModules[moduleName].pages.map((page) => {
		const canvasPage = canvasPages?.find((p) => p.title === page.name);
		return {
			type: "page",
			item: page,
			moduleName,
			...getStatus({
				item: page,
				canvasItem: canvasPage,
				type: "page",
				settings
			})
		};
	})) : [];
	return { todaysItems: [
		...assignments,
		...quizzes,
		...pages
	].sort((a, b) => {
		const dateDiff = getDateFromStringOrThrow(a.item.dueAt, "sorting today items").getTime() - getDateFromStringOrThrow(b.item.dueAt, "sorting today items").getTime();
		if (dateDiff !== 0) return dateDiff;
		return a.item.name.localeCompare(b.item.name);
	}) };
}
//#endregion
//#region src/app/course/[courseName]/modules/NewItemForm.tsx
function NewItemForm({ moduleName: defaultModuleName, onCreate = () => {}, creationDate }) {
	const { data: settings } = useLocalCourseSettingsQuery();
	const { courseName } = useCourseContext();
	const { data: modules } = useModuleNamesQuery();
	const [type, setType] = useState("Assignment");
	const [moduleName, setModuleName] = useState(defaultModuleName);
	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");
	const handleNameChange = (newName) => {
		setName(newName);
		setNameError(validateFileName(newName));
	};
	const defaultDate = getDateFromString(creationDate ? creationDate : dateToMarkdownString(/* @__PURE__ */ new Date()));
	defaultDate?.setMinutes(settings.defaultDueTime.minute);
	defaultDate?.setHours(settings.defaultDueTime.hour);
	defaultDate?.setSeconds(0);
	const [dueDate, setDueDate] = useState(dateToMarkdownString(defaultDate ?? /* @__PURE__ */ new Date()));
	const [assignmentGroup, setAssignmentGroup] = useState();
	const createPage = useCreatePageMutation();
	const createQuiz = useCreateQuizMutation();
	const createAssignment = useCreateAssignmentMutation();
	const isPending = createAssignment.isPending || createPage.isPending || createQuiz.isPending;
	return /* @__PURE__ */ jsxs("form", {
		className: "flex flex-col gap-3",
		onSubmit: (e) => {
			e.preventDefault();
			if (nameError) return;
			const dueAt = dueDate === "" ? dueDate : dateToMarkdownString(defaultDate ?? /* @__PURE__ */ new Date());
			const lockAt = settings.defaultLockHoursOffset === void 0 ? void 0 : dateToMarkdownString(addHoursToDate(getDateFromStringOrThrow(dueDate, "getting default lock time"), settings.defaultLockHoursOffset));
			if (!moduleName) return;
			if (type === "Assignment") createAssignment.mutate({
				assignment: {
					name,
					description: "",
					localAssignmentGroupName: assignmentGroup?.name ?? "",
					dueAt,
					lockAt,
					submissionTypes: settings.defaultAssignmentSubmissionTypes,
					allowedFileUploadExtensions: settings.defaultFileUploadTypes,
					rubric: []
				},
				moduleName,
				assignmentName: name,
				courseName
			});
			else if (type === "Quiz") createQuiz.mutate({
				quiz: {
					name,
					description: "",
					localAssignmentGroupName: assignmentGroup?.name ?? "",
					dueAt,
					lockAt,
					shuffleAnswers: true,
					showCorrectAnswers: true,
					oneQuestionAtATime: true,
					allowedAttempts: -1,
					questions: []
				},
				moduleName,
				quizName: name,
				courseName
			});
			else if (type === "Page") createPage.mutate({
				page: {
					name,
					text: "",
					dueAt
				},
				moduleName,
				pageName: name,
				courseName
			});
			onCreate();
		},
		children: [
			/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(TextInput, {
				label: type + " due date",
				value: dueDate ?? "",
				setValue: setDueDate
			}) }),
			/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(SelectInput, {
				value: moduleName,
				setValue: (m) => setModuleName(m),
				label: "Module",
				options: modules,
				getOptionName: (m) => m
			}) }),
			/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ButtonSelect, {
				options: [
					"Assignment",
					"Quiz",
					"Page"
				],
				getOptionName: (o) => o?.toString() ?? "",
				setValue: (t) => setType(t ?? "Assignment"),
				value: type,
				label: "Type"
			}) }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(TextInput, {
				label: type + " Name",
				value: name,
				setValue: handleNameChange
			}), nameError && /* @__PURE__ */ jsx("div", {
				className: "text-red-300 bg-red-950/50 border p-1 rounded border-red-900/50 text-sm mt-1",
				children: nameError
			})] }),
			/* @__PURE__ */ jsx("div", { children: type !== "Page" && /* @__PURE__ */ jsx(ButtonSelect, {
				options: settings.assignmentGroups,
				getOptionName: (g) => g?.name ?? "",
				setValue: setAssignmentGroup,
				value: assignmentGroup,
				label: "Assignment Group"
			}) }),
			settings.assignmentGroups.length === 0 && /* @__PURE__ */ jsx("div", { children: "No assignment groups created, create them in the course settings page" }),
			/* @__PURE__ */ jsx("button", {
				disabled: !!nameError,
				type: "submit",
				children: "Create"
			}),
			isPending && /* @__PURE__ */ jsx(Spinner, {})
		]
	});
}
function addHoursToDate(date, hours) {
	const newDate = new Date(date.getTime());
	newDate.setHours(newDate.getHours() + hours);
	return newDate;
}
//#endregion
//#region src/app/course/[courseName]/calendar/day/DayTitle.tsx
function DayTitle({ day, dayAsDate }) {
	const { courseName } = useCourseContext();
	const { data: weeks } = useLecturesSuspenseQuery();
	const { setIsDragging } = useDragStyleContext();
	const todaysLecture = getLectureForDay(weeks, dayAsDate);
	const modal = useModal();
	const { visible, targetRef, showTooltip, hideTooltip } = useTooltip();
	const lectureName = todaysLecture && (todaysLecture.name || "lecture");
	return /* @__PURE__ */ jsxs("div", {
		className: "flex justify-between",
		children: [
			/* @__PURE__ */ jsxs(Link, {
				className: "ms-1 me-1 truncate text-nowrap transition-all hover:font-bold hover:text-slate-300",
				to: getLectureUrl(courseName, day),
				draggable: true,
				onDragStart: (e) => {
					if (todaysLecture) {
						const draggableItem = {
							type: "lecture",
							item: {
								...todaysLecture,
								dueAt: todaysLecture.date
							},
							sourceModuleName: void 0
						};
						e.dataTransfer.setData("draggableItem", JSON.stringify(draggableItem));
						setIsDragging(true);
					}
				},
				ref: targetRef,
				onMouseEnter: showTooltip,
				onMouseLeave: hideTooltip,
				children: [
					dayAsDate.getDate(),
					" ",
					lectureName
				]
			}),
			/* @__PURE__ */ jsx(ClientOnly, { children: (lectureName?.length ?? 0) > 0 && /* @__PURE__ */ jsx(Tooltip, {
				message: /* @__PURE__ */ jsxs("div", { children: [lectureName, todaysLecture?.content && /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsx("pre", { children: /* @__PURE__ */ jsx("code", { children: todaysLecture?.content }) }) })] }),
				targetRef,
				visible
			}) }),
			/* @__PURE__ */ jsx(Modal, {
				buttonComponent: ({ openModal }) => /* @__PURE__ */ jsxs("svg", {
					viewBox: "0 0 24 24",
					width: 22,
					height: 22,
					className: "cursor-pointer hover:scale-125 hover:stroke-slate-400 stroke-slate-500 transition-all m-0.5",
					fill: "none",
					xmlns: "http://www.w3.org/2000/svg",
					onClick: openModal,
					children: [
						/* @__PURE__ */ jsx("g", {
							id: "SVGRepo_bgCarrier",
							strokeWidth: "0"
						}),
						/* @__PURE__ */ jsx("g", {
							id: "SVGRepo_tracerCarrier",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						}),
						/* @__PURE__ */ jsx("g", {
							id: "SVGRepo_iconCarrier",
							children: /* @__PURE__ */ jsx("path", {
								d: "M6 12H18M12 6V18",
								className: " ",
								strokeWidth: "3",
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						})
					]
				}),
				modalControl: modal,
				modalWidth: "w-135",
				children: ({ closeModal }) => /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(NewItemForm, {
						creationDate: day,
						onCreate: closeModal
					}),
					/* @__PURE__ */ jsx("br", {}),
					/* @__PURE__ */ jsx("button", {
						onClick: closeModal,
						children: "close"
					})
				] })
			})
		]
	});
}
//#endregion
//#region src/app/course/[courseName]/calendar/day/Day.tsx
function Day({ day, month }) {
	const dayAsDate = getDateFromStringOrThrow(day, "calculating same month in day");
	const isToday = getDateOnlyMarkdownString(/* @__PURE__ */ new Date()) === getDateOnlyMarkdownString(dayAsDate);
	const { data: settings } = useLocalCourseSettingsQuery();
	const { itemDropOnDay } = useDraggingContext();
	const { todaysItems } = useTodaysItems(day);
	const isInSameMonth = dayAsDate.getMonth() + 1 == month;
	const classOnThisDay = settings.daysOfWeek.includes(getDayOfWeek(dayAsDate));
	const holidayNameToday = settings.holidays.reduce((holidaysHappeningToday, holiday) => {
		const holidayDates = holiday.days.map((d) => getDateOnlyMarkdownString(getDateFromStringOrThrow(d, "holiday date in day component")));
		const today = getDateOnlyMarkdownString(dayAsDate);
		if (holidayDates.includes(today)) return [...holidaysHappeningToday, holiday.name];
		return holidaysHappeningToday;
	}, []);
	const semesterStart = getDateFromStringOrThrow(settings.startDate, "comparing start date in day");
	const semesterEnd = getDateFromStringOrThrow(settings.endDate, "comparing end date in day");
	const meetingClasses = classOnThisDay && semesterStart < dayAsDate && semesterEnd > dayAsDate && holidayNameToday.length === 0 ? " bg-slate-900 " : " bg-gray-950";
	const todayClasses = isToday ? " border  border-blue-700 shadow-[0_0px_10px_0px] shadow-blue-500/50 " : " ";
	const monthClass = isInSameMonth && !isToday ? " border border-slate-700 " : " ";
	return /* @__PURE__ */ jsx("div", {
		className: " rounded-lg sm:m-1 m-0.5 min-h-10 " + meetingClasses + monthClass + todayClasses,
		onDrop: (e) => itemDropOnDay(e, day),
		onDragOver: (e) => e.preventDefault(),
		children: /* @__PURE__ */ jsxs("div", {
			className: "draggingDay flex flex-col",
			children: [
				/* @__PURE__ */ jsx(DayTitle, {
					day,
					dayAsDate
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grow",
					children: todaysItems.map(({ type, item, moduleName, status, message }) => /* @__PURE__ */ jsx(ItemInDay, {
						type,
						moduleName,
						item,
						status,
						message
					}, `${type}-${item.name}`))
				}),
				/* @__PURE__ */ jsx("div", { children: holidayNameToday.map((n) => /* @__PURE__ */ jsx("div", {
					className: "font-extrabold text-blue-100 text-center",
					children: n
				}, n)) })
			]
		})
	});
}
//#endregion
//#region src/app/course/[courseName]/calendar/CalendarWeek.tsx
function CalendarWeek({ week, monthNumber }) {
	const { data: settings } = useLocalCourseSettingsQuery();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-row",
		children: [/* @__PURE__ */ jsx("div", {
			className: "my-auto text-gray-400 w-6 text-center flex-none sm:block hidden",
			children: getWeekNumber(getDateFromStringOrThrow(settings.startDate, "week calculation start date"), getDateFromStringOrThrow(week[0], "week calculation first day of week")).toString().padStart(2, "0")
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-7 grow",
			children: week.map((day, dayIndex) => /* @__PURE__ */ jsx(Day, {
				day,
				month: monthNumber
			}, dayIndex))
		})]
	});
}
//#endregion
//#region src/components/icons/UpChevron.tsx
function UpChevron() {
	return /* @__PURE__ */ jsx("svg", {
		height: "1em",
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: /* @__PURE__ */ jsx("path", {
			d: "M17 18L12 13L7 18M17 11L12 6L7 11",
			className: "stroke-slate-100",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
//#endregion
//#region src/components/icons/DownChevron.tsx
function DownChevron() {
	return /* @__PURE__ */ jsx("svg", {
		height: "1em",
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: /* @__PURE__ */ jsx("path", {
			d: "M7 13L12 18L17 13M7 6L12 11L17 6",
			className: "stroke-slate-100",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
//#endregion
//#region src/app/course/[courseName]/calendar/CalendarMonth.tsx
var CalendarMonth = ({ month }) => {
	const four_days_in_milliseconds = 3456e5;
	const { data: settings } = useLocalCourseSettingsQuery();
	const startDate = getDateFromStringOrThrow(settings.startDate, "week calculation start date");
	const isPastSemester = Date.now() > new Date(settings.endDate).getTime();
	const shouldCollapse = getWeekNumber(startDate, new Date(Date.now() - four_days_in_milliseconds)) >= getWeekNumber(startDate, new Date(month.year, month.month, 1)) && !isPastSemester;
	const monthName = new Date(month.year, month.month - 1, 1).toLocaleString("default", { month: "long" });
	const weekDaysList = Object.values(DayOfWeek);
	return /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsxs(Expandable, {
		defaultExpanded: !shouldCollapse,
		ExpandableElement: ({ setIsExpanded, isExpanded }) => /* @__PURE__ */ jsx("div", {
			className: "flex justify-center",
			children: /* @__PURE__ */ jsxs("h3", {
				className: "text-2xl transition-all duration-500 hover:text-slate-50 underline hover:scale-105 flex cursor-pointer",
				onClick: () => setIsExpanded((e) => !e),
				role: "button",
				children: [monthName, /* @__PURE__ */ jsx("div", {
					className: "my-auto",
					children: isExpanded ? /* @__PURE__ */ jsx(UpChevron, {}) : /* @__PURE__ */ jsx(DownChevron, {})
				})]
			})
		}),
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-7 text-center fw-bold ms-3",
			children: weekDaysList.map((day) => /* @__PURE__ */ jsxs("div", {
				className: "",
				children: [/* @__PURE__ */ jsx("span", {
					className: "hidden xl:inline",
					children: day
				}), /* @__PURE__ */ jsx("span", {
					className: "xl:hidden inline",
					children: day.slice(0, 3)
				})]
			}, day))
		}), month.daysByWeek.map((week, weekIndex) => /* @__PURE__ */ jsx(CalendarWeek, {
			week,
			monthNumber: month.month
		}, weekIndex))]
	}) });
};
//#endregion
//#region src/app/course/[courseName]/context/CalendarItemsContextProvider.tsx
function CalendarItemsContextProvider({ children }) {
	const quizzesByModuleByDate = useCourseQuizzesByModuleByDateQuery();
	const assignmentsByModuleByDate = useCourseAssignmentsByModuleByDateQuery();
	const pagesByModuleByDate = useCoursePagesByModuleByDateQuery();
	const allItemsByModuleByDate = [...new Set([
		...Object.keys(assignmentsByModuleByDate),
		...Object.keys(quizzesByModuleByDate),
		...Object.keys(pagesByModuleByDate)
	])].reduce((prev, day) => {
		const assignmentModulesInDay = assignmentsByModuleByDate[day] ?? {};
		const quizModulesInDay = quizzesByModuleByDate[day] ?? {};
		const pageModulesInDay = pagesByModuleByDate[day] ?? {};
		const modulesInDate = [...new Set([
			...Object.keys(assignmentModulesInDay),
			...Object.keys(quizModulesInDay),
			...Object.keys(pageModulesInDay)
		])].reduce((prev, moduleName) => {
			return {
				...prev,
				[moduleName]: {
					assignments: assignmentModulesInDay[moduleName] ? assignmentModulesInDay[moduleName].assignments : [],
					quizzes: quizModulesInDay[moduleName] ? quizModulesInDay[moduleName].quizzes : [],
					pages: pageModulesInDay[moduleName] ? pageModulesInDay[moduleName].pages : []
				}
			};
		}, {});
		return {
			...prev,
			[day]: modulesInDate
		};
	}, {});
	return /* @__PURE__ */ jsx(CalendarItemsContext.Provider, {
		value: allItemsByModuleByDate,
		children
	});
}
//#endregion
//#region src/app/course/[courseName]/calendar/CourseCalendar.tsx
function CourseCalendar() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const startDateTime = useMemo(() => getDateFromStringOrThrow(settings.startDate, "course start date"), [settings.startDate]);
	const endDateTime = useMemo(() => {
		const date = getDateFromStringOrThrow(settings.endDate, "course end date");
		date.setDate(date.getDate() + 14);
		return date;
	}, [settings.endDate]);
	const months = useMemo(() => getMonthsBetweenDates(startDateTime, endDateTime), [endDateTime, startDateTime]);
	const divRef = useRef(null);
	useEffect(() => {
		const storageKey = `courseScroll-${settings.name}`;
		const scrollValue = localStorage.getItem(storageKey);
		console.log("resetting scroll", scrollValue, divRef.current);
		const yValue = scrollValue ? parseInt(scrollValue) : 0;
		if (!divRef.current) console.log("cannot scroll, ref is null");
		else divRef.current.scroll({
			top: yValue,
			left: 0
		});
	}, [settings.name]);
	return /* @__PURE__ */ jsx("div", {
		className: "\n        min-h-0\n        flex-grow\n        border-2\n        border-gray-900\n        rounded-lg\n        bg-linear-to-br\n        from-blue-950/30\n        to-fuchsia-950/10 to-60%\n        sm:p-1\n      ",
		children: /* @__PURE__ */ jsx("div", {
			className: "h-full overflow-y-scroll sm:pe-1",
			onScroll: (e) => {
				const storageKey = `courseScroll-${settings.name}`;
				localStorage.setItem(storageKey, e.currentTarget.scrollTop.toString());
			},
			ref: divRef,
			children: /* @__PURE__ */ jsx(CalendarItemsContextProvider, { children: months.map((month) => /* @__PURE__ */ jsx(CalendarMonth, { month }, month.month + "" + month.year)) })
		})
	});
}
//#endregion
//#region src/app/course/[courseName]/context/LectureReplaceModal.tsx
function LectureReplaceModal({ modal, modalText, modalCallback, isLoading }) {
	return /* @__PURE__ */ jsx(Modal, {
		modalControl: modal,
		buttonText: "",
		buttonClass: "hidden",
		children: ({ closeModal }) => /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-center",
				children: modalText
			}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-around gap-3",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => {
						console.log("deleting");
						modalCallback();
					},
					disabled: isLoading,
					className: "btn-danger",
					children: "Yes"
				}), /* @__PURE__ */ jsx("button", {
					onClick: closeModal,
					disabled: isLoading,
					children: "No"
				})]
			}),
			isLoading && /* @__PURE__ */ jsx(Spinner, {})
		] })
	});
}
//#endregion
//#region src/app/course/[courseName]/context/drag/useItemDropOnModule.ts
function useItemDropOnModule({ setIsDragging }) {
	const updateQuizMutation = useUpdateQuizMutation();
	const updateAssignmentMutation = useUpdateAssignmentMutation();
	const updatePageMutation = useUpdatePageMutation();
	const { courseName } = useCourseContext();
	return useCallback((e, dropModuleName) => {
		console.log("dropping on module");
		const rawData = e.dataTransfer.getData("draggableItem");
		if (!rawData) return;
		const itemBeingDragged = JSON.parse(rawData);
		if (itemBeingDragged) {
			if (itemBeingDragged.type === "quiz") updateQuiz();
			else if (itemBeingDragged.type === "assignment") updateAssignment();
			else if (itemBeingDragged.type === "page") updatePage();
			else if (itemBeingDragged.type === "lecture") console.log("cannot drop lecture on module, only on days");
		}
		setIsDragging(false);
		function updateQuiz() {
			const quiz = itemBeingDragged.item;
			if (itemBeingDragged.sourceModuleName) updateQuizMutation.mutate({
				quiz,
				quizName: quiz.name,
				moduleName: dropModuleName,
				previousModuleName: itemBeingDragged.sourceModuleName,
				previousQuizName: quiz.name,
				courseName
			});
			else console.error(`error dropping quiz, sourceModuleName is undefined `, quiz);
		}
		function updateAssignment() {
			const assignment = itemBeingDragged.item;
			if (itemBeingDragged.sourceModuleName) updateAssignmentMutation.mutate({
				assignment,
				previousModuleName: itemBeingDragged.sourceModuleName,
				moduleName: dropModuleName,
				assignmentName: assignment.name,
				previousAssignmentName: assignment.name,
				courseName
			});
			else console.error(`error dropping assignment, sourceModuleName is undefined `, assignment);
		}
		function updatePage() {
			const page = itemBeingDragged.item;
			if (itemBeingDragged.sourceModuleName) updatePageMutation.mutate({
				page,
				moduleName: dropModuleName,
				pageName: page.name,
				previousPageName: page.name,
				previousModuleName: itemBeingDragged.sourceModuleName,
				courseName
			});
			else console.error(`error dropping page, sourceModuleName is undefined `, page);
		}
	}, [
		courseName,
		setIsDragging,
		updateAssignmentMutation,
		updatePageMutation,
		updateQuizMutation
	]);
}
//#endregion
//#region src/app/course/[courseName]/context/drag/getNewLockDate.ts
function getNewLockDate(originalDueDate, originalLockDate, dayAsDate) {
	const dueDate = getDateFromStringOrThrow(originalDueDate, "dueAt date");
	const lockDate = originalLockDate === void 0 ? void 0 : getDateFromStringOrThrow(originalLockDate, "lockAt date");
	const originalOffset = lockDate === void 0 ? void 0 : lockDate.getTime() - dueDate.getTime();
	const newLockDate = originalOffset === void 0 ? void 0 : new Date(dayAsDate.getTime() + originalOffset);
	return newLockDate === void 0 ? void 0 : dateToMarkdownString(newLockDate);
}
//#endregion
//#region src/app/course/[courseName]/context/drag/useItemDropOnDay.ts
function useItemDropOnDay({ setIsDragging, setModalText, setModalCallback, setIsLoading, modal }) {
	const { data: settings } = useLocalCourseSettingsQuery();
	const { courseName } = useCourseContext();
	const { data: weeks } = useLecturesSuspenseQuery();
	const updateQuizMutation = useUpdateQuizMutation();
	const updateLectureMutation = useLectureUpdateMutation();
	const updateAssignmentMutation = useUpdateAssignmentMutation();
	const updatePageMutation = useUpdatePageMutation();
	return useCallback((e, day) => {
		const rawData = e.dataTransfer.getData("draggableItem");
		if (!rawData) return;
		const itemBeingDragged = JSON.parse(rawData);
		if (itemBeingDragged) {
			const dayAsDate = getDateWithDefaultDueTime();
			if (itemBeingDragged.type === "quiz") updateQuiz(dayAsDate);
			else if (itemBeingDragged.type === "assignment") updateAssignment(dayAsDate);
			else if (itemBeingDragged.type === "page") updatePage(dayAsDate);
			else if (itemBeingDragged.type === "lecture") updateLecture(dayAsDate);
		}
		setIsDragging(false);
		function getDateWithDefaultDueTime() {
			const dayAsDate = getDateFromStringOrThrow(day, "in drop callback");
			dayAsDate.setHours(settings.defaultDueTime.hour);
			dayAsDate.setMinutes(settings.defaultDueTime.minute);
			dayAsDate.setSeconds(0);
			return dayAsDate;
		}
		function updateLecture(dayAsDate) {
			const { dueAt: _, ...lecture } = itemBeingDragged.item;
			console.log("dropped lecture on day");
			const existingLecture = getLectureForDay(weeks, dayAsDate);
			if (existingLecture) {
				console.log("attempting to drop on existing lecture");
				setModalText(`Are you sure you want to replace ${existingLecture?.name || "Un-named Lecture"} with ${lecture.name}? This will delete ${existingLecture?.name || "Un-named Lecture"}.`);
				setModalCallback(() => async () => {
					console.log("running callback");
					setIsLoading(true);
					await updateLectureMutation.mutateAsync({
						previousDay: lecture.date,
						lecture: {
							...lecture,
							date: getDateOnlyMarkdownString(dayAsDate)
						},
						courseName,
						settings
					});
					setModalText("");
					setModalCallback(() => {});
					modal.closeModal();
					setIsLoading(false);
				});
				modal.openModal();
			} else {
				console.log("updating lecture on unique day");
				updateLectureMutation.mutate({
					previousDay: lecture.date,
					lecture: {
						...lecture,
						date: getDateOnlyMarkdownString(dayAsDate)
					},
					courseName,
					settings
				});
			}
		}
		function updateQuiz(dayAsDate) {
			const previousQuiz = itemBeingDragged.item;
			if (!itemBeingDragged.sourceModuleName) {
				console.error("error dropping quiz on day, sourceModuleName is undefined");
				return;
			}
			const quiz = {
				...previousQuiz,
				dueAt: dateToMarkdownString(dayAsDate),
				lockAt: getNewLockDate(previousQuiz.dueAt, previousQuiz.lockAt, dayAsDate)
			};
			updateQuizMutation.mutate({
				quiz,
				quizName: quiz.name,
				moduleName: itemBeingDragged.sourceModuleName,
				previousModuleName: itemBeingDragged.sourceModuleName,
				previousQuizName: quiz.name,
				courseName: settings.name
			});
		}
		function updatePage(dayAsDate) {
			const previousPage = itemBeingDragged.item;
			if (!itemBeingDragged.sourceModuleName) {
				console.error("error dropping page on day, sourceModuleName is undefined");
				return;
			}
			const page = {
				...previousPage,
				dueAt: dateToMarkdownString(dayAsDate)
			};
			updatePageMutation.mutate({
				page,
				moduleName: itemBeingDragged.sourceModuleName,
				pageName: page.name,
				previousPageName: page.name,
				previousModuleName: itemBeingDragged.sourceModuleName,
				courseName: settings.name
			});
		}
		function updateAssignment(dayAsDate) {
			if (!itemBeingDragged.sourceModuleName) {
				console.error("error dropping assignment on day, sourceModuleName is undefined");
				return;
			}
			const previousAssignment = itemBeingDragged.item;
			const assignment = {
				...previousAssignment,
				dueAt: dateToMarkdownString(dayAsDate),
				lockAt: getNewLockDate(previousAssignment.dueAt, previousAssignment.lockAt, dayAsDate)
			};
			updateAssignmentMutation.mutate({
				assignment,
				previousModuleName: itemBeingDragged.sourceModuleName,
				moduleName: itemBeingDragged.sourceModuleName,
				assignmentName: assignment.name,
				previousAssignmentName: assignment.name,
				courseName: settings.name
			});
		}
	}, [
		courseName,
		modal,
		setIsDragging,
		setIsLoading,
		setModalCallback,
		setModalText,
		settings,
		updateAssignmentMutation,
		updateLectureMutation,
		updatePageMutation,
		updateQuizMutation,
		weeks
	]);
}
//#endregion
//#region src/app/course/[courseName]/context/drag/DraggingContextProvider.tsx
function DraggingContextProvider({ children }) {
	const { setIsDragging } = useDragStyleContext();
	const [isLoading, setIsLoading] = useState(false);
	const [modalText, setModalText] = useState("");
	const modal = useModal();
	const [modalCallback, setModalCallback] = useState(() => {});
	useEffect(() => {
		const handleDrop = () => {
			console.log("drop on window");
			setIsDragging(false);
		};
		const preventDefault = (e) => e.preventDefault();
		if (typeof window !== "undefined") {
			window.addEventListener("drop", handleDrop);
			window.addEventListener("dragover", preventDefault);
		}
		return () => {
			window.removeEventListener("drop", handleDrop);
			window.addEventListener("dragover", preventDefault);
		};
	}, [setIsDragging]);
	const itemDropOnModule = useItemDropOnModule({ setIsDragging });
	const itemDropOnDay = useItemDropOnDay({
		setIsDragging,
		setModalText,
		setModalCallback,
		setIsLoading,
		modal
	});
	return /* @__PURE__ */ jsxs(DraggingContext.Provider, {
		value: {
			itemDropOnDay,
			itemDropOnModule
		},
		children: [/* @__PURE__ */ jsx(LectureReplaceModal, {
			modal,
			modalText,
			modalCallback,
			isLoading
		}), children]
	});
}
//#endregion
//#region src/app/course/[courseName]/CourseNavigation.tsx
function CourseNavigation() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	const canvasAssignmentsQuery = useCanvasAssignmentsQuery();
	const canvasAssignmentGroupsQuery = useCanvasAssignmentsQuery();
	const canvasModulesQuery = useCanvasModulesQuery();
	const canvasPagesQuery = useCanvasPagesQuery();
	const canvasQuizzesQuery = useCanvasQuizzesQuery();
	return /* @__PURE__ */ jsxs("div", {
		className: "pb-1 flex flex-row gap-3",
		children: [
			/* @__PURE__ */ jsx(BreadCrumbs, {}),
			/* @__PURE__ */ jsx("a", {
				href: `https://snow.instructure.com/courses/${settings.canvasId}`,
				className: "btn",
				target: "_blank",
				children: "View in Canvas"
			}),
			canvasAssignmentsQuery.isFetching || canvasAssignmentGroupsQuery.isFetching || canvasModulesQuery.isFetching || canvasPagesQuery.isFetching || canvasQuizzesQuery.isFetching ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-row",
				children: [/* @__PURE__ */ jsx(Spinner, {}), /* @__PURE__ */ jsx("div", {
					className: "ps-1",
					children: "loading canvas data"
				})]
			}) : /* @__PURE__ */ jsx("button", {
				className: "unstyled btn-outline",
				onClick: () => {
					queryClient.invalidateQueries({ queryKey: canvasAssignmentKeys.assignments(settings.canvasId) });
					queryClient.invalidateQueries({ queryKey: canvasCourseKeys.assignmentGroups(settings.canvasId) });
					queryClient.invalidateQueries({ queryKey: canvasCourseModuleKeys.modules(settings.canvasId) });
					queryClient.invalidateQueries({ queryKey: canvasPageKeys.pagesInCourse(settings.canvasId) });
					queryClient.invalidateQueries({ queryKey: canvasQuizKeys.quizzes(settings.canvasId) });
				},
				children: "Reload Canvas Data"
			}),
			settings?.startDate && /* @__PURE__ */ jsx("div", {
				className: "my-auto text-slate-500",
				children: getSemesterName(settings.startDate)
			})
		]
	});
}
function getSemesterName(startDate) {
	const start = new Date(startDate);
	const year = start.getFullYear();
	const month = start.getMonth();
	if (month < 4) return `Spring ${year}`;
	else if (month < 7) return `Summer ${year}`;
	else return `Fall ${year}`;
}
//#endregion
//#region src/app/course/[courseName]/CourseSettingsLink.tsx
function CourseSettingsLink() {
	const { courseName } = useCourseContext();
	const { data: settings } = useLocalCourseSettingsQuery();
	return /* @__PURE__ */ jsxs("div", { children: [settings.name, /* @__PURE__ */ jsx(Link, {
		className: "mx-3 underline",
		to: getCourseSettingsUrl(courseName),
		children: "Course Settings"
	})] });
}
//#endregion
//#region src/app/course/[courseName]/modules/ModuleCanvasStatus.tsx
function ModuleCanvasStatus({ moduleName }) {
	const { data: canvasModules } = useCanvasModulesQuery();
	const addToCanvas = useAddCanvasModuleMutation();
	const canvasModule = canvasModules?.find((c) => c.name === moduleName);
	return /* @__PURE__ */ jsxs("div", {
		className: "text-slate-400 text-end",
		children: [
			!canvasModule && /* @__PURE__ */ jsx("div", {
				className: "text-rose-400",
				children: "Not in Canvas"
			}),
			!canvasModule && /* @__PURE__ */ jsx("button", {
				disabled: addToCanvas.isPending,
				onClick: () => addToCanvas.mutate(moduleName),
				children: addToCanvas.isPending ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsx("div", { children: "Add" })
			}),
			canvasModule && !canvasModule.published && /* @__PURE__ */ jsx("div", { children: "Not Published" }),
			canvasModule && canvasModule.published && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(CheckIcon, {}) })
		]
	});
}
//#endregion
//#region src/components/icons/ExpandIcon.tsx
function ExpandIcon({ style }) {
	const size = "24px";
	return /* @__PURE__ */ jsxs("svg", {
		style,
		width: size,
		height: size,
		className: "transition-all",
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: [
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_bgCarrier",
				strokeWidth: "0"
			}),
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_tracerCarrier",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ jsx("g", {
				id: "SVGRepo_iconCarrier",
				children: /* @__PURE__ */ jsx("path", {
					className: "stroke-slate-300",
					d: "M9 6L15 12L9 18",
					strokeWidth: "2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			})
		]
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/ExpandableModule.tsx
function ExpandableModule({ moduleName }) {
	const trpc = useTRPC();
	const { itemDropOnModule } = useDraggingContext();
	const { courseName } = useCourseContext();
	const { data: assignmentNames } = useAssignmentNamesQuery(moduleName);
	const assignments = useSuspenseQueries({ queries: assignmentNames.map((assignmentName) => trpc.assignment.getAssignment.queryOptions({
		courseName,
		moduleName,
		assignmentName
	})) }).map((result) => result.data);
	const { data: quizzes } = useQuizzesQueries(moduleName);
	const { data: pages } = usePagesQueries(moduleName);
	const modal = useModal();
	const reorderMutation = useReorderCanvasModuleItemsMutation();
	const { data: canvasModules } = useCanvasModulesQuery();
	const moduleItems = (assignments ?? []).map((a) => ({
		type: "assignment",
		item: a
	})).concat(quizzes.map((q) => ({
		type: "quiz",
		item: q
	}))).concat(pages.map((p) => ({
		type: "page",
		item: p
	}))).sort((a, b) => getDateFromStringOrThrow(a.item.dueAt, "item due date in expandable module").getTime() - getDateFromStringOrThrow(b.item.dueAt, "item due date in expandable module").getTime());
	const { data: settings } = useLocalCourseSettingsQuery();
	const startDate = getDateFromStringOrThrow(settings.startDate, "expandable module week grouping");
	const groupedItems = moduleItems.reduce((groups, moduleItem) => {
		const date = getDateFromStringOrThrow(moduleItem.item.dueAt, "expandable module item grouping");
		const dateKey = getDateOnlyMarkdownString(date);
		const lastGroup = groups[groups.length - 1];
		if (lastGroup && lastGroup.dateKey === dateKey) return [...groups.slice(0, -1), {
			...lastGroup,
			items: [...lastGroup.items, moduleItem]
		}];
		const weekNum = getWeekNumber(startDate, date);
		const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
		return [...groups, {
			dateKey,
			weekLabel: `Week ${weekNum} - ${dayName}`,
			items: [moduleItem]
		}];
	}, []);
	return /* @__PURE__ */ jsx("div", {
		className: "bg-slate-800 rounded-lg border border-slate-600 mb-3 ",
		onDrop: (e) => itemDropOnModule(e, moduleName),
		onDragOver: (e) => e.preventDefault(),
		children: /* @__PURE__ */ jsx("div", {
			className: "draggingModule ",
			children: /* @__PURE__ */ jsx("div", {
				className: " p-3 ",
				children: /* @__PURE__ */ jsx(Expandable, {
					ExpandableElement: ({ setIsExpanded, isExpanded }) => /* @__PURE__ */ jsxs("div", {
						className: "font-bold flex flex-row justify-between cursor-pointer ",
						role: "button",
						onClick: () => setIsExpanded((e) => !e),
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex-1",
							children: moduleName
						}), /* @__PURE__ */ jsxs("div", {
							className: " flex flex-row justify-end",
							children: [/* @__PURE__ */ jsx(ClientOnly, { children: /* @__PURE__ */ jsx(ModuleCanvasStatus, { moduleName }) }), /* @__PURE__ */ jsx(ExpandIcon, { style: { ...isExpanded ? { rotate: "90deg" } : { rotate: "180deg" } } })]
						})]
					}),
					children: /* @__PURE__ */ jsxs(Fragment$1, { children: [
						!reorderMutation.isPending && /* @__PURE__ */ jsx("button", {
							className: " me-3",
							onClick: () => {
								const canvasModuleId = canvasModules?.find((m) => m.name === moduleName)?.id;
								if (!canvasModuleId) {
									console.error("Canvas module ID not found for", moduleName);
									return;
								}
								reorderMutation.mutate({
									moduleId: canvasModuleId,
									items: moduleItems.map((item) => item.item)
								});
							},
							children: "Sort by Due Date"
						}),
						reorderMutation.isPending && /* @__PURE__ */ jsx(Spinner, {}),
						/* @__PURE__ */ jsx(Modal, {
							modalControl: modal,
							buttonText: "New Item",
							modalWidth: "w-135",
							children: ({ closeModal }) => /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx(NewItemForm, {
									moduleName,
									onCreate: closeModal
								}),
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx("button", {
									onClick: closeModal,
									children: "close"
								})
							] })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex flex-col",
							children: groupedItems.map(({ weekLabel, items }) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-slate-500 text-sm mt-1 ps-1",
								children: weekLabel
							}), items.map(({ type, item }) => /* @__PURE__ */ jsx(ExpandableModuleItem, {
								type,
								item,
								moduleName
							}, item.name + type))] }, weekLabel))
						})
					] })
				})
			})
		})
	});
}
function ExpandableModuleItem({ type, item, moduleName }) {
	const { courseName } = useCourseContext();
	const { setIsDragging } = useDragStyleContext();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-start ps-3",
		children: [/* @__PURE__ */ jsx("div", {
			className: "w-6 p-1 flex-none",
			children: /* @__PURE__ */ jsx(ItemTypeIcon, { type })
		}), /* @__PURE__ */ jsx(Link, {
			to: getModuleItemUrl(courseName, moduleName, type, item.name),
			className: "transition-all hover:text-slate-50 hover:scale-105 ps-1",
			draggable: "true",
			onDragStart: (e) => {
				const draggableItem = {
					type,
					item,
					sourceModuleName: moduleName
				};
				e.dataTransfer.setData("draggableItem", JSON.stringify(draggableItem));
				setIsDragging(true);
			},
			children: item.name
		})]
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/CreateModule.tsx
function CreateModule() {
	const { courseName } = useCourseContext();
	const createModule = useCreateModuleMutation();
	const [moduleName, setModuleName] = useState("");
	return /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsx(Expandable, {
		ExpandableElement: ({ setIsExpanded, isExpanded }) => /* @__PURE__ */ jsx("button", {
			onClick: () => setIsExpanded((v) => !v),
			children: isExpanded ? "Hide Form" : "Create Module"
		}),
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: async (e) => {
				e.preventDefault();
				if (moduleName) {
					await createModule.mutateAsync({
						moduleName,
						courseName
					});
					setModuleName("");
				}
			},
			className: "p-1 border border-slate-500 rounded-md my-1 flex flex-row gap-3 justify-between",
			children: [/* @__PURE__ */ jsx(TextInput, {
				className: "flex-grow",
				value: moduleName,
				setValue: setModuleName,
				label: "New Module Name"
			}), /* @__PURE__ */ jsx("button", {
				className: "mt-auto",
				children: "Add"
			})]
		})
	}) });
}
//#endregion
//#region src/app/course/[courseName]/modules/ModuleList.tsx
function ModuleList() {
	const { data: moduleNames } = useModuleNamesQuery();
	return /* @__PURE__ */ jsxs("div", { children: [
		moduleNames.map((m) => /* @__PURE__ */ jsx(ExpandableModule, { moduleName: m }, m)),
		/* @__PURE__ */ jsx("div", {
			className: "flex flex-col justify-center",
			children: /* @__PURE__ */ jsx(CreateModule, {})
		}),
		/* @__PURE__ */ jsx("br", {}),
		/* @__PURE__ */ jsx("br", {}),
		/* @__PURE__ */ jsx("br", {}),
		/* @__PURE__ */ jsx("br", {})
	] });
}
//#endregion
//#region src/components/icons/LeftChevron.tsx
function LeftChevron() {
	return /* @__PURE__ */ jsx("svg", {
		height: "1em",
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: /* @__PURE__ */ jsx("path", {
			d: "M18 17L13 12L18 7M11 17L6 12L11 7",
			className: "stroke-slate-100",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
//#endregion
//#region src/components/icons/RightChevron.tsx
function RightChevron() {
	return /* @__PURE__ */ jsx("svg", {
		height: "1em",
		viewBox: "0 0 24 24",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: /* @__PURE__ */ jsx("path", {
			d: "M6 17L11 12L6 7M13 17L18 12L13 7",
			className: "stroke-slate-100",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
//#endregion
//#region src/app/course/[courseName]/CollapsableSidebar.tsx
var collapseThreshold = 1400;
function CollapsableSidebar() {
	const [windowCollapseRecommended, setWindowCollapseRecommended] = useState(false);
	const [userCollapsed, setUserCollapsed] = useState("unset");
	useEffect(() => {
		setWindowCollapseRecommended(window.innerWidth <= collapseThreshold);
		function handleResize() {
			if (window.innerWidth <= collapseThreshold) setWindowCollapseRecommended(true);
			else setWindowCollapseRecommended(false);
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	let collapsed;
	if (userCollapsed === "unset") collapsed = windowCollapseRecommended;
	else collapsed = userCollapsed === "collapsed";
	return /* @__PURE__ */ jsxs("div", {
		className: "h-full flex flex-col",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-row justify-between mb-2",
			children: [/* @__PURE__ */ jsx("div", {
				className: "visible mx-3 mt-2",
				children: /* @__PURE__ */ jsx("button", {
					onClick: () => {
						setUserCollapsed((prev) => {
							if (prev === "unset") return collapsed ? "uncollapsed" : "collapsed";
							return prev === "collapsed" ? "uncollapsed" : "collapsed";
						});
					},
					children: collapsed ? /* @__PURE__ */ jsx(LeftChevron, {}) : /* @__PURE__ */ jsx(RightChevron, {})
				})
			}), /* @__PURE__ */ jsx("div", {
				className: " " + (collapsed ? "w-0 invisible hidden" : ""),
				children: /* @__PURE__ */ jsx(CourseSettingsLink, {})
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: `${collapsed ? "w-0" : "w-96"} flex-1 sm:p-3 overflow-y-auto transition-all ${collapsed ? "invisible " : "visible"}`,
			children: /* @__PURE__ */ jsx(ModuleList, {})
		})]
	});
}
//#endregion
//#region src/routes/course.$courseName.index.tsx?tsr-split=component
function CoursePage() {
	return /* @__PURE__ */ jsx("div", {
		className: "h-full flex flex-col",
		children: /* @__PURE__ */ jsx(DragStyleContextProvider, { children: /* @__PURE__ */ jsx(DraggingContextProvider, { children: /* @__PURE__ */ jsxs("div", {
			className: "flex sm:flex-row h-full flex-col max-w-[2400px] w-full mx-auto",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex-1 h-full flex flex-col",
				children: [/* @__PURE__ */ jsx(CourseNavigation, {}), /* @__PURE__ */ jsx(CourseCalendar, {})]
			}), /* @__PURE__ */ jsx(CollapsableSidebar, {})]
		}) }) })
	});
}
//#endregion
export { CoursePage as component };
