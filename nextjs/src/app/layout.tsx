import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";
import { hydrateCourses } from "@/hooks/hookHydration";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MyToaster } from "./MyToaster";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { trpcAppRouter } from "@/services/trpc/router/app";
import { createTrpcContext } from "@/services/trpc/context";
import superjson from "superjson";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Canvas Manager 2.0",
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
        <div className="bg-slate-900 h-screen text-slate-300 w-full sm:p-1">
          <MyToaster />
          <Suspense>
            <Providers>
              <DataHydration>{children}</DataHydration>
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
  // const allSettings = await fileStorageService.settings.getAllCoursesSettings();
  // await Promise.all(
  //   allSettings.map(async (settings) => {
  //     const courseName = settings.name;
  //     const moduleNames = await fileStorageService.modules.getModuleNames(
  //       courseName
  //     );
  //     await Promise.all(
  //       moduleNames.map(
  //         async (moduleName) =>
  //           await trpcHelper.assignment.getAllAssignments.fetch({
  //             courseName,
  //             moduleName,
  //           })
  //       )
  //     );
  //   })
  // );

  // await Promise.all(
  //   allSettings.map(
  //     async (settings) =>
  //       await trpcHelper.lectures.getLectures.fetch({
  //         courseName: settings.name,
  //       })
  //   )
  // );

  // await hydrateCourses(trpcHelper.queryClient);

  const dehydratedState = dehydrate(trpcHelper.queryClient);
  console.log("ran hydration");

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
