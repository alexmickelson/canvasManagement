import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";
import { getQueryClient } from "./providersQueryClientUtils";
import { hydrateCourses } from "@/hooks/hookHydration";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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

  return (
    <html lang="en">
      <body className="bg-slate-900 h-screen p-1 text-slate-300">
        <Suspense>
          <Providers>
            <HydrationBoundary state={dehydratedState}>
              {children}
            </HydrationBoundary>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
