import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";
import { getQueryClient } from "./providersQueryClientUtils";
import { hydrateCourses } from "@/hooks/hookHydration";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MyToaster } from "./MyToaster";
import { cookies } from "next/headers";
export const dynamic = 'force-dynamic'

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
  cookies() // disables static page generation at build time

  return (
    <html lang="en">
      <head></head>
      <body className="flex justify-center">
        <div className="bg-slate-900 h-screen text-slate-300 w-full p-1">
            <MyToaster />
            <Suspense>
              <Providers>
                <HydrationBoundary state={dehydratedState}>
                  {children}
                </HydrationBoundary>
              </Providers>
            </Suspense>
        </div>
      </body>
    </html>
  );
}
