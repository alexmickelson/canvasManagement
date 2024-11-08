import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";
import { getQueryClient } from "./providersQueryClientUtils";
import { hydrateCourses } from "@/hooks/hookHydration";
import { dehydrate, hydrate, HydrationBoundary } from "@tanstack/react-query";
import { MyToaster } from "./MyToaster";
import { cookies } from "next/headers";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { trpcAppRouter } from "@/services/trpc/router/app";
import { createTrpcContext } from "@/services/trpc/context";
import superjson from "superjson";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import ClientOnly from "@/components/ClientOnly";
import { createTRPCQueryUtils } from "@trpc/react-query";
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
                {children}
            </Providers>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
