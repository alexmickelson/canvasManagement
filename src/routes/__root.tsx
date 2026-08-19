/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  dehydrate,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { MyToaster } from "@/app/MyToaster";
import { ClientCacheInvalidation } from "@/components/realtime/ClientCacheInvalidation";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import TrpcProvider from "@/services/serverFunctions/TrpcProvider";
import { getQueryClient } from "@/app/providersQueryClientUtils";
import appCss from "@/app/globals.css?url";

type InitialData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dehydratedState?: any;
  // error messages thrown while loading settings (e.g. a duplicate course
  // name in globalSettings.yml) are stripped from server errors before they
  // reach the browser, so catch them here and return them as data instead
  startupError?: string;
};

const fetchInitialData = createServerFn({ method: "GET" }).handler(
  async (): Promise<InitialData> => {
    try {
      return { dehydratedState: await prefetchAllCourseData() };
    } catch (e) {
      console.error("Canvas Manager failed to load initial data:", e);
      return { startupError: e instanceof Error ? e.message : String(e) };
    }
  },
);

const prefetchAllCourseData = async () => {
  const { trpcAppRouter } =
    await import("@/services/serverFunctions/appRouter");
  const { createTrpcContext } =
    await import("@/services/serverFunctions/context");
  const { fileStorageService } =
    await import("@/features/local/utils/fileStorageService");

  const trpcHelper = createServerSideHelpers({
    router: trpcAppRouter,
    ctx: createTrpcContext(),
    queryClientConfig: {
      defaultOptions: {
        queries: { staleTime: Infinity },
      },
    },
  });

  const allSettings = await fileStorageService.settings.getAllCoursesSettings();

  await Promise.all(
    allSettings.map(async (settings) => {
      const courseName = settings.name;
      const moduleNames =
        await trpcHelper.module.getModuleNames.fetch(courseName);
      await Promise.all([
        ...moduleNames.map((moduleName) =>
          trpcHelper.assignment.getAllAssignments.prefetch({
            courseName,
            moduleName,
          }),
        ),
        ...moduleNames.map((moduleName) =>
          trpcHelper.quiz.getAllQuizzes.prefetch({ courseName, moduleName }),
        ),
        ...moduleNames.map((moduleName) =>
          trpcHelper.page.getAllPages.prefetch({ courseName, moduleName }),
        ),
      ]);
    }),
  );

  await Promise.all(
    allSettings.map((settings) =>
      trpcHelper.lectures.getLectures.fetch(settings.name),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return dehydrate(trpcHelper.queryClient) as any;
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Canvas Manager 2.0" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  loader: async (): Promise<InitialData> => {
    return await fetchInitialData();
  },
  component: RootComponent,
  errorComponent: ({ error }) => (
    <ErrorShell
      title="Something went wrong"
      message={error.message || String(error)}
    />
  ),
});

function ErrorShell({ title, message }: { title: string; message: string }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex justify-center min-h-screen" suppressHydrationWarning>
        <div className="bg-gray-950 min-h-screen text-slate-300 w-screen p-6 sm:p-10">
          <h1 className="text-2xl font-bold text-rose-400 mb-4">{title}</h1>
          <pre className="whitespace-pre-wrap bg-gray-900 border border-rose-900 rounded-md p-4 mb-4 text-sm">
            {message || "No error message was provided. Check the server logs."}
          </pre>
          <p className="mb-4 text-slate-400">
            This error also appears in the server logs. After fixing the
            problem, reload the page.
          </p>
          <button
            className="bg-slate-800 hover:bg-slate-700 rounded-md px-4 py-2"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { dehydratedState, startupError } = Route.useLoaderData();
  const queryClient = getQueryClient();

  if (startupError !== undefined) {
    return (
      <ErrorShell
        title="Canvas Manager could not start"
        message={startupError}
      />
    );
  }

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex justify-center h-screen" suppressHydrationWarning>
        <div className="bg-gray-950 h-screen text-slate-300 w-screen sm:p-1">
          <MyToaster />
          <SuspenseAndErrorHandling>
            <QueryClientProvider client={queryClient}>
              <TrpcProvider>
                <HydrationBoundary state={dehydratedState}>
                  <ClientCacheInvalidation />
                  <Outlet />
                </HydrationBoundary>
              </TrpcProvider>
            </QueryClientProvider>
          </SuspenseAndErrorHandling>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
