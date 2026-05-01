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
import superjson from "superjson";
import { MyToaster } from "@/app/MyToaster";
import { ClientCacheInvalidation } from "@/components/realtime/ClientCacheInvalidation";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import TrpcProvider from "@/services/serverFunctions/TrpcProvider";
import { getQueryClient } from "@/app/providersQueryClientUtils";
import appCss from "@/app/globals.css?url";

const fetchInitialData = createServerFn({ method: "GET" }).handler(async () => {
  const { trpcAppRouter } =
    await import("@/services/serverFunctions/appRouter");
  const { createTrpcContext } =
    await import("@/services/serverFunctions/context");
  const { fileStorageService } =
    await import("@/features/local/utils/fileStorageService");

  const trpcHelper = createServerSideHelpers({
    router: trpcAppRouter,
    ctx: createTrpcContext(),
    transformer: superjson,
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
      const moduleNames = await trpcHelper.module.getModuleNames.fetch({
        courseName,
      });
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
      trpcHelper.lectures.getLectures.fetch({ courseName: settings.name }),
    ),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return dehydrate(trpcHelper.queryClient) as any;
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Canvas Manager 2.0" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  loader: async () => {
    return { dehydratedState: await fetchInitialData() };
  },
  component: RootComponent,
});

function RootComponent() {
  const { dehydratedState } = Route.useLoaderData();
  const queryClient = getQueryClient();

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
