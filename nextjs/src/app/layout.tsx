import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { dehydrate } from "@tanstack/react-query";
import { MyQueryClientProvider } from "@/services/utils/MyQueryClientProvider";
import { hydrateCourses } from "@/hooks/hookHydration";
import { LoadingAndErrorHandling } from "@/components/LoadingAndErrorHandling";
import { createQueryClientForServer } from "@/services/utils/queryClientServer";

const inter = Inter({ subsets: ["latin"] });

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
        <LoadingAndErrorHandling>
          <body className={inter.className}>{children}</body>
        </LoadingAndErrorHandling>
      </MyQueryClientProvider>
    </html>
  );
}
