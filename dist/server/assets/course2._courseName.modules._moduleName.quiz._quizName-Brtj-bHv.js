import { t as ClientOnly } from "./ClientOnly-BaIsMvon.js";
import { t as getFeedbackDelimitersFromSettings } from "./globalSettingsUtils-gIgphMXr.js";
import { n as Spinner, t as SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { t as useGlobalSettingsQuery } from "./globalSettingsHooks-DrZfa4te.js";
import { t as extractLabelValue } from "./markdownUtils-Ckxeou8m.js";
import { t as QuestionType } from "./localQuizQuestion-DBCpCJHX.js";
import { t as quizMarkdownUtils } from "./quizMarkdownUtils-Ci_0iymX.js";
import "./canvasWebRequestUtils-BTUhiXsN.js";
import { t as Route } from "./course._courseName.modules._moduleName.quiz._quizName-CkXIsc63.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { i as getCourseUrl, n as useModal, s as getModuleItemUrl, t as Modal } from "./Modal-C3Ziyb81.js";
import { t as TextInput } from "./TextInput-BDfN6cG0.js";
import { n as RightSingleChevron, r as MarkdownDisplay, t as BreadCrumbs } from "./BreadCrumbs-xctKec6Z.js";
import { a as useDeleteQuizFromCanvasMutation, c as useDeleteQuizMutation, d as useUpdateQuizMutation, i as useCanvasQuizzesQuery, l as useQuizQuery, o as escapeMatchingText, r as useAddQuizToCanvasMutation, t as CheckIcon } from "./CheckIcon-CmVj9-Zn.js";
import { a as MonacoEditor, i as useItemNavigation, n as useAuthoritativeUpdates, r as ItemNavigationButtons, t as EditLayout } from "./EditLayout-D_Zso86D.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/app/course/[courseName]/modules/[moduleName]/quiz/[quizName]/QuizPreview.tsx
function QuizPreview({ moduleName, quizName }) {
	const { data: quiz } = useQuizQuery(moduleName, quizName);
	return /* @__PURE__ */ jsxs("div", {
		style: {
			overflow: "scroll",
			height: "100%"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "columns-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-end",
					children: "Name"
				}), /* @__PURE__ */ jsx("div", { children: quiz.name })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "columns-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-end",
					children: "Points"
				}), /* @__PURE__ */ jsx("div", { children: quiz.questions.reduce((sum, question) => sum + question.points, 0) })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "columns-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-end",
					children: "Due Date"
				}), /* @__PURE__ */ jsx("div", { children: quiz.dueAt })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "columns-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-end",
					children: "Lock At"
				}), /* @__PURE__ */ jsx("div", { children: quiz.lockAt })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "columns-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-end",
					children: "Shuffle Answers"
				}), /* @__PURE__ */ jsx("div", { children: quiz.shuffleAnswers })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "columns-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-end",
					children: "Allowed Attempts"
				}), /* @__PURE__ */ jsx("div", { children: quiz.allowedAttempts })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "columns-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-end",
					children: "One Question at a Time"
				}), /* @__PURE__ */ jsx("div", { children: quiz.oneQuestionAtATime })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "columns-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-end",
					children: "Assignment Group Name"
				}), /* @__PURE__ */ jsx("div", { children: quiz.localAssignmentGroupName })]
			}),
			/* @__PURE__ */ jsx(MarkdownDisplay, {
				markdown: quiz.description,
				className: "p-3"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-3 rounded-md bg-slate-950 m-5 flex flex-col gap-3",
				children: quiz.questions.map((question, i) => /* @__PURE__ */ jsx(QuizQuestionPreview, { question }, i))
			}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("br", {}),
			/* @__PURE__ */ jsx("br", {})
		]
	});
}
function QuizQuestionPreview({ question }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded bg-slate-900 px-2",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-row justify-between text-slate-400",
				children: [/* @__PURE__ */ jsx("div", { children: question.questionType }), /* @__PURE__ */ jsxs("div", {
					className: "",
					children: [
						question.points,
						" ",
						question.points === 1 ? " Point" : " Points"
					]
				})]
			}),
			/* @__PURE__ */ jsx(MarkdownDisplay, {
				markdown: question.text,
				className: "ms-4 mb-2"
			}),
			(question.correctComments || question.incorrectComments || question.neutralComments) && /* @__PURE__ */ jsxs("div", {
				className: " m-2 ps-2 py-1 rounded flex bg-slate-950/50",
				children: [/* @__PURE__ */ jsx("div", { children: "Feedback" }), /* @__PURE__ */ jsxs("div", {
					className: "mx-4 space-y-1",
					children: [
						question.correctComments && /* @__PURE__ */ jsxs("div", {
							className: "border-l-2 border-green-700 pl-2 py-1 flex",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-green-500",
								children: "+ "
							}), /* @__PURE__ */ jsx(MarkdownDisplay, {
								markdown: question.correctComments,
								className: "ms-4 mb-2"
							})]
						}),
						question.incorrectComments && /* @__PURE__ */ jsxs("div", {
							className: "border-l-2 border-red-700 pl-2 py-1 flex",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-red-500",
								children: "- "
							}), /* @__PURE__ */ jsx(MarkdownDisplay, {
								markdown: question.incorrectComments,
								className: "ms-4 mb-2"
							})]
						}),
						question.neutralComments && /* @__PURE__ */ jsxs("div", {
							className: "border-l-2 border-blue-800 pl-2 py-1 flex",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-blue-500",
								children: "... "
							}), /* @__PURE__ */ jsx(MarkdownDisplay, {
								markdown: question.neutralComments,
								className: "ms-4 mb-2"
							})]
						})
					]
				})]
			}),
			question.questionType === QuestionType.MATCHING && /* @__PURE__ */ jsxs("div", { children: [question.answers.map((answer) => /* @__PURE__ */ jsxs("div", {
				className: "mx-3 mb-1 bg-dark rounded border border-slate-600 flex flex-row",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-right my-auto flex-1 pe-3",
					children: escapeMatchingText(answer.text)
				}), /* @__PURE__ */ jsx("div", {
					className: " flex-1",
					children: answer.matchedText
				})]
			}, JSON.stringify(answer))), question.matchDistractors.map((distractor) => /* @__PURE__ */ jsxs("div", {
				className: "mx-3 mb-1 bg-dark px-2 rounded border flex row",
				children: ["DISTRACTOR: ", distractor]
			}, distractor))] }),
			question.questionType !== QuestionType.MATCHING && /* @__PURE__ */ jsx("div", { children: question.answers.map((answer) => /* @__PURE__ */ jsxs("div", {
				className: "mx-3 mb-1 pt-1 border-t border-slate-700 flex flex-row",
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-8 flex flex-col justify-center",
					children: answer.correct ? /* @__PURE__ */ jsx(CheckIcon, {}) : question.questionType === QuestionType.MULTIPLE_ANSWERS ? /* @__PURE__ */ jsx("span", {
						className: "mx-auto",
						children: "[ ]"
					}) : /* @__PURE__ */ jsx("div", {})
				}), /* @__PURE__ */ jsx(MarkdownDisplay, {
					markdown: answer.text,
					className: "markdownQuizAnswerPreview"
				})]
			}, JSON.stringify(answer))) })
		]
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/quiz/[quizName]/QuizButton.tsx
function QuizButtons({ moduleName, quizName, toggleHelp }) {
	const navigate = useNavigate();
	const { courseName } = useCourseContext();
	const { data: settings } = useLocalCourseSettingsQuery();
	const { data: canvasQuizzes } = useCanvasQuizzesQuery();
	const { data: quiz } = useQuizQuery(moduleName, quizName);
	const addToCanvas = useAddQuizToCanvasMutation();
	const deleteFromCanvas = useDeleteQuizFromCanvasMutation();
	const deleteLocal = useDeleteQuizMutation();
	const modal = useModal();
	const { previousUrl, nextUrl } = useItemNavigation("quiz", quizName, moduleName);
	const quizInCanvas = canvasQuizzes?.find((c) => c.title === quizName);
	return /* @__PURE__ */ jsxs("div", {
		className: "p-5 flex flex-row justify-between",
		children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", {
			onClick: toggleHelp,
			children: "Toggle Help"
		}) }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-row gap-3 justify-end",
			children: [
				(addToCanvas.isPending || deleteFromCanvas.isPending) && /* @__PURE__ */ jsx(Spinner, {}),
				quizInCanvas && !quizInCanvas.published && /* @__PURE__ */ jsx("div", {
					className: "text-rose-300 my-auto",
					children: "Not Published"
				}),
				!quizInCanvas && /* @__PURE__ */ jsx("button", {
					disabled: addToCanvas.isPending,
					onClick: () => addToCanvas.mutate({
						quiz,
						moduleName
					}),
					children: "Add to canvas"
				}),
				quizInCanvas && /* @__PURE__ */ jsx("a", {
					className: "btn",
					target: "_blank",
					href: `https://snow.instructure.com/courses/${settings.canvasId}/quizzes/${quizInCanvas.id}`,
					children: "View in Canvas"
				}),
				quizInCanvas && /* @__PURE__ */ jsx("button", {
					className: "btn-danger",
					disabled: deleteFromCanvas.isPending,
					onClick: () => deleteFromCanvas.mutate(quizInCanvas.id),
					children: "Delete from Canvas"
				}),
				!quizInCanvas && /* @__PURE__ */ jsx(Modal, {
					modalControl: modal,
					buttonText: "Delete Localy",
					buttonClass: "btn-danger",
					modalWidth: "w-1/5",
					children: ({ closeModal }) => /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-center",
							children: "Are you sure you want to delete this quiz locally?"
						}),
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-around gap-3",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: async () => {
									await deleteLocal.mutateAsync({
										moduleName,
										quizName,
										courseName
									});
									navigate({ to: getCourseUrl(courseName) });
								},
								className: "btn-danger",
								children: "Yes"
							}), /* @__PURE__ */ jsx("button", {
								onClick: closeModal,
								children: "No"
							})]
						})
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
//#region src/app/course/[courseName]/modules/[moduleName]/quiz/[quizName]/UpdateQuizName.tsx
function UpdateQuizName({ moduleName, quizName }) {
	const modal = useModal();
	const { courseName } = useCourseContext();
	const navigate = useNavigate();
	const { data: quiz } = useQuizQuery(moduleName, quizName);
	const updateQuiz = useUpdateQuizMutation();
	const [name, setName] = useState(quiz.name);
	const [isLoading, setIsLoading] = useState(false);
	return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Modal, {
		modalControl: modal,
		buttonText: "Rename Quiz",
		buttonClass: "py-0",
		modalWidth: "w-1/5",
		children: ({ closeModal }) => /* @__PURE__ */ jsxs("form", {
			onSubmit: async (e) => {
				e.preventDefault();
				if (name === quizName) closeModal();
				setIsLoading(true);
				await updateQuiz.mutateAsync({
					quiz,
					moduleName,
					quizName: name,
					previousModuleName: moduleName,
					previousQuizName: quizName,
					courseName
				});
				navigate({
					to: getModuleItemUrl(courseName, moduleName, "quiz", name),
					replace: true
				});
			},
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "\n                text-yellow-300 \n                bg-yellow-950/30 \n                border-2 \n                rounded-lg \n                border-yellow-800 \n                p-1 text-sm mb-2",
					children: "Warning: does not rename in Canvas"
				}),
				/* @__PURE__ */ jsx(TextInput, {
					value: name,
					setValue: setName,
					label: "Rename Quiz"
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
//#region src/app/course/[courseName]/modules/[moduleName]/quiz/[quizName]/EditQuizHeader.tsx
function EditQuizHeader({ moduleName, quizName }) {
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
					children: quizName
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "px-1",
			children: /* @__PURE__ */ jsx(UpdateQuizName, {
				quizName,
				moduleName
			})
		})]
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/quiz/[quizName]/EditQuiz.tsx
var helpString = (settings) => {
	return `Assignment Group Names:
- ${settings.assignmentGroups.map((g) => g.name).join("\n- ")}

QUESTION REFERENCE
---
Points: 2
this is a question?
*a) correct
b) not correct
---
points: 1
question goes here
[*] correct
[ ] not correct
[] not correct
---
the points default to 1?
*a) true
b) false
---
Markdown is supported

- like
- this
- list

[*] true
[ ] false
---
This is a one point essay question
essay
---
points: 4
this is a short answer question
short_answer
---
points: 4
the underscore is optional
short answer
---
short answer with auto-graded responses
*a) answer 1
*b) other valid answer
short_answer=
---
this is a matching question
^ left answer - right dropdown
^ other thing -  another option
^ - distractor
^ - other distractor
---
Points: 3
FEEDBACK EXAMPLE
What is 2+3?
+ Correct! Good job
- Incorrect, try again
... This is general feedback shown regardless
*a) 4
*b) 5
c) 6
---
Points: 2
FEEDBACK EXAMPLE
Multiline feedback example
+
Great work!
You understand the concept.
-
Not quite right.
Review the material and try again.
*a) correct answer
b) wrong answer`;
};
function EditQuiz({ moduleName, quizName }) {
	const { data: settings } = useLocalCourseSettingsQuery();
	const { courseName } = useCourseContext();
	const { data: quiz, dataUpdatedAt: serverDataUpdatedAt, isFetching } = useQuizQuery(moduleName, quizName);
	const updateQuizMutation = useUpdateQuizMutation();
	const { data: globalSettings } = useGlobalSettingsQuery();
	const feedbackDelimiters = getFeedbackDelimitersFromSettings(globalSettings ?? {});
	const { clientIsAuthoritative, text, textUpdate, monacoKey } = useAuthoritativeUpdates({
		serverUpdatedAt: serverDataUpdatedAt,
		startingText: quizMarkdownUtils.toMarkdown(quiz, feedbackDelimiters)
	});
	const [error, setError] = useState("");
	const [showHelp, setShowHelp] = useState(false);
	useEffect(() => {
		const handler = setTimeout(async () => {
			if (isFetching || updateQuizMutation.isPending) {
				console.log("network requests in progress, not updating page");
				return;
			}
			try {
				const name = extractLabelValue(text, "Name");
				if (quizMarkdownUtils.toMarkdown(quiz, feedbackDelimiters) !== quizMarkdownUtils.toMarkdown(quizMarkdownUtils.parseMarkdown(text, name, feedbackDelimiters), feedbackDelimiters)) if (clientIsAuthoritative) {
					const updatedQuiz = quizMarkdownUtils.parseMarkdown(text, quizName, feedbackDelimiters);
					await updateQuizMutation.mutateAsync({
						quiz: updatedQuiz,
						moduleName,
						quizName,
						previousModuleName: moduleName,
						previousQuizName: quizName,
						courseName
					});
				} else {
					console.log("client not authoritative, updating client with server quiz");
					textUpdate(quizMarkdownUtils.toMarkdown(quiz), true);
				}
				setError("");
			} catch (e) {
				setError(e.toString());
			}
		}, 1e3);
		return () => {
			clearTimeout(handler);
		};
	}, [
		clientIsAuthoritative,
		courseName,
		feedbackDelimiters,
		isFetching,
		moduleName,
		quiz,
		quizName,
		text,
		textUpdate,
		updateQuizMutation
	]);
	return /* @__PURE__ */ jsx(EditLayout, {
		Header: /* @__PURE__ */ jsx(EditQuizHeader, {
			moduleName,
			quizName
		}),
		Body: /* @__PURE__ */ jsxs(Fragment$1, { children: [
			showHelp && /* @__PURE__ */ jsx("pre", {
				className: " max-w-96 h-full overflow-y-auto",
				children: /* @__PURE__ */ jsx("code", { children: helpString(settings) })
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
				}), /* @__PURE__ */ jsx(QuizPreview, {
					moduleName,
					quizName
				})]
			})
		] }),
		Footer: /* @__PURE__ */ jsx(ClientOnly, { children: /* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: /* @__PURE__ */ jsx(QuizButtons, {
			moduleName,
			quizName,
			toggleHelp: () => setShowHelp((h) => !h)
		}) }) })
	});
}
//#endregion
//#region src/routes/course.$courseName.modules.$moduleName.quiz.$quizName.tsx?tsr-split=component
function QuizPage() {
	const { moduleName, quizName } = Route.useParams();
	return /* @__PURE__ */ jsx(EditQuiz, {
		quizName: decodeURIComponent(quizName),
		moduleName: decodeURIComponent(moduleName)
	});
}
//#endregion
export { QuizPage as component };
