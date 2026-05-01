import { n as AssignmentSubmissionTypeList, t as AssignmentSubmissionType } from "./assignmentSubmissionType-CBVSV8hE.js";
import { n as Spinner, t as SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { a as getDateOnlyMarkdownString, n as getDateFromString, r as getDateFromStringOrThrow } from "./timeUtils-DjiIXWRA.js";
import { i as canvasApi, o as axiosClient } from "./canvasWebRequestUtils-BTUhiXsN.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { i as useUpdateLocalCourseSettingsMutation, n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { i as getCourseUrl, n as useModal, t as Modal } from "./Modal-C3Ziyb81.js";
import { t as TextInput } from "./TextInput-BDfN6cG0.js";
import { i as useSetAssignmentGroupsMutation, o as SelectInput, r as useCourseStudentsQuery } from "./canvasCourseHooks-DYyGn1q3.js";
import { t as DayOfWeekInput } from "./DayOfWeekInput-CvCYn6x-.js";
import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//#region src/app/course/[courseName]/settings/sharedSettings.ts
var settingsBox = "border w-full p-3 m-3 rounded-md border-slate-500";
//#endregion
//#region src/app/course/[courseName]/settings/MeatballIcon.tsx
function MeatballIcon() {
	return /* @__PURE__ */ jsx("svg", {
		className: "inline h-4",
		viewBox: "0 0 32 32",
		xmlns: "http://www.w3.org/2000/svg",
		fill: "none",
		children: /* @__PURE__ */ jsx("path", {
			fill: "white",
			d: "M16 10a2 2 0 100-4 2 2 0 000 4zM16 18a2 2 0 100-4 2 2 0 000 4zM16 26a2 2 0 100-4 2 2 0 000 4z"
		})
	});
}
//#endregion
//#region src/app/course/[courseName]/settings/AssignmentGroupManagement.tsx
function AssignmentGroupManagement() {
	const { data: settings, isPending } = useLocalCourseSettingsQuery();
	const updateSettings = useUpdateLocalCourseSettingsMutation();
	const applyInCanvas = useSetAssignmentGroupsMutation(settings.canvasId);
	const modal = useModal();
	const [assignmentGroups, setAssignmentGroups] = useState(settings.assignmentGroups);
	useEffect(() => {
		const handler = setTimeout(() => {
			if (!areAssignmentGroupsEqual(assignmentGroups, settings.assignmentGroups)) {
				console.log("updating", assignmentGroups, updateSettings.isPending, isPending);
				updateSettings.mutate({ settings: {
					...settings,
					assignmentGroups
				} });
			}
		}, 1e3);
		return () => {
			clearTimeout(handler);
		};
	}, [
		assignmentGroups,
		isPending,
		settings,
		updateSettings
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: settingsBox,
		children: [
			assignmentGroups.map((group) => /* @__PURE__ */ jsxs("div", {
				className: "flex flex-row gap-3",
				children: [/* @__PURE__ */ jsx(TextInput, {
					value: group.name,
					setValue: (newValue) => setAssignmentGroups((oldGroups) => oldGroups.map((g) => g.id === group.id ? {
						...g,
						name: newValue
					} : g)),
					label: "Group Name"
				}), /* @__PURE__ */ jsx(TextInput, {
					value: group.weight.toString(),
					setValue: (newValue) => setAssignmentGroups((oldGroups) => oldGroups.map((g) => g.id === group.id ? {
						...g,
						weight: parseInt(newValue || "0")
					} : g)),
					label: "Weight"
				})]
			}, group.id)),
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-3 mt-3",
				children: [/* @__PURE__ */ jsx("button", {
					className: "btn-danger",
					onClick: () => {
						setAssignmentGroups((oldGroups) => oldGroups.slice(0, -1));
					},
					children: "Remove Assignment Group"
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => {
						setAssignmentGroups((oldGroups) => [...oldGroups, {
							id: Date.now().toString(),
							name: "",
							weight: 0
						}]);
					},
					children: "Add Assignment Group"
				})]
			}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ jsx(Modal, {
					modalControl: modal,
					buttonText: "Update Assignment Groups In Canvas",
					buttonClass: "btn-",
					modalWidth: "w-1/5",
					children: ({ closeModal }) => /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-center font-bold",
							children: "DANGER: updating assignment groups can delete assignments and grades from canvas."
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: "This is only recommended to do at the beginning of a semester. Are you sure you want to continue?"
						}),
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-around gap-3",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: async () => {
									const newSettings = await applyInCanvas.mutateAsync(settings);
									if (newSettings) setAssignmentGroups(newSettings.assignmentGroups);
								},
								disabled: applyInCanvas.isPending,
								className: "btn-danger",
								children: "Yes"
							}), /* @__PURE__ */ jsx("button", {
								onClick: closeModal,
								disabled: applyInCanvas.isPending,
								children: "No"
							})]
						}),
						applyInCanvas.isPending && /* @__PURE__ */ jsx(Spinner, {})
					] })
				})
			}),
			applyInCanvas.isPending && /* @__PURE__ */ jsx(Spinner, {}),
			applyInCanvas.isSuccess && /* @__PURE__ */ jsxs("div", { children: [
				"You will need to go to your course assignments page ",
				/* @__PURE__ */ jsx("a", {
					href: `https://snow.instructure.com/courses/${settings.canvasId}/assignments`,
					className: "font-bold underline hover:scale-115",
					target: "_blank",
					children: "HERE"
				}),
				" > settings (",
				/* @__PURE__ */ jsx(MeatballIcon, {}),
				")  > Assignment Group Weights",
				/* @__PURE__ */ jsx("br", {}),
				"and check the 'Weight final grade based on assignment groups' box",
				/* @__PURE__ */ jsx("br", {})
			] })
		]
	});
}
function areAssignmentGroupsEqual(list1, list2) {
	if (list1.length !== list2.length) return false;
	const sortedList1 = [...list1].sort((a, b) => {
		if (a.id !== b.id) return a.id > b.id ? 1 : -1;
		if (a.canvasId !== b.canvasId) return (a.canvasId || 0) - (b.canvasId || 0);
		return 0;
	});
	const sortedList2 = [...list2].sort((a, b) => {
		if (a.id !== b.id) return a.id > b.id ? 1 : -1;
		if (a.canvasId !== b.canvasId) return (a.canvasId || 0) - (b.canvasId || 0);
		return 0;
	});
	for (let i = 0; i < sortedList1.length; i++) {
		const group1 = sortedList1[i];
		const group2 = sortedList2[i];
		if (group1.id !== group2.id || group1.name !== group2.name || group1.weight !== group2.weight || group1.canvasId !== group2.canvasId) return false;
	}
	return true;
}
//#endregion
//#region src/features/canvas/services/canvasNavigationService.ts
var canvasNavigationService = {
	async getCourseTabs(canvasCourseId) {
		const url = `${canvasApi}/courses/${canvasCourseId}/tabs`;
		const { data } = await axiosClient.get(url);
		return data;
	},
	async updateCourseTab(canvasCourseId, tabId, params) {
		const url = `${canvasApi}/courses/${canvasCourseId}/tabs/${tabId}`;
		const body = { ...params };
		const { data } = await axiosClient.put(url, body);
		return data;
	}
};
//#endregion
//#region src/features/canvas/hooks/canvasNavigationHooks.tsx
var canvasCourseTabKeys = { tabs: (canvasId) => [
	"canvas",
	canvasId,
	"tabs list"
] };
var useCanvasTabsQuery = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	return useQuery({
		queryKey: canvasCourseTabKeys.tabs(settings.canvasId),
		queryFn: async () => await canvasNavigationService.getCourseTabs(settings.canvasId)
	});
};
var useUpdateCanvasTabMutation = () => {
	const { data: settings } = useLocalCourseSettingsQuery();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ tabId, hidden, position }) => await canvasNavigationService.updateCourseTab(settings.canvasId, tabId, {
			hidden,
			position
		}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: canvasCourseTabKeys.tabs(settings.canvasId),
				refetchType: "all"
			});
		}
	});
};
//#endregion
//#region src/app/course/[courseName]/settings/canvasNavigation.tsx/NavTabListItem.tsx
var NavTabListItem = ({ tab, onDragStart, onDrop }) => {
	const updateTab = useUpdateCanvasTabMutation();
	const [isDragOver, setIsDragOver] = React.useState(false);
	const handleToggleVisibility = () => {
		updateTab.mutate({
			tabId: tab.id,
			hidden: !tab.hidden,
			position: tab.position
		});
	};
	return /* @__PURE__ */ jsxs("li", {
		className: `flex items-center justify-between mb-2 p-1 px-4 rounded bg-slate-800 ${tab.hidden ? "opacity-50" : ""} ${isDragOver ? "border-t-4 border-blue-400" : ""}`,
		draggable: true,
		onDragStart,
		onDragOver: (e) => {
			e.preventDefault();
			setIsDragOver(true);
		},
		onDragLeave: () => setIsDragOver(false),
		onDrop: () => {
			setIsDragOver(false);
			onDrop();
		},
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "flex-1 cursor-move",
				children: tab.label
			}),
			updateTab.isPending && /* @__PURE__ */ jsx(Spinner, {}),
			/* @__PURE__ */ jsx("span", {
				className: "text-xs text-slate-400 mr-2",
				children: tab.type
			}),
			/* @__PURE__ */ jsx("button", {
				className: ` py-1 rounded unstyled w-20 ${tab.hidden ? "bg-slate-600" : "bg-blue-900/50"}`,
				onClick: handleToggleVisibility,
				disabled: updateTab.isPending,
				children: tab.hidden ? "Show" : "Hide"
			})
		]
	}, tab.id);
};
//#endregion
//#region src/app/course/[courseName]/settings/canvasNavigation.tsx/CanvasNavigationManagement.tsx
var CanvasNavigationManagement = () => {
	const { data: tabs, isLoading, isError } = useCanvasTabsQuery();
	const [draggedIndex, setDraggedIndex] = useState(null);
	const updateTab = useUpdateCanvasTabMutation();
	const handleHideAllExternal = async () => {
		if (!tabs) return;
		for (const tab of tabs.filter((tab) => tab.type.toLowerCase() === "external" && !tab.hidden)) await updateTab.mutateAsync({
			tabId: tab.id,
			hidden: true,
			position: tab.position
		});
	};
	if (isLoading) return /* @__PURE__ */ jsx("div", { children: "Loading tabs..." });
	if (isError || !tabs) return /* @__PURE__ */ jsx("div", { children: "Error loading tabs." });
	const handleDragStart = (idx) => setDraggedIndex(idx);
	const handleDrop = async (dropIdx) => {
		if (draggedIndex === null || draggedIndex === dropIdx || !tabs) {
			setDraggedIndex(null);
			return;
		}
		const newTabs = [...tabs].sort((a, b) => a.position - b.position);
		const [removed] = newTabs.splice(draggedIndex, 1);
		newTabs.splice(dropIdx, 0, removed);
		for (let i = 0; i < newTabs.length; i++) {
			const tab = newTabs[i];
			if (tab.position !== i + 1) await updateTab.mutateAsync({
				tabId: tab.id,
				position: i + 1,
				hidden: tab.hidden
			});
		}
		setDraggedIndex(null);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: " mx-auto p-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex justify-between",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-xl font-bold mb-4",
				children: "Manage Course Navigation Tabs"
			}), /* @__PURE__ */ jsx("div", { children: updateTab.isPending ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsx("button", {
				className: "mb-4 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white",
				onClick: handleHideAllExternal,
				disabled: updateTab.isPending,
				children: "Hide All External"
			}) })]
		}), /* @__PURE__ */ jsx("div", {
			className: "flex justify-center ",
			children: /* @__PURE__ */ jsx("ul", {
				className: "w-md h-[800px] overflow-y-auto rounded bg-slate-950 p-4 border border-slate-700",
				children: [...tabs].sort((a, b) => a.position - b.position).map((tab, idx) => /* @__PURE__ */ jsx(NavTabListItem, {
					tab,
					idx,
					onDragStart: () => handleDragStart(idx),
					onDragOver: (e) => {
						e.preventDefault();
					},
					onDrop: () => handleDrop(idx)
				}, tab.id))
			})
		})]
	});
};
//#endregion
//#region src/app/course/[courseName]/settings/DaysOfWeekSettings.tsx
function DaysOfWeekSettings() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const updateSettings = useUpdateLocalCourseSettingsMutation();
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(DayOfWeekInput, {
		selectedDays: settings.daysOfWeek,
		updateSettings: (day) => {
			const hasDay = settings.daysOfWeek.includes(day);
			updateSettings.mutate({ settings: {
				...settings,
				daysOfWeek: hasDay ? settings.daysOfWeek.filter((d) => d !== day) : [day, ...settings.daysOfWeek]
			} });
		}
	}), updateSettings.isPending && /* @__PURE__ */ jsx(Spinner, {})] });
}
//#endregion
//#region src/components/TimePicker.tsx
var TimePicker = ({ setChosenTime, time }) => {
	const adjustedHour = time.hour % 12 === 0 ? 12 : time.hour % 12;
	const partOfDay = time.hour < 12 ? "AM" : "PM";
	return /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsxs("form", {
		onSubmit: (e) => e.preventDefault(),
		className: "flex flex-row gap-3",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "",
				children: /* @__PURE__ */ jsxs("label", { children: ["Hour", /* @__PURE__ */ jsx("select", {
					value: adjustedHour,
					onChange: (e) => {
						const newHours = parseInt(e.target.value);
						setChosenTime({
							...time,
							hour: partOfDay === "PM" ? newHours + 12 : newHours
						});
					},
					children: Array.from({ length: 12 }, (_, i) => i).map((o) => /* @__PURE__ */ jsx("option", { children: o }, o.toString()))
				})] })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "",
				children: /* @__PURE__ */ jsxs("label", { children: ["Minute", /* @__PURE__ */ jsx("select", {
					value: time.minute,
					onChange: (e) => {
						const newMinute = parseInt(e.target.value);
						setChosenTime({
							...time,
							minute: newMinute
						});
					},
					children: [
						0,
						15,
						30,
						45,
						59
					].map((o) => /* @__PURE__ */ jsx("option", { children: o }, o.toString()))
				})] })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "",
				children: /* @__PURE__ */ jsxs("label", { children: ["Part of Day", /* @__PURE__ */ jsx("select", {
					value: partOfDay,
					onChange: (e) => {
						const newPartOfDay = e.target.value;
						setChosenTime({
							...time,
							hour: newPartOfDay === "PM" ? time.hour + 12 : time.hour
						});
					},
					children: ["AM", "PM"].map((o) => /* @__PURE__ */ jsx("option", { children: o }, o.toString()))
				})] })
			})
		]
	}) });
};
//#endregion
//#region src/app/course/[courseName]/settings/DefaultLockOffset.tsx
function DefaultLockOffset() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const updateSettings = useUpdateLocalCourseSettingsMutation();
	const [hoursOffset, setHoursOffset] = useState(settings.defaultLockHoursOffset?.toString() ?? "0");
	useEffect(() => {
		const id = setTimeout(() => {
			try {
				const hoursNumber = parseInt(hoursOffset);
				if (!Number.isNaN(hoursNumber) && hoursNumber !== settings.defaultLockHoursOffset) updateSettings.mutate({ settings: {
					...settings,
					defaultLockHoursOffset: hoursNumber
				} });
			} catch {}
		}, 500);
		return () => clearTimeout(id);
	}, [
		hoursOffset,
		settings,
		settings.defaultLockHoursOffset,
		updateSettings
	]);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("div", {
			className: "text-center",
			children: "Default Assignment Lock Offset"
		}),
		/* @__PURE__ */ jsx("hr", { className: "m-1 p-0" }),
		/* @__PURE__ */ jsx(TextInput, {
			value: hoursOffset,
			setValue: (n) => setHoursOffset(n),
			label: "Hours Offset"
		})
	] });
}
//#endregion
//#region src/app/course/[courseName]/settings/DefaultDueTime.tsx
function DefaultDueTime() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const updateSettings = useUpdateLocalCourseSettingsMutation();
	const [haveLockOffset, setHaveLockOffset] = useState(typeof settings.defaultLockHoursOffset !== "undefined");
	return /* @__PURE__ */ jsxs("div", {
		className: settingsBox,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-center",
				children: "Default Assignment Due Time"
			}),
			/* @__PURE__ */ jsx("hr", { className: "m-1 p-0" }),
			/* @__PURE__ */ jsx(TimePicker, {
				time: settings.defaultDueTime,
				setChosenTime: (simpleTime) => {
					console.log(simpleTime);
					updateSettings.mutate({ settings: {
						...settings,
						defaultDueTime: simpleTime
					} });
				}
			}),
			/* @__PURE__ */ jsx("hr", {}),
			!haveLockOffset && /* @__PURE__ */ jsx("button", {
				onClick: async () => {
					await updateSettings.mutateAsync({ settings: {
						...settings,
						defaultLockHoursOffset: 0
					} });
					setHaveLockOffset(true);
				},
				children: "have a default Lock Offset?"
			}),
			haveLockOffset && /* @__PURE__ */ jsx(DefaultLockOffset, {}),
			/* @__PURE__ */ jsx("br", {}),
			haveLockOffset && /* @__PURE__ */ jsx("button", {
				className: "btn-danger",
				onClick: async () => {
					await updateSettings.mutateAsync({ settings: {
						...settings,
						defaultLockHoursOffset: void 0
					} });
					setHaveLockOffset(false);
				},
				children: "remove default Lock Offset?"
			})
		]
	});
}
//#endregion
//#region src/app/course/[courseName]/settings/DefaultFileUploadTypes.tsx
function DefaultFileUploadTypes() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const [defaultFileUploadTypes, setDefaultFileUploadTypes] = useState(settings.defaultFileUploadTypes);
	const updateSettings = useUpdateLocalCourseSettingsMutation();
	useEffect(() => {
		const id = setTimeout(() => {
			if (JSON.stringify(settings.defaultFileUploadTypes) !== JSON.stringify(defaultFileUploadTypes)) updateSettings.mutate({ settings: {
				...settings,
				defaultFileUploadTypes
			} });
		}, 500);
		return () => clearTimeout(id);
	}, [
		defaultFileUploadTypes,
		settings,
		updateSettings
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: settingsBox,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-center",
				children: "Default File Upload Types"
			}),
			defaultFileUploadTypes.map((type, index) => /* @__PURE__ */ jsx("div", {
				className: "flex flex-row gap-3",
				children: /* @__PURE__ */ jsx(TextInput, {
					value: type,
					setValue: (newValue) => setDefaultFileUploadTypes((oldTypes) => oldTypes.map((t, i) => i === index ? newValue : t)),
					label: "Default Type " + index
				})
			}, index)),
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-3 mt-3",
				children: [/* @__PURE__ */ jsx("button", {
					className: "btn-danger",
					onClick: () => {
						setDefaultFileUploadTypes((old) => old.slice(0, -1));
					},
					children: "Remove Default File Upload Type"
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => setDefaultFileUploadTypes((old) => [...old, ""]),
					children: "Add Default File Upload Type"
				})]
			})
		]
	});
}
//#endregion
//#region src/app/course/[courseName]/settings/GithubClassroomList.tsx
function GithubClassroomList() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const enrollmentsQuery = useCourseStudentsQuery(settings.canvasId);
	if (enrollmentsQuery.isLoading) return /* @__PURE__ */ jsx("div", {
		className: settingsBox,
		children: /* @__PURE__ */ jsx(Spinner, {})
	});
	return /* @__PURE__ */ jsxs("div", {
		className: settingsBox,
		children: [
			/* @__PURE__ */ jsx("h5", {
				className: "text-center",
				children: "Github Classroom Friendly Roster"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-center text-slate-500",
				children: "Copy and paste this into github classroom to import students"
			}),
			/* @__PURE__ */ jsx("pre", { children: /* @__PURE__ */ jsx("code", { children: enrollmentsQuery.data?.map((student) => student.email + "\n") }) })
		]
	});
}
//#endregion
//#region src/features/local/utils/settingsUtils.tsx
var parseHolidays = (inputText) => {
	let holidays = [];
	const lines = inputText.split("\n").filter((line) => line.trim() !== "");
	let currentHoliday = null;
	lines.forEach((line) => {
		if (line.includes(":")) {
			const holidayName = line.split(":")[0].trim();
			currentHoliday = holidayName;
			holidays = [...holidays, {
				name: holidayName,
				days: []
			}];
		} else if (currentHoliday && line.startsWith("-")) {
			const dateObject = getDateFromStringOrThrow(line.replace("-", "").trim(), "parsing holiday text");
			holidays.find((h) => h.name == currentHoliday)?.days.push(getDateOnlyMarkdownString(dateObject));
		}
	});
	return holidays;
};
var holidaysToString = (holidays) => {
	return holidays.map((holiday) => {
		return holiday.name + ":\n" + holiday.days.map((d) => `- ${d}\n`).join("");
	}).join("");
};
//#endregion
//#region src/app/course/[courseName]/settings/HolidayConfig.tsx
var exampleString = `springBreak:
- 10/12/2024
- 10/13/2024
- 10/14/2024
laborDay:
- 9/1/2024`;
var holidaysAreEqual = (holidays1, holidays2) => {
	if (holidays1.length !== holidays2.length) return false;
	const sortedObj1 = [...holidays1].sort((a, b) => a.name.localeCompare(b.name));
	const sortedObj2 = [...holidays2].sort((a, b) => a.name.localeCompare(b.name));
	for (let i = 0; i < sortedObj1.length; i++) {
		const holiday1 = sortedObj1[i];
		const holiday2 = sortedObj2[i];
		if (holiday1.name !== holiday2.name) return false;
		const sortedDays1 = [...holiday1.days].sort();
		const sortedDays2 = [...holiday2.days].sort();
		if (sortedDays1.length !== sortedDays2.length) return false;
		for (let j = 0; j < sortedDays1.length; j++) if (sortedDays1[j] !== sortedDays2[j]) return false;
	}
	return true;
};
function HolidayConfig() {
	return /* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: /* @__PURE__ */ jsx(InnerHolidayConfig, {}) });
}
function InnerHolidayConfig() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const updateSettings = useUpdateLocalCourseSettingsMutation();
	const [rawText, setRawText] = useState(holidaysToString(settings.holidays));
	useEffect(() => {
		const id = setTimeout(() => {
			try {
				const parsed = parseHolidays(rawText);
				if (!holidaysAreEqual(settings.holidays, parsed)) {
					console.log("different holiday configs", settings.holidays, parsed);
					updateSettings.mutate({ settings: {
						...settings,
						holidays: parsed
					} });
				}
			} catch {}
		}, 500);
		return () => clearTimeout(id);
	}, [
		rawText,
		settings.holidays,
		settings,
		updateSettings
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: settingsBox,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-row gap-3",
			children: [/* @__PURE__ */ jsx(TextInput, {
				value: rawText,
				setValue: setRawText,
				label: "Holiday Days",
				isTextArea: true
			}), /* @__PURE__ */ jsxs("div", { children: ["Format your holidays like so:", /* @__PURE__ */ jsx("pre", { children: /* @__PURE__ */ jsx("code", { children: exampleString }) })] })]
		}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: /* @__PURE__ */ jsx(ParsedHolidaysDisplay, { value: rawText }) }) })]
	});
}
function ParsedHolidaysDisplay({ value }) {
	const [parsedHolidays, setParsedHolidays] = useState([]);
	const [error, setError] = useState("");
	useEffect(() => {
		try {
			setParsedHolidays(parseHolidays(value));
			setError("");
		} catch (error) {
			setError(error + "");
		}
	}, [value]);
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "text-rose-500",
		children: error
	}), parsedHolidays.map((holiday) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", { children: holiday.name }), /* @__PURE__ */ jsx("div", { children: holiday.days.map((day) => {
		return /* @__PURE__ */ jsx("div", { children: getDateFromString(day)?.toLocaleDateString("en-us", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric"
		}) }, day);
	}) })] }, holiday.name))] });
}
//#endregion
//#region src/app/course/[courseName]/settings/SettingsHeader.tsx
function SettingsHeader() {
	const { courseName } = useCourseContext();
	const { data: settings } = useLocalCourseSettingsQuery();
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex flex-row justify-between",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "my-auto",
				children: /* @__PURE__ */ jsx(Link, {
					className: "btn",
					to: getCourseUrl(courseName),
					children: "Back To Course"
				})
			}),
			/* @__PURE__ */ jsxs("h3", {
				className: "text-center mb-3",
				children: [
					settings.name,
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-slate-500 text-xl",
						children: " settings"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {})
		]
	}), /* @__PURE__ */ jsx("hr", {})] });
}
//#endregion
//#region src/app/course/[courseName]/settings/StartAndEndDate.tsx
function StartAndEndDate() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const startDate = new Date(settings.startDate);
	const endDate = new Date(settings.endDate);
	return /* @__PURE__ */ jsxs("div", {
		className: settingsBox,
		children: [/* @__PURE__ */ jsxs("div", { children: ["Semester Start: ", getDateOnlyMarkdownString(startDate)] }), /* @__PURE__ */ jsxs("div", { children: ["Semester End: ", getDateOnlyMarkdownString(endDate)] })]
	});
}
//#endregion
//#region src/app/course/[courseName]/settings/SubmissionDefaults.tsx
function SubmissionDefaults() {
	const { data: settings } = useLocalCourseSettingsQuery();
	const [defaultSubmissionTypes, setDefaultSubmissionTypes] = useState(settings.defaultAssignmentSubmissionTypes);
	const updateSettings = useUpdateLocalCourseSettingsMutation();
	useEffect(() => {
		if (JSON.stringify(settings.defaultAssignmentSubmissionTypes) !== JSON.stringify(defaultSubmissionTypes)) updateSettings.mutate({ settings: {
			...settings,
			defaultAssignmentSubmissionTypes: defaultSubmissionTypes
		} });
	}, [
		defaultSubmissionTypes,
		settings,
		updateSettings
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: settingsBox,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-center",
				children: "Default Assignment Submission Type"
			}),
			defaultSubmissionTypes.map((type, index) => /* @__PURE__ */ jsx("div", {
				className: "flex flex-row gap-3",
				children: /* @__PURE__ */ jsx(SelectInput, {
					value: type,
					setValue: (newType) => {
						if (newType) setDefaultSubmissionTypes((oldTypes) => oldTypes.map((t, i) => i === index ? newType : t));
					},
					label: "",
					options: AssignmentSubmissionTypeList,
					getOptionName: (t) => t
				})
			}, index)),
			/* @__PURE__ */ jsxs("div", {
				className: "flex gap-3 mt-3",
				children: [/* @__PURE__ */ jsx("button", {
					className: "btn-danger",
					onClick: () => {
						setDefaultSubmissionTypes((old) => old.slice(0, -1));
					},
					children: "Remove Default Type"
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => setDefaultSubmissionTypes((old) => [...old, AssignmentSubmissionType.NONE]),
					children: "Add Default Type"
				})]
			})
		]
	});
}
//#endregion
//#region src/app/course/[courseName]/settings/AllSettings.tsx
function AllSettings() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(SettingsHeader, {}),
		/* @__PURE__ */ jsx(DaysOfWeekSettings, {}),
		/* @__PURE__ */ jsx(StartAndEndDate, {}),
		/* @__PURE__ */ jsx(GithubClassroomList, {}),
		/* @__PURE__ */ jsx(SubmissionDefaults, {}),
		/* @__PURE__ */ jsx(DefaultFileUploadTypes, {}),
		/* @__PURE__ */ jsx(DefaultDueTime, {}),
		/* @__PURE__ */ jsx(AssignmentGroupManagement, {}),
		/* @__PURE__ */ jsx(HolidayConfig, {}),
		/* @__PURE__ */ jsx(CanvasNavigationManagement, {}),
		/* @__PURE__ */ jsx("div", { className: "p-16" }),
		/* @__PURE__ */ jsx("div", { className: "p-16" }),
		/* @__PURE__ */ jsx("div", { className: "p-16" }),
		/* @__PURE__ */ jsx("div", { className: "p-16" }),
		/* @__PURE__ */ jsx("div", { className: "p-16" })
	] });
}
//#endregion
//#region src/routes/course.$courseName.settings.tsx?tsr-split=component
function SettingsPage() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex justify-center h-full overflow-auto pt-5",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-fit",
			children: [
				/* @__PURE__ */ jsx(AllSettings, {}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("br", {}),
				/* @__PURE__ */ jsx("br", {})
			]
		})
	});
}
//#endregion
export { SettingsPage as component };
