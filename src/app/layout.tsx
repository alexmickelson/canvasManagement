import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MyToaster } from "./MyToaster";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { trpcAppRouter } from "@/services/serverFunctions/router/appRouter";
import { createTrpcContext } from "@/services/serverFunctions/context";
import superjson from "superjson";
import { fileStorageService } from "@/features/local/utils/fileStorageService";
import { ClientCacheInvalidation } from "../components/realtime/ClientCacheInvalidation";
import { getTitle } from "@/services/titleUtils";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: getTitle("Canvas Manager 2.0"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className="flex justify-center">
        <div className="bg-gray-950 h-screen text-slate-300 w-screen sm:p-1">
          <MyToaster />
          <Suspense>
            <Providers>
              <DataHydration>
                <ClientCacheInvalidation></ClientCacheInvalidation>
                {children}
              </DataHydration>
            </Providers>
          </Suspense>
        </div>
      </body>
    </html>
  );
}

async function DataHydration({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("starting hydration");
  const trpcHelper = createServerSideHelpers({
    router: trpcAppRouter,
    ctx: createTrpcContext(),
    transformer: superjson,
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: Infinity,
        },
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
        // assignments
        ...moduleNames.map(
          async (moduleName) =>
            await trpcHelper.assignment.getAllAssignments.prefetch({
              courseName,
              moduleName,
            })
        ),
        // quizzes
        ...moduleNames.map(
          async (moduleName) =>
            await trpcHelper.quiz.getAllQuizzes.prefetch({
              courseName,
              moduleName,
            })
        ),
        // pages
        ...moduleNames.map(
          async (moduleName) =>
            await trpcHelper.page.getAllPages.prefetch({
              courseName,
              moduleName,
            })
        ),
      ]);
    })
  );

  // lectures
  await Promise.all(
    allSettings.map(
      async (settings) =>
        await trpcHelper.lectures.getLectures.fetch({
          courseName: settings.name,
        })
    )
  );

  const dehydratedState = dehydrate(trpcHelper.queryClient);
  console.log("ran hydration");

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
