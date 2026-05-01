import { t as ClientOnly } from "./ClientOnly-BaIsMvon.js";
import { n as Spinner } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { t as localPageMarkdownUtils } from "./localCoursePageModels-CSM7BJDo.js";
import "./canvasWebRequestUtils-BTUhiXsN.js";
import { t as Route } from "./course._courseName.modules._moduleName.page._pageName-DvxeFv2w.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { i as getCourseUrl, n as useModal, s as getModuleItemUrl, t as Modal } from "./Modal-C3Ziyb81.js";
import { t as TextInput } from "./TextInput-BDfN6cG0.js";
import { n as RightSingleChevron, r as MarkdownDisplay, t as BreadCrumbs } from "./BreadCrumbs-xctKec6Z.js";
import { a as useUpdateCanvasPageMutation, c as usePageQuery, i as useDeleteCanvasPageMutation, n as useCanvasPagesQuery, r as useCreateCanvasPageMutation, s as useDeletePageMutation, u as useUpdatePageMutation } from "./canvasPageHooks-BRhUmr_q.js";
import { a as MonacoEditor, i as useItemNavigation, n as useAuthoritativeUpdates, r as ItemNavigationButtons, t as EditLayout } from "./EditLayout-D_Zso86D.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/app/course/[courseName]/modules/[moduleName]/page/[pageName]/PagePreview.tsx
function PagePreview({ page }) {
	return /* @__PURE__ */ jsx(MarkdownDisplay, { markdown: page.text });
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/page/[pageName]/EditPageButtons.tsx
function EditPageButtons({ moduleName, pageName }) {
	const navigate = useNavigate();
	const { courseName } = useCourseContext();
	const { data: settings } = useLocalCourseSettingsQuery();
	const { data: page } = usePageQuery(moduleName, pageName);
	const { data: canvasPages } = useCanvasPagesQuery();
	const createPageInCanvas = useCreateCanvasPageMutation();
	const updatePageInCanvas = useUpdateCanvasPageMutation();
	const deletePageInCanvas = useDeleteCanvasPageMutation();
	const deletePageLocal = useDeletePageMutation();
	const modal = useModal();
	const [loading, setLoading] = useState(false);
	const { previousUrl, nextUrl } = useItemNavigation("page", pageName, moduleName);
	const pageInCanvas = canvasPages?.find((p) => p.title === pageName);
	const requestIsPending = createPageInCanvas.isPending || updatePageInCanvas.isPending || deletePageInCanvas.isPending;
	return /* @__PURE__ */ jsxs("div", {
		className: "p-5 flex justify-end flex-row gap-x-3",
		children: [
			requestIsPending && /* @__PURE__ */ jsx(Spinner, {}),
			!pageInCanvas && /* @__PURE__ */ jsx("button", {
				onClick: () => createPageInCanvas.mutate({
					page,
					moduleName
				}),
				disabled: requestIsPending,
				children: "Add to Canvas"
			}),
			pageInCanvas && /* @__PURE__ */ jsx("button", {
				onClick: () => updatePageInCanvas.mutate({
					page,
					canvasPageId: pageInCanvas.page_id
				}),
				disabled: requestIsPending,
				children: "Update in Canvas"
			}),
			pageInCanvas && /* @__PURE__ */ jsx("a", {
				className: "btn",
				target: "_blank",
				href: `https://snow.instructure.com/courses/${settings.canvasId}/pages/${pageInCanvas.url}`,
				children: "View in Canvas"
			}),
			pageInCanvas && /* @__PURE__ */ jsx("button", {
				className: "btn-danger",
				onClick: () => deletePageInCanvas.mutate(pageInCanvas.page_id),
				disabled: requestIsPending,
				children: "Delete from Canvas"
			}),
			!pageInCanvas && /* @__PURE__ */ jsx(Modal, {
				modalControl: modal,
				buttonText: "Delete Localy",
				buttonClass: "btn-danger",
				modalWidth: "w-1/5",
				children: ({ closeModal }) => /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-center",
						children: "Are you sure you want to delete this page locally?"
					}),
					/* @__PURE__ */ jsx("br", {}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-around gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: async () => {
								setLoading(true);
								await deletePageLocal.mutateAsync({
									moduleName,
									pageName,
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
					}),
					loading && /* @__PURE__ */ jsx(Spinner, {})
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
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/page/[pageName]/UpdatePageName.tsx
function UpdatePageName({ moduleName, pageName }) {
	const modal = useModal();
	const { courseName } = useCourseContext();
	const navigate = useNavigate();
	const { data: page } = usePageQuery(moduleName, pageName);
	const updatePage = useUpdatePageMutation();
	const [name, setName] = useState(page.name);
	const [isLoading, setIsLoading] = useState(false);
	return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Modal, {
		modalControl: modal,
		buttonText: "Rename Page",
		buttonClass: "py-0",
		modalWidth: "w-1/5",
		children: ({ closeModal }) => /* @__PURE__ */ jsxs("form", {
			onSubmit: async (e) => {
				e.preventDefault();
				if (name === pageName) closeModal();
				setIsLoading(true);
				await updatePage.mutateAsync({
					page,
					moduleName,
					pageName: name,
					previousModuleName: moduleName,
					previousPageName: pageName,
					courseName
				});
				navigate({
					to: getModuleItemUrl(courseName, moduleName, "page", name),
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
					label: "Rename Page"
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
//#region src/app/course/[courseName]/modules/[moduleName]/page/[pageName]/EditPageHeader.tsx
function EditPageHeader({ moduleName, pageName }) {
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
					children: pageName
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "px-1",
			children: /* @__PURE__ */ jsx(UpdatePageName, {
				pageName,
				moduleName
			})
		})]
	});
}
//#endregion
//#region src/app/course/[courseName]/modules/[moduleName]/page/[pageName]/EditPage.tsx
function EditPage({ moduleName, pageName }) {
	const { courseName } = useCourseContext();
	const { data: page, dataUpdatedAt, isFetching } = usePageQuery(moduleName, pageName);
	const updatePage = useUpdatePageMutation();
	const { clientIsAuthoritative, text, textUpdate, monacoKey } = useAuthoritativeUpdates({
		serverUpdatedAt: dataUpdatedAt,
		startingText: localPageMarkdownUtils.toMarkdown(page)
	});
	const [error, setError] = useState("");
	const { data: settings } = useLocalCourseSettingsQuery();
	useEffect(() => {
		const handler = setTimeout(() => {
			if (isFetching || updatePage.isPending) {
				console.log("network requests in progress, not updating page");
				return;
			}
			try {
				const updatedPage = localPageMarkdownUtils.parseMarkdown(text, pageName);
				if (localPageMarkdownUtils.toMarkdown(page) !== localPageMarkdownUtils.toMarkdown(updatedPage)) if (clientIsAuthoritative) {
					console.log("updating page");
					updatePage.mutateAsync({
						page: updatedPage,
						moduleName,
						pageName,
						previousModuleName: moduleName,
						previousPageName: pageName,
						courseName
					});
				} else {
					console.log("client not authoritative, updating client with server page");
					textUpdate(localPageMarkdownUtils.toMarkdown(page), true);
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
		clientIsAuthoritative,
		courseName,
		isFetching,
		moduleName,
		page,
		pageName,
		text,
		textUpdate,
		updatePage
	]);
	return /* @__PURE__ */ jsx(EditLayout, {
		Header: /* @__PURE__ */ jsx(EditPageHeader, {
			pageName,
			moduleName
		}),
		Body: /* @__PURE__ */ jsxs("div", {
			className: "flex min-h-0 flex-1 gap-4 overflow-hidden",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex-1 h-full min-w-0 overflow-hidden",
				children: /* @__PURE__ */ jsx(MonacoEditor, {
					value: text,
					onChange: textUpdate
				}, monacoKey)
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 h-full min-w-0 flex flex-col overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-red-300",
					children: error && error
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex-1 overflow-y-auto",
					children: [/* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx(PagePreview, { page })]
				})]
			})]
		}),
		Footer: /* @__PURE__ */ jsx(Fragment$1, { children: settings.canvasId && /* @__PURE__ */ jsx(ClientOnly, { children: /* @__PURE__ */ jsx(EditPageButtons, {
			pageName,
			moduleName
		}) }) })
	});
}
//#endregion
//#region src/routes/course.$courseName.modules.$moduleName.page.$pageName.tsx?tsr-split=component
function PageEditorPage() {
	const { moduleName, pageName } = Route.useParams();
	return /* @__PURE__ */ jsx(EditPage, {
		pageName: decodeURIComponent(pageName),
		moduleName: decodeURIComponent(moduleName)
	});
}
//#endregion
export { PageEditorPage as component };
