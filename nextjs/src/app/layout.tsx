import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { createQueryClient } from "@/services/utils/queryClient";
import { dehydrate } from "@tanstack/react-query";
import { MyQueryClientProvider } from "@/services/utils/MyQueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canvas Manager 2.0",
};

export async function getDehydratedClient() {
  const queryClient = createQueryClient();

  // await hydrateOpenSections(queryClient);
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
        <body className={inter.className}>{children}</body>
      </MyQueryClientProvider>
    </html>
  );
}
