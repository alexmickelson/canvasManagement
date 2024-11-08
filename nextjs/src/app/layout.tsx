import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";
import { getQueryClient } from "./providersQueryClientUtils";
import { hydrateCourses } from "@/hooks/hookHydration";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MyToaster } from "./MyToaster";
import { cookies } from "next/headers";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { trpcAppRouter } from "@/services/trpc/router/app";
import { createTrpcContext } from "@/services/trpc/context";
import superjson from "superjson";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import ClientOnly from "@/components/ClientOnly";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Canvas Manager 2.0",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  await hydrateCourses(queryClient);
  const dehydratedState = dehydrate(queryClient);
  cookies(); // disables static page generation at build time

  const trpcHelper = createServerSideHelpers({
    router: trpcAppRouter,
    ctx: createTrpcContext(),
    transformer: superjson,
  });

  const allSettings = await fileStorageService.settings.getAllCoursesSettings();
  await Promise.all(
    allSettings.map(async (settings) => {
      const courseName = settings.name;
      const moduleNames = await fileStorageService.modules.getModuleNames(
        courseName
      );
      await Promise.all(
        moduleNames.map(async (moduleName) => {
          await trpcHelper.assignment.getAllAssignments.prefetch({
            courseName,
            moduleName,
          });

          // await Promise.all(
          //   assignments.map(
          //     async (a) =>
          //       await trpcHelper.assignment.getAssignment.fetch({
          //         courseName,
          //         moduleName,
          //         assignmentName: a.name,
          //       })
          //   )
          // );
        })
      );
    })
  );

  const dehydratedTrpc = trpcHelper.dehydrate();
  return (
    <html lang="en">
      <head></head>
      <body className="flex justify-center">
        <div className="bg-slate-900 h-screen text-slate-300 w-full sm:p-1">
          <MyToaster />
          <Suspense>
            <Providers>
              <HydrationBoundary state={dehydratedTrpc}>
                <HydrationBoundary state={dehydratedState}>
                  {children}
                </HydrationBoundary>
              </HydrationBoundary>
            </Providers>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
