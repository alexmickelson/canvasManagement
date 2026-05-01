//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ((h) => ({
	routes: {
		__root__: {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/__root.tsx",
			children: [
				"/",
				"/course/$courseName",
				"/api/canvas/$",
				"/api/trpc/$"
			],
			assets: [{
				tag: "link",
				attrs: {
					rel: "stylesheet",
					href: "/assets/index-B8A9zlwq.css",
					type: "text/css"
				}
			}],
			preloads: ["/assets/index-DRVTVEFd.js", "/assets/jsx-runtime-dBoqvwbd.js"]
		},
		"/": {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/index.tsx",
			children: void 0,
			assets: [],
			preloads: [
				"/assets/routes-DxDhE9xp.js",
				"/assets/canvasWebRequestUtils-DXZ-FDOZ.js",
				"/assets/zod-IH1ygGIO.js",
				"/assets/CourseContextProvider-DpoGH5uv.js",
				"/assets/courseContext-DGV-E-HY.js",
				"/assets/lectureUtils-Czm2uE9F.js",
				"/assets/ClientOnly-D1zmjm45.js",
				"/assets/DayOfWeekInput-xrYsok17.js",
				"/assets/canvasCourseHooks-CXrtTtcg.js",
				"/assets/assignmentSubmissionType-DBpY39dZ.js",
				"/assets/localCoursesHooks-DI6irJUH.js",
				"/assets/lectureHooks-Cl1YoMq6.js"
			]
		},
		"/course/$courseName": {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/course.$courseName.tsx",
			children: [
				"/course/$courseName/settings",
				"/course/$courseName/",
				"/course/$courseName/lecture/$lectureDay/preview",
				"/course/$courseName/lecture/$lectureDay/",
				"/course/$courseName/modules/$moduleName/assignment/$assignmentName",
				"/course/$courseName/modules/$moduleName/page/$pageName",
				"/course/$courseName/modules/$moduleName/quiz/$quizName"
			],
			assets: [],
			preloads: ["/assets/course._courseName-Cz3mN7xu.js", "/assets/CourseContextProvider-DpoGH5uv.js"]
		},
		"/course/$courseName/settings": {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/course.$courseName.settings.tsx",
			children: void 0,
			assets: [],
			preloads: [
				"/assets/course._courseName.settings-GPZwwoep.js",
				"/assets/canvasWebRequestUtils-DXZ-FDOZ.js",
				"/assets/zod-IH1ygGIO.js",
				"/assets/courseContext-DGV-E-HY.js",
				"/assets/DayOfWeekInput-xrYsok17.js",
				"/assets/canvasCourseHooks-CXrtTtcg.js",
				"/assets/assignmentSubmissionType-DBpY39dZ.js",
				"/assets/localCoursesHooks-DI6irJUH.js"
			]
		},
		"/course/$courseName/": {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/course.$courseName.index.tsx",
			children: void 0,
			assets: [],
			preloads: [
				"/assets/course._courseName.index-ub3RtcHG.js",
				"/assets/BreadCrumbs-Cg_loSdV.js",
				"/assets/canvasWebRequestUtils-DXZ-FDOZ.js",
				"/assets/zod-IH1ygGIO.js",
				"/assets/calendarMonthUtils-DIi581AZ.js",
				"/assets/courseContext-DGV-E-HY.js",
				"/assets/lectureUtils-Czm2uE9F.js",
				"/assets/ClientOnly-D1zmjm45.js",
				"/assets/canvasCourseHooks-CXrtTtcg.js",
				"/assets/CheckIcon-k_IuhJGx.js",
				"/assets/canvasAssignmentHooks-BN_sxrOD.js",
				"/assets/canvasModuleHooks-BfyvdhoP.js",
				"/assets/canvasPageHooks-D-PpTxGe.js",
				"/assets/localCourseSettings-CmZZoGWp.js",
				"/assets/localCoursesHooks-DI6irJUH.js",
				"/assets/lectureHooks-Cl1YoMq6.js",
				"/assets/localCourseModuleHooks-C7rTDOpL.js"
			]
		},
		"/course/$courseName/lecture/$lectureDay/preview": {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/course.$courseName.lecture.$lectureDay.preview.tsx",
			children: void 0,
			assets: [],
			preloads: [
				"/assets/course._courseName.lecture._lectureDay.preview-DTwruJO-.js",
				"/assets/BreadCrumbs-Cg_loSdV.js",
				"/assets/LecturePreview-BscjJ_L4.js",
				"/assets/localCoursesHooks-DI6irJUH.js",
				"/assets/lectureHooks-Cl1YoMq6.js"
			]
		},
		"/course/$courseName/lecture/$lectureDay/": {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/course.$courseName.lecture.$lectureDay.index.tsx",
			children: void 0,
			assets: [h = {
				tag: "link",
				attrs: {
					rel: "stylesheet",
					href: "/assets/EditLayout-kYm5Aujk.css",
					type: "text/css"
				}
			}],
			preloads: [
				"/assets/course._courseName.lecture._lectureDay.index-B1-awNlT.js",
				"/assets/BreadCrumbs-Cg_loSdV.js",
				"/assets/zod-IH1ygGIO.js",
				"/assets/calendarMonthUtils-DIi581AZ.js",
				"/assets/EditLayout-gwLM8f_o.js",
				"/assets/courseContext-DGV-E-HY.js",
				"/assets/LecturePreview-BscjJ_L4.js",
				"/assets/localCourseSettings-CmZZoGWp.js",
				"/assets/localCoursesHooks-DI6irJUH.js",
				"/assets/lectureHooks-Cl1YoMq6.js"
			]
		},
		"/course/$courseName/modules/$moduleName/assignment/$assignmentName": {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/course.$courseName.modules.$moduleName.assignment.$assignmentName.tsx",
			children: void 0,
			assets: [h],
			preloads: [
				"/assets/course._courseName.modules._moduleName.assignment._assignmentName-DDgX-i9w.js",
				"/assets/BreadCrumbs-Cg_loSdV.js",
				"/assets/canvasWebRequestUtils-DXZ-FDOZ.js",
				"/assets/zod-IH1ygGIO.js",
				"/assets/EditLayout-gwLM8f_o.js",
				"/assets/courseContext-DGV-E-HY.js",
				"/assets/ClientOnly-D1zmjm45.js",
				"/assets/canvasAssignmentHooks-BN_sxrOD.js",
				"/assets/canvasAssignmentService-D5TSBW1F.js",
				"/assets/assignmentSubmissionType-DBpY39dZ.js",
				"/assets/localCoursesHooks-DI6irJUH.js"
			]
		},
		"/course/$courseName/modules/$moduleName/page/$pageName": {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/course.$courseName.modules.$moduleName.page.$pageName.tsx",
			children: void 0,
			assets: [h],
			preloads: [
				"/assets/course._courseName.modules._moduleName.page._pageName-B6avTHwb.js",
				"/assets/BreadCrumbs-Cg_loSdV.js",
				"/assets/canvasWebRequestUtils-DXZ-FDOZ.js",
				"/assets/zod-IH1ygGIO.js",
				"/assets/EditLayout-gwLM8f_o.js",
				"/assets/courseContext-DGV-E-HY.js",
				"/assets/ClientOnly-D1zmjm45.js",
				"/assets/canvasPageHooks-D-PpTxGe.js",
				"/assets/localCoursesHooks-DI6irJUH.js"
			]
		},
		"/course/$courseName/modules/$moduleName/quiz/$quizName": {
			filePath: "/home/alexm/projects/canvasManagement/src/routes/course.$courseName.modules.$moduleName.quiz.$quizName.tsx",
			children: void 0,
			assets: [h],
			preloads: [
				"/assets/course._courseName.modules._moduleName.quiz._quizName-C2Cwu3TE.js",
				"/assets/BreadCrumbs-Cg_loSdV.js",
				"/assets/canvasWebRequestUtils-DXZ-FDOZ.js",
				"/assets/browser-DElgfvq-.js",
				"/assets/zod-IH1ygGIO.js",
				"/assets/EditLayout-gwLM8f_o.js",
				"/assets/courseContext-DGV-E-HY.js",
				"/assets/ClientOnly-D1zmjm45.js",
				"/assets/CheckIcon-k_IuhJGx.js",
				"/assets/localCoursesHooks-DI6irJUH.js"
			]
		}
	},
	clientEntry: "/assets/index-DRVTVEFd.js"
}))();
//#endregion
export { tsrStartManifest };
