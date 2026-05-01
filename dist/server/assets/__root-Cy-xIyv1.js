import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "../server.js";
import { dehydrate } from "@tanstack/react-query";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
//#region node_modules/.pnpm/@tanstack+start-server-core@1.167.26/node_modules/@tanstack/start-server-core/dist/esm/createServerRpc.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/routes/__root.tsx?tss-serverfn-split
var fetchInitialData_createServerFn_handler = createServerRpc({
	id: "0109e4a2908c2b868dfc9421849ada4eea9eede06a975351f38bb916d6b8e25f",
	name: "fetchInitialData",
	filename: "src/routes/__root.tsx"
}, (opts) => fetchInitialData.__executeServer(opts));
var fetchInitialData = createServerFn({ method: "GET" }).handler(fetchInitialData_createServerFn_handler, async () => {
	const { trpcAppRouter } = await import("./appRouter-PFRZZBZu.js").then((n) => n.t);
	const { createTrpcContext } = await import("./context-K0gxhuFE.js").then((n) => n.t);
	const { fileStorageService } = await import("./fileStorageService-CXiRrqQ4.js").then((n) => n.n);
	const trpcHelper = createServerSideHelpers({
		router: trpcAppRouter,
		ctx: createTrpcContext(),
		transformer: superjson,
		queryClientConfig: { defaultOptions: { queries: { staleTime: Infinity } } }
	});
	const allSettings = await fileStorageService.settings.getAllCoursesSettings();
	await Promise.all(allSettings.map(async (settings) => {
		const courseName = settings.name;
		const moduleNames = await trpcHelper.module.getModuleNames.fetch({ courseName });
		await Promise.all([
			...moduleNames.map((moduleName) => trpcHelper.assignment.getAllAssignments.prefetch({
				courseName,
				moduleName
			})),
			...moduleNames.map((moduleName) => trpcHelper.quiz.getAllQuizzes.prefetch({
				courseName,
				moduleName
			})),
			...moduleNames.map((moduleName) => trpcHelper.page.getAllPages.prefetch({
				courseName,
				moduleName
			}))
		]);
	}));
	await Promise.all(allSettings.map((settings) => trpcHelper.lectures.getLectures.fetch({ courseName: settings.name })));
	return dehydrate(trpcHelper.queryClient);
});
//#endregion
export { fetchInitialData_createServerFn_handler };
