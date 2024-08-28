import type { Metadata } from "next";
import "./globals.css";
import { dehydrate } from "@tanstack/react-query";
import { hydrateCourses } from "@/hooks/hookHydration";
import { createQueryClientForServer } from "@/services/utils/queryClientServer";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Canvas Manager 2.0",
};

export async function getDehydratedClient() {
  const queryClient = createQueryClientForServer();

  await hydrateCourses(queryClient);
  const dehydratedState = dehydrate(queryClient);
  return dehydratedState;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className="bg-slate-900 h-screen p-1">{children}</body>
      </Providers>
    </html>
  );
}
