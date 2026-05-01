import { t as ClientOnly } from "./ClientOnly-BaIsMvon.js";
import { t as AssignmentSubmissionType } from "./assignmentSubmissionType-CBVSV8hE.js";
import { n as Spinner, t as SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { i as rubricItemIsExtraCredit, t as localAssignmentMarkdown } from "./localAssignment-Cd9FVMF2.js";
import "./canvasWebRequestUtils-BTUhiXsN.js";
import { t as Route } from "./course._courseName.modules._moduleName.assignment._assignmentName-CrZk9wec.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { i as getCourseUrl, n as useModal, s as getModuleItemUrl, t as Modal } from "./Modal-C3Ziyb81.js";
import { t as TextInput } from "./TextInput-BDfN6cG0.js";
import { n as RightSingleChevron, r as MarkdownDisplay, t as BreadCrumbs } from "./BreadCrumbs-xctKec6Z.js";
import { a as useUpdateAssignmentInCanvasMutation, d as useUpdateImageSettingsForAssignment, i as useDeleteAssignmentFromCanvasMutation, l as useDeleteAssignmentMutation, n as useAddAssignmentToCanvasMutation, r as useCanvasAssignmentsQuery, s as useAssignmentQuery, t as canvasAssignmentKeys, u as useUpdateAssignmentMutation } from "./canvasAssignmentHooks-QjIsauvt.js";
import { n as assignmentPoints } from "./canvasAssignmentService-intGhTQJ.js";
import { a as MonacoEditor, i as useItemNavigation, n as useAuthoritativeUpdates, r as ItemNavigationButtons, t as EditLayout } from "./EditLayout-D_Zso86D.js";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient } from "@tanstack/react-query";
//#region src/services/utils/dateFormat.ts
function formatHumanReadableDate(date) {
	const d = typeof date === "string" ? new Date(date) : date;
	if (isNaN(d.getTime())) return "Invalid date";
	return d.toLocaleString(void 0, {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/assignment/[assignmentName]/AssignmentPreview.tsx
function AssignmentPreview({ assignment }) {
	const totalPoints = assignmentPoints(assignment.rubric);
	const extraPoints = assignment.rubric.reduce((sum, cur) => rubricItemIsExtraCredit(cur) ? sum + cur.points : sum, 0);
	return /* @__PURE__ */ jsxs("div", {
		className: "h-full overflow-y-auto ",
		children: [
			/* @__PURE__ */ jsxs("section", { children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex-1 text-end pe-3",
						children: "Due Date"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex-1",
						children: formatHumanReadableDate(assignment.dueAt)
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex-1 text-end pe-3",
						children: "Lock Date"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex-1",
						children: assignment.lockAt && formatHumanReadableDate(assignment.lockAt)
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex-1 text-end pe-3",
						children: "Assignment Group Name"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex-1",
						children: assignment.localAssignmentGroupName
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex-1 text-end pe-3",
						children: "Submission Types"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex-1",
						children: /* @__PURE__ */ jsx("ul", {
							className: "",
							children: assignment.submissionTypes.map((t) => /* @__PURE__ */ jsx("li", { children: t }, t))
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex-1 text-end pe-3",
						children: "File Upload Types"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex-1",
						children: /* @__PURE__ */ jsx("ul", {
							className: "",
							children: assignment.allowedFileUploadExtensions.map((t) => /* @__PURE__ */ jsx("li", { children: t }, t))
						})
					})]
				})
			] }),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("hr", {}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx(MarkdownDisplay, {
				markdown: assignment.description,
				replaceText: [{
					source: "insert_github_classroom_url",
					destination: assignment.githubClassroomAssignmentShareLink || ""
				}]
			}) }),
			/* @__PURE__ */ jsx("hr", {}),
			/* @__PURE__ */ jsxs("section", { children: [
				/* @__PURE__ */ jsxs("h2", {
					className: "text-center",
					children: [
						"Rubric - ",
						totalPoints,
						" Points"
					]
				}),
				extraPoints !== 0 && /* @__PURE__ */ jsxs("h5", {
					className: "text-center",
					children: [extraPoints, " Extra Credit Points"]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-[auto_auto_1fr]",
					children: assignment.rubric.map((rubricItem, i) => /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-end pe-1",
							children: rubricItemIsExtraCredit(rubricItem) ? "Extra Credit" : ""
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-end pe-3",
							children: rubricItem.points
						}),
						/* @__PURE__ */ jsx("div", { children: rubricItem.label })
					] }, rubricItem.label + i))
				})
			] })
		]
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/assignment/[assignmentName]/AssignmentFooterButtons.tsx
function AssignmentFooterButtons({ moduleName, assignmentName, toggleHelp }) {
	const navigate = useNavigate();
	const router = useRouter();
	const { courseName } = useCourseContext();
	const { data: settings } = useLocalCourseSettingsQuery();
	const { data: canvasAssignments, isFetching: canvasIsFetching } = useCanvasAssignmentsQuery();
	const queryClient = useQueryClient();
	const { data: assignment, isFetching } = useAssignmentQuery(moduleName, assignmentName);
	const addToCanvas = useAddAssignmentToCanvasMutation();
	const deleteFromCanvas = useDeleteAssignmentFromCanvasMutation();
	const updateAssignment = useUpdateAssignmentInCanvasMutation();
	const deleteLocal = useDeleteAssignmentMutation();
	const [isLoading, setIsLoading] = useState(false);
	const modal = useModal();
	const { previousUrl, nextUrl } = useItemNavigation("assignment", assignmentName, moduleName);
	const assignmentInCanvas = canvasAssignments?.find((a) => a.name === assignmentName);
	const anythingIsLoading = addToCanvas.isPending || canvasIsFetching || isFetching || deleteFromCanvas.isPending || updateAssignment.isPending;
	return /* @__PURE__ */ jsxs("div", {
		className: "p-5 flex flex-row justify-between gap-3",
		children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", {
			onClick: toggleHelp,
			children: "Toggle Help"
		}) }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-row gap-3 justify-end",
			children: [
				anythingIsLoading && /* @__PURE__ */ jsx(Spinner, {}),
				assignmentInCanvas && !assignmentInCanvas?.published && /* @__PURE__ */ jsx("div", {
					className: "text-rose-300 my-auto",
					children: "Not Published"
				}),
				!assignmentInCanvas && /* @__PURE__ */ jsx("button", {
					disabled: addToCanvas.isPending,
					onClick: () => addToCanvas.mutate({
						assignment,
						moduleName
					}),
					children: "Add to canvas"
				}),
				assignmentInCanvas && /* @__PURE__ */ jsx("a", {
					className: "btn",
					target: "_blank",
					href: `https://snow.instructure.com/courses/${settings.canvasId}/assignments/${assignmentInCanvas.id}`,
					onClick: () => {
						for (let i = 1; i <= 8; i += 2) setTimeout(() => {
							queryClient.invalidateQueries({ queryKey: canvasAssignmentKeys.assignments(settings.canvasId) });
						}, i * 1e3);
					},
					children: "View in Canvas"
				}),
				assignmentInCanvas && /* @__PURE__ */ jsx("button", {
					className: "",
					disabled: deleteFromCanvas.isPending,
					onClick: () => updateAssignment.mutate({
						canvasAssignmentId: assignmentInCanvas.id,
						assignment
					}),
					children: "Update in Canvas"
				}),
				assignmentInCanvas && /* @__PURE__ */ jsx("button", {
					className: "btn-danger",
					disabled: deleteFromCanvas.isPending,
					onClick: () => deleteFromCanvas.mutate({
						canvasAssignmentId: assignmentInCanvas.id,
						assignmentName: assignment.name
					}),
					children: "Delete from Canvas"
				}),
				!assignmentInCanvas && /* @__PURE__ */ jsx(Modal, {
					modalControl: modal,
					buttonText: "Delete Localy",
					buttonClass: "btn-danger",
					modalWidth: "w-1/5",
					children: ({ closeModal }) => /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: "Are you sure you want to delete this assignment locally?"
						}),
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-around gap-3",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: async () => {
									navigate({ to: getCourseUrl(courseName) });
									setIsLoading(true);
									await deleteLocal.mutateAsync({
										moduleName,
										assignmentName,
										courseName
									});
									router.invalidate();
								},
								disabled: deleteLocal.isPending || isLoading,
								className: "btn-danger",
								children: "Yes"
							}), /* @__PURE__ */ jsx("button", {
								onClick: closeModal,
								disabled: deleteLocal.isPending || isLoading,
								children: "No"
							})]
						}),
						(deleteLocal.isPending || isLoading) && /* @__PURE__ */ jsx(Spinner, {})
					] })
				}),
				/* @__PURE__ */ jsx(Link, {
					className: "btn",
					to: getCourseUrl(courseName),
					children: "Go Back"
				}),
				/* @__PURE__ */ jsx(ItemNavigationButtons, {
					previousUrl,
					nextUrl
				})
			]
		})]
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/assignment/[assignmentName]/UpdateAssignmentName.tsx
function UpdateAssignmentName({ moduleName, assignmentName }) {
	const modal = useModal();
	const { courseName } = useCourseContext();
	const navigate = useNavigate();
	const { data: assignment } = useAssignmentQuery(moduleName, assignmentName);
	const updateAssignment = useUpdateAssignmentMutation();
	const [name, setName] = useState(assignment.name);
	const [isLoading, setIsLoading] = useState(false);
	return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Modal, {
		modalControl: modal,
		buttonText: "Rename Assignment",
		buttonClass: "py-0",
		modalWidth: "w-1/5",
		children: ({ closeModal }) => /* @__PURE__ */ jsxs("form", {
			onSubmit: async (e) => {
				e.preventDefault();
				if (name === assignmentName) closeModal();
				setIsLoading(true);
				try {
					await updateAssignment.mutateAsync({
						assignment,
						moduleName,
						assignmentName: name,
						previousModuleName: moduleName,
						previousAssignmentName: assignmentName,
						courseName
					});
					navigate({
						to: getModuleItemUrl(courseName, moduleName, "assignment", name),
						replace: true
					});
				} finally {
					setIsLoading(false);
				}
			},
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "\n                text-yellow-300 \n                bg-yellow-950/30 \n                border-2 \n                rounded-lg \n                border-yellow-800 \n                p-1 text-sm mb-2",
					children: "Warning: does not rename in Canvas"
				}),
				/* @__PURE__ */ jsx(TextInput, {
					value: name,
					setValue: setName,
					label: "Rename Assignment"
				}),
				/* @__PURE__ */ jsx("button", {
					className: "w-full my-3",
					children: "Save New Name"
				}),
				isLoading && /* @__PURE__ */ jsx(Spinner, {})
			]
		})
	}) });
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/assignment/[assignmentName]/EditAssignmentHeader.tsx
function EditAssignmentHeader({ moduleName, assignmentName }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "py-1 flex flex-row justify-between",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-row",
			children: [
				/* @__PURE__ */ jsx(BreadCrumbs, {}),
				/* @__PURE__ */ jsx("span", {
					className: "text-slate-500 cursor-default select-none my-auto",
					children: /* @__PURE__ */ jsx(RightSingleChevron, {})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "my-auto px-3",
					children: assignmentName
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "px-1",
			children: /* @__PURE__ */ jsx(UpdateAssignmentName, {
				assignmentName,
				moduleName
			})
		})]
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/assignment/[assignmentName]/getAssignmentHelpString.tsx
function getAssignmentHelpString(settings) {
	return `
Assignment Group Names:
- ${settings.assignmentGroups.map((g) => g.name).join("\n- ")}
SubmissionTypes:
- ${AssignmentSubmissionType.ONLINE_TEXT_ENTRY}
- ${AssignmentSubmissionType.ONLINE_UPLOAD}
- ${AssignmentSubmissionType.DISCUSSION_TOPIC}
AllowedFileUploadExtensions:
- pdf
- jpg
- jpeg
- png
---

description goes here


## Markdown
You can use markdown to format your assignment description. For example, you can make lists like this:
- Item 1
- Item 2
- Item 3

**Bold text**

*Italic text*

[Link to Canvas](https://canvas.instructure.com)


\`Inline code\`

> Blockquote

---

1. First item
2. Second item
3. Third item

you can make mermaid diagrams like this:

\`\`\`mermaid
flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
\`\`\`

## LaTeX Math

**Inline math:** The Fibonacci sequence is defined as: \$F(n) = F(n-1) + F(n-2)\$ where \$F(0) = 0\$ and \$F(1) = 1\$.

**Block math:**
\$\$F(n) = F(n-1) + F(n-2)\$\$

**Complex equations:**
\$\$
F(n) = \\begin{cases} 
0 & \\text{if } n = 0 \\\\
1 & \\text{if } n = 1 \\\\
F(n-1) + F(n-2) & \\text{if } n > 1
\\end{cases}
\$\$

## github classroom links will be replaced by the GithubClassroomAssignmentShareLink setting

[Github Classroom](insert_github_classroom_url)

## Files

If you have mounted a folder in the /app/public/images directory, you can link to files like this:

![formulas](/images/facultyFiles/1405/lab-04-simple-math-formulas.png)

## Rubric

- 1pt: singular point
- 1pts: plural points
- 10pts: (extra credit) extra credit points
- 10pts: (Extra Credit) Caps also works`;
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/assignment/[assignmentName]/EditAssignment.tsx
function EditAssignment({ moduleName, assignmentName }) {
	const { courseName } = useCourseContext();
	const { data: settings } = useLocalCourseSettingsQuery();
	const { data: assignment, dataUpdatedAt: serverDataUpdatedAt, isFetching: assignmentIsFetching } = useAssignmentQuery(moduleName, assignmentName);
	const updateAssignment = useUpdateAssignmentMutation();
	const { isPending: imageUpdateIsPending } = useUpdateImageSettingsForAssignment({
		moduleName,
		assignmentName
	});
	const { clientIsAuthoritative, text, textUpdate, monacoKey, serverUpdatedAt, clientDataUpdatedAt } = useAuthoritativeUpdates({
		serverUpdatedAt: serverDataUpdatedAt,
		startingText: localAssignmentMarkdown.toMarkdown(assignment)
	});
	const [error, setError] = useState("");
	const [showHelp, setShowHelp] = useState(false);
	useEffect(() => {
		const handler = setTimeout(() => {
			try {
				if (assignmentIsFetching || updateAssignment.isPending) {
					console.log("network requests in progress, not updating assignments");
					return;
				}
				const updatedAssignment = localAssignmentMarkdown.parseMarkdown(text, assignmentName);
				if (localAssignmentMarkdown.toMarkdown(assignment) !== localAssignmentMarkdown.toMarkdown(updatedAssignment)) if (clientIsAuthoritative) {
					console.log("updating assignment, client is authoritative");
					updateAssignment.mutateAsync({
						assignment: updatedAssignment,
						moduleName,
						assignmentName,
						previousModuleName: moduleName,
						previousAssignmentName: assignmentName,
						courseName
					});
				} else {
					console.log("client not authoritative, updating client with server assignment", "client updated", clientDataUpdatedAt, "server updated", serverUpdatedAt);
					textUpdate(localAssignmentMarkdown.toMarkdown(assignment), true);
				}
				setError("");
			} catch (e) {
				setError(e.toString());
			}
		}, 500);
		return () => {
			clearTimeout(handler);
		};
	}, [
		assignment,
		assignmentName,
		clientDataUpdatedAt,
		clientIsAuthoritative,
		courseName,
		assignmentIsFetching,
		moduleName,
		serverUpdatedAt,
		text,
		textUpdate,
		updateAssignment
	]);
	return /* @__PURE__ */ jsx(EditLayout, {
		Header: /* @__PURE__ */ jsx(EditAssignmentHeader, {
			moduleName,
			assignmentName
		}),
		Body: /* @__PURE__ */ jsxs(Fragment$1, { children: [
			showHelp && /* @__PURE__ */ jsxs("div", {
				className: " max-w-96 flex-1 h-full overflow-y-auto",
				children: [
					/* @__PURE__ */ jsx("pre", { children: /* @__PURE__ */ jsx("code", { children: getAssignmentHelpString(settings) }) }),
					/* @__PURE__ */ jsx("a", {
						href: "https://www.markdownguide.org/cheat-sheet/",
						target: "_blank",
						className: "text-blue-400 underline",
						children: "Markdown Cheat Sheet"
					}),
					/* @__PURE__ */ jsx("a", {
						href: "https://mermaid.live/edit",
						target: "_blank",
						className: "text-blue-400 underline ps-3",
						children: "Mermaid Live Editor"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 h-full",
				children: /* @__PURE__ */ jsx(MonacoEditor, {
					value: text,
					onChange: textUpdate
				}, monacoKey)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 h-full",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-red-300",
					children: error && error
				}), /* @__PURE__ */ jsx("div", {
					className: "px-3 h-full ",
					children: /* @__PURE__ */ jsx(ClientOnly, { children: /* @__PURE__ */ jsxs(SuspenseAndErrorHandling, {
						showToast: false,
						children: [imageUpdateIsPending && /* @__PURE__ */ jsxs("div", {
							className: "flex justify-center",
							children: [/* @__PURE__ */ jsx(Spinner, {}), " images being uploaded to canvas"]
						}), /* @__PURE__ */ jsx(AssignmentPreview, { assignment })]
					}) })
				})]
			})
		] }),
		Footer: /* @__PURE__ */ jsx(ClientOnly, { children: /* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: /* @__PURE__ */ jsx(AssignmentFooterButtons, {
			moduleName,
			assignmentName,
			toggleHelp: () => setShowHelp((h) => !h)
		}) }) })
	});
}
//#endregion
//#region src/routes/course.$courseName.modules.$moduleName.assignment.$assignmentName.tsx?tsr-split=component
function AssignmentPage() {
	const { moduleName, assignmentName } = Route.useParams();
	return /* @__PURE__ */ jsx(EditAssignment, {
		assignmentName: decodeURIComponent(assignmentName),
		moduleName: decodeURIComponent(moduleName)
	});
}
//#endregion
export { AssignmentPage as component };
