import { t as ClientOnly } from "./ClientOnly-BaIsMvon.js";
import { t as AssignmentSubmissionType } from "./assignmentSubmissionType-CBVSV8hE.js";
import { a as useTRPC, n as Spinner, t as SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { n as useUpdateGlobalSettingsMutation, t as useGlobalSettingsQuery } from "./globalSettingsHooks-DrZfa4te.js";
import { a as getDateOnlyMarkdownString, i as getDateKey, o as getTermName, s as groupByStartDate } from "./timeUtils-DjiIXWRA.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { r as useLocalCoursesSettingsQuery, t as useCreateLocalCourseMutation } from "./localCoursesHooks-CLeCOGR6.js";
import { a as getLecturePreviewUrl, i as getCourseUrl, n as useModal, t as Modal } from "./Modal-C3Ziyb81.js";
import { t as TextInput } from "./TextInput-BDfN6cG0.js";
import { n as ButtonSelect, t as getLectureForDay } from "./lectureUtils-CnTr-Z8X.js";
import { a as canvasService, n as useCourseListInTermQuery, o as SelectInput } from "./canvasCourseHooks-DYyGn1q3.js";
import { r as useLecturesSuspenseQuery } from "./lectureHooks-SnCvPM2E.js";
import { t as DayOfWeekInput } from "./DayOfWeekInput-CvCYn6x-.js";
import { t as CourseContextProvider } from "./CourseContextProvider-sIdCzDOw.js";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createPortal } from "react-dom";
//#region src/components/form/Toggle.tsx
var Toggle = ({ label, value, onChange }) => {
	return /* @__PURE__ */ jsxs("label", {
		className: "\n        flex align-middle p-2 cursor-pointer\n        text-gray-300\n        hover:text-blue-400\n        transition-colors duration-200 ease-in-out\n      ",
		children: [
			/* @__PURE__ */ jsx("input", {
				type: "checkbox",
				className: "appearance-none peer",
				checked: value,
				onChange: (e) => onChange(e.target.checked)
			}),
			/* @__PURE__ */ jsx("span", { className: `
          w-12 h-6 flex items-center flex-shrink-0 mx-3 p-1
          bg-gray-600 rounded-full
          duration-300 ease-in-out
          peer-checked:bg-blue-600
          after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md
          after:duration-300 peer-checked:after:translate-x-6
          group-hover:after:translate-x-1
        ` }),
			/* @__PURE__ */ jsx("span", {
				className: "",
				children: label
			})
		]
	});
};
//#endregion
//#region src/app/CourseList.tsx
function CourseList() {
	const { data: allSettings } = useLocalCoursesSettingsQuery();
	const [isDeleting, setIsDeleting] = useState(false);
	const coursesByStartDate = groupByStartDate(allSettings);
	const sortedDates = Object.keys(coursesByStartDate).sort();
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Toggle, {
		label: "Delete Mode",
		value: isDeleting,
		onChange: (set) => setIsDeleting(set)
	}), /* @__PURE__ */ jsx("div", {
		className: "flex flex-row ",
		children: sortedDates.map((startDate) => /* @__PURE__ */ jsxs("div", {
			className: " border-4 border-slate-800 rounded px-3 m-3  min-w-50",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-center pb-2",
				children: getTermName(startDate)
			}), coursesByStartDate[getDateKey(startDate)].map((settings) => /* @__PURE__ */ jsx(CourseItem, {
				courseName: settings.name,
				isDeleting
			}, settings.name))]
		}, startDate))
	})] });
}
function CourseItem({ courseName, isDeleting }) {
	const { data: globalSettings } = useGlobalSettingsQuery();
	const updateSettingsMutation = useUpdateGlobalSettingsMutation();
	const modal = useModal();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-start gap-2",
		children: [isDeleting && /* @__PURE__ */ jsx(Modal, {
			modalControl: modal,
			buttonText: "X",
			buttonClass: "\n            unstyled\n            text-red-200 hover:text-red-400 \n            bg-red-950/50 hover:bg-red-950/70\n            transition-all hover:scale-110\n            mb-3\n          ",
			modalWidth: "w-1/3",
			children: ({ closeModal }) => /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center",
					children: [
						"Are you sure you want to remove ",
						courseName,
						" from global settings?"
					]
				}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-around gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: async () => {
							await updateSettingsMutation.mutateAsync({ globalSettings: {
								...globalSettings,
								courses: globalSettings.courses.filter((course) => course.name !== courseName)
							} });
							closeModal();
						},
						disabled: updateSettingsMutation.isPending,
						className: "btn-danger",
						children: "Yes"
					}), /* @__PURE__ */ jsx("button", {
						onClick: closeModal,
						disabled: updateSettingsMutation.isPending,
						children: "No"
					})]
				}),
				updateSettingsMutation.isPending && /* @__PURE__ */ jsx(Spinner, {})
			] })
		}), /* @__PURE__ */ jsx(Link, {
			to: getCourseUrl(courseName),
			className: "\n          font-bold text-xl block\n          transition-all hover:scale-105 hover:underline hover:text-slate-200\n          mb-3\n        ",
			children: courseName
		})]
	});
}
//#endregion
//#region src/features/local/utils/storageDirectoryHooks.ts
var useDirectoryContentsQuery = (relativePath) => {
	return useQuery(useTRPC().directories.getDirectoryContents.queryOptions({ relativePath }));
};
var useDirectoryIsCourseQuery = (folderPath) => {
	return useQuery(useTRPC().directories.directoryIsCourse.queryOptions({ folderPath }));
};
var useDirectoryExistsQuery = (relativePath) => {
	return useQuery(useTRPC().directories.directoryExists.queryOptions({ relativePath }));
};
//#endregion
//#region src/components/form/StoragePathSelector.tsx
function StoragePathSelector({ value, setValue, label, className, setLastTypedValue }) {
	const [path, setPath] = useState(value);
	const { data: directoryContents } = useDirectoryContentsQuery(value);
	const [isFocused, setIsFocused] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [arrowUsed, setArrowUsed] = useState(false);
	const inputRef = useRef(null);
	const dropdownRef = useRef(null);
	useEffect(() => {
		setPath(value);
	}, [value]);
	useEffect(() => {
		if (setLastTypedValue) setLastTypedValue(path);
	}, [path, setLastTypedValue]);
	const handleKeyDown = (e) => {
		if (!isFocused || filteredFolders.length === 0) return;
		if (e.key === "ArrowDown") {
			setHighlightedIndex((prev) => (prev + 1) % filteredFolders.length);
			setArrowUsed(true);
			e.preventDefault();
		} else if (e.key === "ArrowUp") {
			setHighlightedIndex((prev) => (prev - 1 + filteredFolders.length) % filteredFolders.length);
			setArrowUsed(true);
			e.preventDefault();
		} else if (e.key === "Tab") if (highlightedIndex >= 0) {
			handleSelectFolder(filteredFolders[highlightedIndex], arrowUsed);
			e.preventDefault();
		} else {
			handleSelectFolder(filteredFolders[1], arrowUsed);
			e.preventDefault();
		}
		else if (e.key === "Enter") if (highlightedIndex >= 0) {
			handleSelectFolder(filteredFolders[highlightedIndex], arrowUsed);
			e.preventDefault();
		} else {
			setIsFocused(false);
			inputRef.current?.blur();
			e.preventDefault();
		}
		else if (e.key === "Escape") {
			setIsFocused(false);
			inputRef.current?.blur();
			e.preventDefault();
		}
	};
	const dropdownPositionStyle = (() => {
		if (inputRef.current) {
			const rect = inputRef.current.getBoundingClientRect();
			return {
				top: rect.bottom + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width
			};
		}
		return {};
	})();
	const lastPart = path.split("/")[path.split("/").length - 1] || "";
	const filteredFolders = (directoryContents?.folders ?? []).filter((option) => option.toLowerCase().includes(lastPart.toLowerCase()));
	const handleSelectFolder = (option, shouldFocus = false) => {
		let newPath = path.endsWith("/") ? path + option : path.replace(/[^/]*$/, option);
		if (!newPath.endsWith("/")) newPath += "/";
		setPath(newPath);
		setValue(newPath);
		setArrowUsed(false);
		setHighlightedIndex(-1);
		if (shouldFocus) {
			setIsFocused(true);
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	};
	useEffect(() => {
		if (dropdownRef.current && highlightedIndex >= 0) {
			const optionElements = dropdownRef.current.querySelectorAll(".dropdown-option");
			if (optionElements[highlightedIndex]) optionElements[highlightedIndex].scrollIntoView({ block: "nearest" });
		}
	}, [highlightedIndex]);
	return /* @__PURE__ */ jsxs("label", {
		className: "flex flex-col relative " + className,
		children: [
			label,
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("input", {
				ref: inputRef,
				className: "bg-slate-800  w-full px-1",
				value: path,
				onChange: (e) => {
					setPath(e.target.value);
					if (e.target.value.endsWith("/")) {
						setValue(e.target.value);
						setTimeout(() => inputRef.current?.focus(), 0);
					}
				},
				onFocus: () => setIsFocused(true),
				onBlur: () => setTimeout(() => setIsFocused(false), 100),
				onKeyDown: handleKeyDown,
				autoComplete: "off"
			}),
			isFocused && createPortal(/* @__PURE__ */ jsx("div", {
				className: " ",
				children: /* @__PURE__ */ jsx("div", {
					ref: dropdownRef,
					className: " text-slate-300  border border-slate-500 absolute bg-slate-900 rounded-md mt-1 w-full max-h-96 overflow-y-auto pointer-events-auto",
					style: dropdownPositionStyle,
					children: filteredFolders.map((option, idx) => /* @__PURE__ */ jsx("div", {
						className: `dropdown-option w-full px-2 py-1 cursor-pointer ${highlightedIndex === idx ? "bg-blue-700 text-white" : ""}`,
						onMouseDown: (e) => {
							e.preventDefault();
							handleSelectFolder(option, true);
						},
						onMouseEnter: () => setHighlightedIndex(idx),
						children: option
					}, option))
				})
			}), document.body)
		]
	});
}
//#endregion
//#region src/app/addCourse/AddExistingCourseToGlobalSettings.tsx
var AddExistingCourseToGlobalSettings = () => {
	const [showForm, setShowForm] = useState(false);
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "flex justify-center",
		children: /* @__PURE__ */ jsx("button", {
			className: "",
			onClick: () => setShowForm((i) => !i),
			children: showForm ? "Hide Form" : "Import Existing Course"
		})
	}), /* @__PURE__ */ jsx("div", {
		className: " collapsible " + (showForm && "expand"),
		children: /* @__PURE__ */ jsx("div", {
			className: "border rounded-md p-3 m-3",
			children: /* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: /* @__PURE__ */ jsx(ClientOnly, { children: showForm && /* @__PURE__ */ jsx(ExistingCourseForm, {}) }) })
		})
	})] });
};
var ExistingCourseForm = () => {
	const [path, setPath] = useState("./");
	const [name, setName] = useState("");
	const nameInputRef = useRef(null);
	const directoryIsCourseQuery = useDirectoryIsCourseQuery(path);
	const { data: globalSettings } = useGlobalSettingsQuery();
	const updateSettingsMutation = useUpdateGlobalSettingsMutation();
	useEffect(() => {
		console.log("Checking directory:", directoryIsCourseQuery.data);
		if (directoryIsCourseQuery.data) {
			console.log("Focusing name input");
			nameInputRef.current?.focus();
		}
	}, [directoryIsCourseQuery.data]);
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: async (e) => {
			e.preventDefault();
			console.log(path);
			await updateSettingsMutation.mutateAsync({ globalSettings: {
				...globalSettings,
				courses: [...globalSettings.courses, {
					name,
					path
				}]
			} });
			setName("");
			setPath("./");
		},
		className: "min-w-3xl",
		children: [
			/* @__PURE__ */ jsx("h2", { children: "Add Existing Course" }),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center mt-2 text-slate-500",
				children: directoryIsCourseQuery.isLoading ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
					className: "animate-spin mr-2",
					children: "⏳"
				}), /* @__PURE__ */ jsx("span", { children: "Checking directory..." })] }) : directoryIsCourseQuery.data ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
					className: "text-green-600 mr-2",
					children: "✅"
				}), /* @__PURE__ */ jsx("span", { children: "This is a valid course directory." })] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("span", {
					className: "text-red-600 mr-2",
					children: "❌"
				}), /* @__PURE__ */ jsx("span", { children: "Not a course directory." })] })
			}),
			/* @__PURE__ */ jsx(StoragePathSelector, {
				value: path,
				setValue: setPath,
				label: "Course Directory Path"
			}),
			directoryIsCourseQuery.data && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(TextInput, {
				value: name,
				setValue: setName,
				label: "Display Name",
				inputRef: nameInputRef
			}), /* @__PURE__ */ jsx("div", {
				className: "text-center",
				children: /* @__PURE__ */ jsx("button", {
					className: "text-center mt-3",
					children: "Save"
				})
			})] })
		]
	});
};
//#endregion
//#region src/features/canvas/hooks/canvasHooks.ts
var canvasKeys = {
	allTerms: ["all canvas terms"],
	allAroundDate: (date) => ["all canvas terms", date]
};
var useAllCanvasTermsQuery = () => useSuspenseQuery({
	queryKey: canvasKeys.allTerms,
	queryFn: canvasService.getAllTerms
});
var useCanvasTermsQuery = (queryDate) => {
	const { data: terms } = useAllCanvasTermsQuery();
	return useSuspenseQuery({
		queryKey: canvasKeys.allAroundDate(queryDate),
		queryFn: () => {
			const finiteTerms = terms.filter((t) => {
				if (!t.end_at) return false;
				return new Date(t.end_at) > queryDate;
			});
			console.log("finite terms", finiteTerms, terms);
			return finiteTerms.sort((a, b) => new Date(a.start_at ?? "").getTime() - new Date(b.start_at ?? "").getTime()).slice(0, 3);
		}
	});
};
//#endregion
//#region src/app/addCourse/AddCourseToGlobalSettingsForm.tsx
function AddNewCourseToGlobalSettingsForm() {
	const navigate = useNavigate();
	const { data: canvasTerms } = useCanvasTermsQuery(useMemo(() => /* @__PURE__ */ new Date(), []));
	const [selectedTerm, setSelectedTerm] = useState();
	const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState([]);
	const [selectedCanvasCourse, setSelectedCanvasCourse] = useState();
	const [selectedDirectory, setSelectedDirectory] = useState();
	const [courseToImport, setCourseToImport] = useState();
	const [name, setName] = useState("");
	const createCourse = useCreateLocalCourseMutation();
	const formIsComplete = selectedTerm && selectedCanvasCourse && selectedDirectory;
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(ButtonSelect, {
			options: canvasTerms,
			getOptionName: (t) => t?.name ?? "",
			setValue: setSelectedTerm,
			value: selectedTerm,
			label: "Canvas Term",
			center: true
		}),
		/* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: selectedTerm && /* @__PURE__ */ jsx(OtherSettings, {
			selectedTerm,
			selectedCanvasCourse,
			setSelectedCanvasCourse,
			selectedDirectory,
			setSelectedDirectory,
			selectedDaysOfWeek,
			setSelectedDaysOfWeek,
			courseToImport,
			setCourseToImport,
			name,
			setName
		}) }),
		/* @__PURE__ */ jsx("div", {
			className: "m-3 text-center",
			children: /* @__PURE__ */ jsx("button", {
				disabled: !formIsComplete || createCourse.isPending,
				onClick: async () => {
					if (formIsComplete) {
						console.log("Creating course with settings:", selectedDirectory, "old course", courseToImport);
						const newSettings = courseToImport ? {
							...courseToImport,
							name,
							daysOfWeek: selectedDaysOfWeek,
							canvasId: selectedCanvasCourse.id,
							startDate: selectedTerm.start_at ?? "",
							endDate: selectedTerm.end_at ?? "",
							holidays: [],
							assignmentGroups: courseToImport.assignmentGroups.map((assignmentGroup) => {
								const { canvasId: _, ...groupWithoutCanvas } = assignmentGroup;
								return {
									...groupWithoutCanvas,
									canvasId: void 0
								};
							}),
							assets: []
						} : {
							name,
							assignmentGroups: [],
							daysOfWeek: selectedDaysOfWeek,
							canvasId: selectedCanvasCourse.id,
							startDate: selectedTerm.start_at ?? "",
							endDate: selectedTerm.end_at ?? "",
							defaultDueTime: {
								hour: 23,
								minute: 59
							},
							defaultAssignmentSubmissionTypes: [AssignmentSubmissionType.ONLINE_TEXT_ENTRY, AssignmentSubmissionType.ONLINE_UPLOAD],
							defaultFileUploadTypes: [
								"pdf",
								"png",
								"jpg",
								"jpeg"
							],
							defaultLockHoursOffset: 0,
							holidays: [],
							assets: []
						};
						await createCourse.mutateAsync({
							settings: newSettings,
							settingsFromCourseToImport: courseToImport,
							name,
							directory: selectedDirectory
						});
						navigate({ to: getCourseUrl(name) });
					}
				},
				children: "Save New Course Configuration"
			})
		}),
		createCourse.isPending && /* @__PURE__ */ jsx(Spinner, {})
	] });
}
function OtherSettings({ selectedTerm, selectedCanvasCourse, setSelectedCanvasCourse, selectedDirectory: _, setSelectedDirectory, selectedDaysOfWeek, setSelectedDaysOfWeek, courseToImport, setCourseToImport, name, setName }) {
	const { data: canvasCourses, isLoading: canvasCoursesLoading } = useCourseListInTermQuery(selectedTerm.id);
	const { data: allSettings } = useLocalCoursesSettingsQuery();
	const [directory, setDirectory] = useState("./");
	const { data: directoryExists, isLoading: directoryExistsLoading } = useDirectoryExistsQuery(directory);
	const populatedCanvasCourseIds = allSettings?.map((s) => s.canvasId) ?? [];
	const availableCourses = canvasCourses?.filter((canvas) => !populatedCanvasCourseIds.includes(canvas.id)) ?? [];
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(ButtonSelect, {
			value: selectedCanvasCourse,
			setValue: setSelectedCanvasCourse,
			label: "Course",
			options: availableCourses,
			getOptionName: (c) => c?.name ?? "",
			center: true
		}),
		canvasCoursesLoading && /* @__PURE__ */ jsx(Spinner, {}),
		!canvasCoursesLoading && availableCourses.length === 0 && /* @__PURE__ */ jsx("div", {
			className: "text-center text-red-300",
			children: /* @__PURE__ */ jsx("div", {
				className: "flex justify-center ",
				children: /* @__PURE__ */ jsxs("div", {
					className: "text-left",
					children: ["No available courses in this term to add. Either", /* @__PURE__ */ jsxs("ol", { children: [/* @__PURE__ */ jsx("li", { children: "all courses have already been added, or" }), /* @__PURE__ */ jsx("li", { children: "there are no courses in this term" })] })]
				})
			})
		}),
		/* @__PURE__ */ jsx(StoragePathSelector, {
			value: directory,
			setValue: setDirectory,
			setLastTypedValue: setSelectedDirectory,
			label: "Storage Folder"
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "text-center mt-2 min-h-6",
			children: [
				directoryExistsLoading && /* @__PURE__ */ jsx(Spinner, {}),
				!directoryExistsLoading && directoryExists && /* @__PURE__ */ jsx("div", {
					className: "text-red-300",
					children: "Directory must be a new folder"
				}),
				!directoryExistsLoading && directoryExists === false && /* @__PURE__ */ jsx("div", {
					className: "text-green-300",
					children: "✓ New folder"
				})
			]
		}),
		/* @__PURE__ */ jsx("br", {}),
		/* @__PURE__ */ jsx("div", {
			className: "flex justify-center",
			children: /* @__PURE__ */ jsx(DayOfWeekInput, {
				selectedDays: selectedDaysOfWeek,
				updateSettings: (day) => {
					setSelectedDaysOfWeek((oldDays) => {
						return oldDays.includes(day) ? oldDays.filter((d) => d !== day) : [day, ...oldDays];
					});
				}
			})
		}),
		/* @__PURE__ */ jsx(SelectInput, {
			value: courseToImport,
			setValue: setCourseToImport,
			label: "(Optional) Course Content to Import",
			options: allSettings,
			getOptionName: (c) => c.name
		}),
		/* @__PURE__ */ jsx(TextInput, {
			value: name,
			setValue: setName,
			label: "Display Name"
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "px-5",
			children: [
				"Assignments, Quizzes, Pages, and Lectures will have their due dates moved based on how far they are from the start of the semester.",
				/* @__PURE__ */ jsx("br", {}),
				"You will still need to go through and re-order the course content, but things will be within a few days of where they should be."
			]
		})
	] });
}
//#endregion
//#region src/app/addCourse/AddNewCourse.tsx
function AddCourseToGlobalSettings() {
	const [showForm, setShowForm] = useState(false);
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "flex justify-center",
		children: /* @__PURE__ */ jsx("button", {
			className: "",
			onClick: () => setShowForm((i) => !i),
			children: showForm ? "Hide Form" : "Add New Course"
		})
	}), /* @__PURE__ */ jsx("div", {
		className: " collapsible " + (showForm && "expand"),
		children: /* @__PURE__ */ jsx("div", {
			className: "border rounded-md p-3 m-3",
			children: /* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: /* @__PURE__ */ jsx(ClientOnly, { children: showForm && /* @__PURE__ */ jsx(AddNewCourseToGlobalSettingsForm, {}) }) })
		})
	})] });
}
//#endregion
//#region src/app/todaysLectures/OneCourseLectures.tsx
function OneCourseLectures() {
	const { courseName } = useCourseContext();
	const { data: weeks } = useLecturesSuspenseQuery();
	const dayAsDate = /* @__PURE__ */ new Date();
	const dayAsString = getDateOnlyMarkdownString(dayAsDate);
	const todaysLecture = getLectureForDay(weeks, dayAsDate);
	if (!todaysLecture) return /* @__PURE__ */ jsx(Fragment$1, {});
	return /* @__PURE__ */ jsxs(Link, {
		to: getLecturePreviewUrl(courseName, dayAsString),
		className: "\n        border-4 rounded-lg border-slate-500 \n        px-3 py-1 m-3 block text-end\n        bg-slate-950\n        transition-all hover:scale-110 hover:shadow-md\n      ",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "text-end text-slate-500",
				children: "lecture"
			}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("span", {
				className: "font-bold text-xl",
				children: todaysLecture?.name
			}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("span", {
				className: "text-slate-500",
				children: courseName
			})
		]
	});
}
//#endregion
//#region src/app/todaysLectures/TodaysLectures.tsx
function TodaysLectures() {
	const { data: allSettings } = useLocalCoursesSettingsQuery();
	return /* @__PURE__ */ jsx("div", {
		className: "w-full",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex justify-around w-full",
			children: /* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: allSettings.map((settings) => /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(CourseContextProvider, {
				localCourseName: settings.name,
				children: /* @__PURE__ */ jsx(OneCourseLectures, {})
			}) }, settings.name)) })
		})
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Home() {
	return /* @__PURE__ */ jsx("main", {
		className: "h-full flex justify-center overflow-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "xl:w-[900px] mx-auto",
			children: [
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("div", {
					className: " flex justify-center",
					children: /* @__PURE__ */ jsx(CourseList, {})
				}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx(TodaysLectures, {}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx(AddCourseToGlobalSettings, {}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("div", {
					className: "mb-96",
					children: /* @__PURE__ */ jsx(AddExistingCourseToGlobalSettings, {})
				})
			]
		})
	});
}
//#endregion
export { Home as component };
