import { n as getDayOfWeek } from "./localCourseSettings-ROLFk4Xg.js";
import { n as Spinner } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { a as getDateOnlyMarkdownString, n as getDateFromString, r as getDateFromStringOrThrow } from "./timeUtils-DjiIXWRA.js";
import { i as parseLecture, r as lectureToString, t as getLectureWeekName } from "./lectureUtils-Bv-HaWlG.js";
import { t as Route } from "./course._courseName.lecture._lectureDay.index-ugPB0MJv.js";
import { n as useCourseContext } from "./courseContext-BTpBK1uA.js";
import { n as useLocalCourseSettingsQuery } from "./localCoursesHooks-CLeCOGR6.js";
import { a as getLecturePreviewUrl, i as getCourseUrl, n as useModal, t as Modal } from "./Modal-C3Ziyb81.js";
import { t as BreadCrumbs } from "./BreadCrumbs-xctKec6Z.js";
import { n as useLectureUpdateMutation, r as useLecturesSuspenseQuery, t as useDeleteLectureMutation } from "./lectureHooks-SnCvPM2E.js";
import { a as MonacoEditor, i as useItemNavigation, n as useAuthoritativeUpdates, r as ItemNavigationButtons, t as EditLayout } from "./EditLayout-D_Zso86D.js";
import { t as LecturePreview } from "./LecturePreview-BZ_0CmeK.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/app/course/[courseName]/lecture/[lectureDay]/EditLectureTitle.tsx
function EditLectureTitle({ lectureDay }) {
	const { data: settings } = useLocalCourseSettingsQuery();
	const { courseName } = useCourseContext();
	const lectureDate = getDateFromString(lectureDay);
	const lectureWeekName = getLectureWeekName(settings.startDate, lectureDay);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex justify-between sm:flex-row flex-col",
		children: [
			/* @__PURE__ */ jsx(BreadCrumbs, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-center  ",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "mt-auto me-3 text-slate-500 ",
					children: "Lecture"
				}), /* @__PURE__ */ jsxs("h1", {
					className: "",
					children: [
						lectureDate && getDayOfWeek(lectureDate),
						" ",
						lectureWeekName.toUpperCase()
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-end my-auto flex",
				children: /* @__PURE__ */ jsx(Link, {
					className: "btn inline text-center flex-grow m-1",
					to: getLecturePreviewUrl(courseName, lectureDay),
					children: "preview"
				})
			})
		]
	});
}
//#endregion
//#region src/app/course/[courseName]/lecture/[lectureDay]/LectureButtons.tsx
function LectureButtons({ lectureDay }) {
	const { courseName } = useCourseContext();
	const { data: settings } = useLocalCourseSettingsQuery();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const modal = useModal();
	const deleteLecture = useDeleteLectureMutation();
	const { previousUrl, nextUrl } = useItemNavigation("lecture", lectureDay);
	return /* @__PURE__ */ jsxs("div", {
		className: "p-5 flex flex-row justify-end gap-3",
		children: [
			/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Modal, {
				modalControl: modal,
				buttonText: "Delete Lecture",
				buttonClass: "btn-danger",
				modalWidth: "w-1/5",
				children: ({ closeModal }) => /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-center",
						children: "Are you sure you want to delete this lecture?"
					}),
					/* @__PURE__ */ jsx("br", {}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-around gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: async () => {
								setIsLoading(true);
								navigate({ to: getCourseUrl(courseName) });
								await deleteLecture.mutateAsync({
									courseName,
									settings,
									lectureDay
								});
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
			}) }),
			/* @__PURE__ */ jsx(Link, {
				className: "btn",
				to: getCourseUrl(courseName),
				children: "Go Back"
			}),
			/* @__PURE__ */ jsx(ItemNavigationButtons, {
				previousUrl,
				nextUrl
			}),
			isLoading && /* @__PURE__ */ jsx(Spinner, {})
		]
	});
}
//#endregion
//#region src/app/course/[courseName]/lecture/[lectureDay]/EditLecture.tsx
function EditLecture({ lectureDay }) {
	const { courseName } = useCourseContext();
	const { data: settings } = useLocalCourseSettingsQuery();
	const { data: weeks, dataUpdatedAt: serverDataUpdatedAt, isFetching } = useLecturesSuspenseQuery();
	const updateLecture = useLectureUpdateMutation();
	const lecture = weeks.flatMap(({ lectures }) => lectures.map((lecture) => lecture)).find((l) => l.date === lectureDay);
	const { clientIsAuthoritative, text, textUpdate, monacoKey } = useAuthoritativeUpdates({
		serverUpdatedAt: serverDataUpdatedAt,
		startingText: getLectureTextOrDefault(lecture, lectureDay)
	});
	const [error, setError] = useState("");
	useEffect(() => {
		const handler = setTimeout(() => {
			try {
				if (isFetching || updateLecture.isPending) {
					console.log("network requests in progress, not updating page");
					return;
				}
				const parsed = parseLecture(text);
				if (!lecture || lectureToString(parsed) !== lectureToString(lecture)) if (clientIsAuthoritative) {
					console.log("updating lecture");
					updateLecture.mutate({
						lecture: parsed,
						settings,
						courseName
					});
				} else if (lecture) {
					console.log("client not authoritative, updating client with server lecture");
					textUpdate(lectureToString(lecture), true);
				} else console.log("client not authoritative, but no lecture on server, this is a bug");
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
		lecture,
		settings,
		text,
		textUpdate,
		updateLecture
	]);
	return /* @__PURE__ */ jsx(EditLayout, {
		Header: /* @__PURE__ */ jsx(EditLectureTitle, { lectureDay }),
		Body: /* @__PURE__ */ jsxs("div", {
			className: "sm:columns-2 min-h-0 flex-1",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex-1 h-full",
				children: /* @__PURE__ */ jsx(MonacoEditor, {
					value: text,
					onChange: textUpdate
				}, monacoKey)
			}), /* @__PURE__ */ jsxs("div", {
				className: "h-full sm:block none overflow-auto",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-red-300",
					children: error && error
				}), lecture && /* @__PURE__ */ jsx(LecturePreview, { lecture })]
			})]
		}),
		Footer: /* @__PURE__ */ jsx(LectureButtons, { lectureDay })
	});
}
function getLectureTextOrDefault(lecture, lectureDay) {
	return lecture ? lectureToString(lecture) : `Name: 
Date: ${lectureDay}
---
`;
}
//#endregion
//#region src/routes/course.$courseName.lecture.$lectureDay.index.tsx?tsr-split=component
function LecturePage() {
	const { lectureDay } = Route.useParams();
	return /* @__PURE__ */ jsx(EditLecture, { lectureDay: getDateOnlyMarkdownString(getDateFromStringOrThrow(decodeURIComponent(lectureDay), "lecture day in lecture page")) });
}
//#endregion
export { LecturePage as component };
