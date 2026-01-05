import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Suspense } from "react";
import { MyToaster } from "./MyToaster";
import { ClientCacheInvalidation } from "../components/realtime/ClientCacheInvalidation";
import { getTitle } from "@/services/titleUtils";
import DataHydration from "./DataHydration";
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
      <body className="flex justify-center" suppressHydrationWarning>
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
