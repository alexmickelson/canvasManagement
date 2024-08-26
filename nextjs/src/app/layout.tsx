import type { Metadata } from "next";
import "./globals.css";
import { dehydrate } from "@tanstack/react-query";
import { hydrateCourses } from "@/hooks/hookHydration";
import { createQueryClientForServer } from "@/services/utils/queryClientServer";
import MyQueryClientProvider from "@/services/utils/MyQueryClientProvider";


export const metadata: Metadata = {
  title: "Canvas Manager 2.0",
};

export async function getDehydratedClient() {
  const queryClient = createQueryClientForServer();

  await hydrateCourses(queryClient);
  const dehydratedState = dehydrate(queryClient);
  return dehydratedState;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dehydratedState = await getDehydratedClient();

  return (
    <html lang="en">
      <MyQueryClientProvider dehydratedState={dehydratedState}>
          <body className="bg-slate-950">{children}</body>
      </MyQueryClientProvider>
    </html>
  );
}
