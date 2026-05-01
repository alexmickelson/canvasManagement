import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "../server.js";
import { a as useTRPC, i as trpc, r as TRPCProvider, t as SuspenseAndErrorHandling } from "./SuspenseAndErrorHandling-DsJy7QvV.js";
import { t as useGlobalSettingsQuery } from "./globalSettingsHooks-DrZfa4te.js";
import { t as Route$6 } from "./course._courseName-ClWNfaik.js";
import { n as createTrpcContext } from "./context-K0gxhuFE.js";
import { n as trpcAppRouter } from "./appRouter-PFRZZBZu.js";
import { o as axiosClient } from "./canvasWebRequestUtils-BTUhiXsN.js";
import { t as Route$7 } from "./course._courseName.lecture._lectureDay.index-ugPB0MJv.js";
import { t as Route$8 } from "./course._courseName.lecture._lectureDay.preview-BjUR-Pc2.js";
import { t as Route$9 } from "./course._courseName.modules._moduleName.quiz._quizName-CkXIsc63.js";
import { t as Route$10 } from "./course._courseName.modules._moduleName.page._pageName-DvxeFv2w.js";
import { t as Route$11 } from "./course._courseName.modules._moduleName.assignment._assignmentName-CrZk9wec.js";
import { useCallback, useEffect, useState } from "react";
import { HeadContent, Outlet, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent } from "@tanstack/react-router";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import { HydrationBoundary, QueryClient, QueryClientProvider, isServer, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import superjson from "superjson";
import { httpBatchLink } from "@trpc/client";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { isAxiosError } from "axios";
//#region node_modules/.pnpm/@tanstack+start-server-core@1.167.26/node_modules/@tanstack/start-server-core/dist/esm/createSsrRpc.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/app/MyToaster.tsx
var MyToaster = () => {
	return /* @__PURE__ */ jsx(Toaster, {
		position: "top-center",
		reverseOrder: false,
		containerClassName: " flex flex-row w-full ",
		containerStyle: {},
		toastOptions: {
			className: "border-4 border-rose-900 drop-shadow-2xl grow",
			duration: 5e3,
			style: {
				background: "#030712",
				color: "#e5e7eb",
				paddingLeft: "2em",
				paddingRight: "2em",
				width: "100%"
			},
			success: { duration: 3e3 }
		}
	});
};
//#endregion
//#region src/components/realtime/ClientCacheInvalidation.tsx
var socket = io("/");
function removeFileExtension(fileName) {
	const lastDotIndex = fileName.lastIndexOf(".");
	if (lastDotIndex > 0) return fileName.substring(0, lastDotIndex);
	return fileName;
}
function getCourseNameByPath(filePath, settings) {
	return settings.courses.find((c) => {
		const normalizedFilePath = filePath.startsWith("./") ? filePath.substring(2) : filePath;
		const normalizedCoursePath = c.path.startsWith("./") ? c.path.substring(2) : c.path;
		return normalizedFilePath.startsWith(normalizedCoursePath);
	})?.name;
}
function ClientCacheInvalidation() {
	const invalidateCache = useFilePathInvalidation();
	const [connectionAttempted, setConnectionAttempted] = useState(false);
	useEffect(() => {
		if (!connectionAttempted) {
			socket.connect();
			setConnectionAttempted(true);
		}
		socket.on("connect", () => {
			console.log("Socket connected successfully.");
		});
		socket.on("message", (data) => {
			console.log("Received message:", data);
		});
		socket.on("fileChanged", invalidateCache);
		socket.on("connect_error", (error) => {
			console.error("Connection error:", error);
			console.error("File system real time updates disabled");
			socket.disconnect();
		});
		return () => {
			socket.off("message");
			socket.off("fileChanged");
			socket.off("connect_error");
		};
	}, [connectionAttempted, invalidateCache]);
	return /* @__PURE__ */ jsx(Fragment$1, {});
}
var useFilePathInvalidation = () => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const { data: settings } = useGlobalSettingsQuery();
	return useCallback((filePath) => {
		const courseName = getCourseNameByPath(filePath, settings);
		if (!courseName) {
			console.log("no course settings found for file path, not invalidating cache", filePath);
			return;
		}
		const [moduleOrLectures, itemType, itemFile] = filePath.split("/").slice(-3);
		const itemName = itemFile ? removeFileExtension(itemFile) : void 0;
		const allParts = {
			courseName,
			moduleOrLectures,
			itemType,
			itemName
		};
		if (moduleOrLectures === "settings.yml") {
			queryClient.invalidateQueries({ queryKey: trpc.settings.allCoursesSettings.queryKey() });
			queryClient.invalidateQueries({ queryKey: trpc.settings.courseSettings.queryKey({ courseName }) });
			return;
		}
		if (moduleOrLectures === "00 - lectures") {
			console.log("lecture updated on FS ", allParts);
			queryClient.invalidateQueries({ queryKey: trpc.lectures.getLectures.queryKey({ courseName }) });
			return;
		}
		if (itemType === "assignments") {
			console.log("assignment updated on FS ", allParts);
			queryClient.invalidateQueries({ queryKey: trpc.assignment.getAllAssignments.queryKey({
				courseName,
				moduleName: moduleOrLectures
			}) });
			queryClient.invalidateQueries({ queryKey: trpc.assignment.getAssignment.queryKey({
				courseName,
				moduleName: moduleOrLectures,
				assignmentName: itemName
			}) });
			return;
		}
		if (itemType === "quizzes") {
			console.log("quiz updated on FS ", allParts);
			queryClient.invalidateQueries({ queryKey: trpc.quiz.getAllQuizzes.queryKey({
				courseName,
				moduleName: moduleOrLectures
			}) });
			queryClient.invalidateQueries({ queryKey: trpc.quiz.getQuiz.queryKey({
				courseName,
				moduleName: moduleOrLectures,
				quizName: itemName
			}) });
			return;
		}
		if (itemType === "pages") {
			console.log("page updated on FS ", allParts);
			queryClient.invalidateQueries({ queryKey: trpc.page.getAllPages.queryKey({
				courseName,
				moduleName: moduleOrLectures
			}) });
			queryClient.invalidateQueries({ queryKey: trpc.page.getPage.queryKey({
				courseName,
				moduleName: moduleOrLectures,
				pageName: itemName
			}) });
			return;
		}
		console.log("no cache invalidation match for file ", allParts);
	}, [
		queryClient,
		trpc.assignment.getAllAssignments,
		trpc.assignment.getAssignment,
		trpc.lectures.getLectures,
		trpc.page.getAllPages,
		trpc.page.getPage,
		trpc.quiz.getAllQuizzes,
		trpc.quiz.getQuiz,
		trpc.settings.allCoursesSettings,
		trpc.settings.courseSettings,
		settings
	]);
};
//#endregion
//#region src/app/providersQueryClientUtils.ts
function makeQueryClient() {
	return new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1e3 } } });
}
var browserQueryClient = void 0;
function getQueryClient() {
	if (isServer) return makeQueryClient();
	else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
}
//#endregion
//#region src/services/serverFunctions/TrpcProvider.tsx
function TrpcProvider({ children }) {
	const url = isServer ? "http://localhost:3000/api/trpc/" : "/api/trpc";
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() => trpc.createClient({ links: [httpBatchLink({
		url,
		transformer: superjson,
		maxURLLength: 1e4
	})] }));
	return /* @__PURE__ */ jsx(TRPCProvider, {
		trpcClient,
		queryClient,
		children
	});
}
//#endregion
//#region src/app/globals.css?url
var globals_default = "/assets/globals-CU85okKO.css";
//#endregion
//#region src/routes/__root.tsx
var fetchInitialData = createServerFn({ method: "GET" }).handler(createSsrRpc("0109e4a2908c2b868dfc9421849ada4eea9eede06a975351f38bb916d6b8e25f"));
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Canvas Manager 2.0" }
		],
		links: [{
			rel: "stylesheet",
			href: globals_default
		}]
	}),
	loader: async () => {
		return { dehydratedState: await fetchInitialData() };
	},
	component: RootComponent
});
function RootComponent() {
	const { dehydratedState } = Route$5.useLoaderData();
	const queryClient = getQueryClient();
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", {
			className: "flex justify-center h-screen",
			suppressHydrationWarning: true,
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-gray-950 h-screen text-slate-300 w-screen sm:p-1",
				children: [/* @__PURE__ */ jsx(MyToaster, {}), /* @__PURE__ */ jsx(SuspenseAndErrorHandling, { children: /* @__PURE__ */ jsx(QueryClientProvider, {
					client: queryClient,
					children: /* @__PURE__ */ jsx(TrpcProvider, { children: /* @__PURE__ */ jsxs(HydrationBoundary, {
						state: dehydratedState,
						children: [/* @__PURE__ */ jsx(ClientCacheInvalidation, {}), /* @__PURE__ */ jsx(Outlet, {})]
					}) })
				}) })]
			}), /* @__PURE__ */ jsx(Scripts, {})]
		})]
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$2 = () => import("./routes-BoUjVVO7.js");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/course.$courseName.index.tsx
var $$splitComponentImporter$1 = () => import("./course._courseName.index-1ZndnLj1.js");
var Route$3 = createFileRoute("/course/$courseName/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/course.$courseName.settings.tsx
var $$splitComponentImporter = () => import("./course._courseName.settings-KEeN-8iJ.js");
var Route$2 = createFileRoute("/course/$courseName/settings")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routes/api.trpc.$.tsx
var handler = async (request) => {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: request,
		router: trpcAppRouter,
		createContext: createTrpcContext
	});
};
var Route$1 = createFileRoute("/api/trpc/$")({ server: { handlers: {
	GET: ({ request }) => handler(request),
	POST: ({ request }) => handler(request)
} } });
//#endregion
//#region src/routes/api.canvas.$.tsx
var appendQueryParams = (url, req) => {
	new URL(req.url).searchParams.forEach((value, key) => {
		url.searchParams.set(key, value);
	});
};
var getUrl = (splat, req) => {
	const newUrl = `https://snow.instructure.com/api/v1/${splat ?? ""}`;
	const url = new URL(newUrl);
	appendQueryParams(url, req);
	return url;
};
var proxyResponseHeaders = (response) => {
	const headers = new Headers();
	Object.entries(response.headers).forEach(([key, value]) => {
		if (["link", "x-rate-limit-remaining"].includes(key)) headers.set(key, value);
	});
	return headers;
};
async function withErrorHandling(handler) {
	try {
		return await handler();
	} catch (error) {
		console.error("Canvas proxy error:", error);
		return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
	}
}
var Route = createFileRoute("/api/canvas/$")({ server: { handlers: {
	GET: async ({ request, params }) => {
		try {
			const url = getUrl(params._splat, request);
			const response = await axiosClient.get(url.toString());
			const headers = proxyResponseHeaders(response);
			return Response.json(response.data, { headers });
		} catch (error) {
			console.log("canvas get error", error, error?.message);
			return Response.json({ error: error.message || "Canvas GET request failed" }, { status: error.response?.status || 500 });
		}
	},
	POST: ({ request, params }) => withErrorHandling(async () => {
		const url = getUrl(params._splat, request);
		const body = await request.json();
		try {
			const response = await axiosClient.post(url.toString(), body);
			const headers = proxyResponseHeaders(response);
			return new Response(JSON.stringify(response.data), { headers });
		} catch (error) {
			if (isAxiosError(error)) {
				console.log(url.toString(), body);
				console.log("response data", JSON.stringify(error.response?.data));
			}
			return Response.json({ error: error.message || "Canvas POST request failed" }, { status: error.response?.status || 500 });
		}
	}),
	PUT: ({ request, params }) => withErrorHandling(async () => {
		const url = getUrl(params._splat, request);
		const body = await request.json();
		try {
			const response = await axiosClient.put(url.toString(), body);
			const headers = proxyResponseHeaders(response);
			return new Response(JSON.stringify(response.data), { headers });
		} catch (error) {
			if (isAxiosError(error)) {
				console.log(url.toString(), body);
				console.log("response data", JSON.stringify(error.response?.data));
				return Response.json({ error: error.response?.data ?? "Canvas PUT failed" }, { status: error.response?.status || 500 });
			}
			return Response.json({ error: error.message || "Canvas PUT request failed" }, { status: 500 });
		}
	}),
	DELETE: ({ request, params }) => withErrorHandling(async () => {
		try {
			const url = getUrl(params._splat, request);
			const response = await axiosClient.delete(url.toString());
			const headers = proxyResponseHeaders(response);
			return new Response(JSON.stringify(response.data), { headers });
		} catch (error) {
			return new Response(JSON.stringify({ error: error.message || "Canvas DELETE request failed" }), { status: error.response?.status || 500 });
		}
	})
} } });
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$5
});
var CourseCourseNameRoute = Route$6.update({
	id: "/course/$courseName",
	path: "/course/$courseName",
	getParentRoute: () => Route$5
});
var CourseCourseNameIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => CourseCourseNameRoute
});
var CourseCourseNameSettingsRoute = Route$2.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => CourseCourseNameRoute
});
var ApiTrpcSplatRoute = Route$1.update({
	id: "/api/trpc/$",
	path: "/api/trpc/$",
	getParentRoute: () => Route$5
});
var ApiCanvasSplatRoute = Route.update({
	id: "/api/canvas/$",
	path: "/api/canvas/$",
	getParentRoute: () => Route$5
});
var CourseCourseNameLectureLectureDayIndexRoute = Route$7.update({
	id: "/lecture/$lectureDay/",
	path: "/lecture/$lectureDay/",
	getParentRoute: () => CourseCourseNameRoute
});
var CourseCourseNameLectureLectureDayPreviewRoute = Route$8.update({
	id: "/lecture/$lectureDay/preview",
	path: "/lecture/$lectureDay/preview",
	getParentRoute: () => CourseCourseNameRoute
});
var CourseCourseNameModulesModuleNameQuizQuizNameRoute = Route$9.update({
	id: "/modules/$moduleName/quiz/$quizName",
	path: "/modules/$moduleName/quiz/$quizName",
	getParentRoute: () => CourseCourseNameRoute
});
var CourseCourseNameModulesModuleNamePagePageNameRoute = Route$10.update({
	id: "/modules/$moduleName/page/$pageName",
	path: "/modules/$moduleName/page/$pageName",
	getParentRoute: () => CourseCourseNameRoute
});
var CourseCourseNameRouteChildren = {
	CourseCourseNameSettingsRoute,
	CourseCourseNameIndexRoute,
	CourseCourseNameLectureLectureDayPreviewRoute,
	CourseCourseNameLectureLectureDayIndexRoute,
	CourseCourseNameModulesModuleNameAssignmentAssignmentNameRoute: Route$11.update({
		id: "/modules/$moduleName/assignment/$assignmentName",
		path: "/modules/$moduleName/assignment/$assignmentName",
		getParentRoute: () => CourseCourseNameRoute
	}),
	CourseCourseNameModulesModuleNamePagePageNameRoute,
	CourseCourseNameModulesModuleNameQuizQuizNameRoute
};
var rootRouteChildren = {
	IndexRoute,
	CourseCourseNameRoute: CourseCourseNameRoute._addFileChildren(CourseCourseNameRouteChildren),
	ApiCanvasSplatRoute,
	ApiTrpcSplatRoute
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
