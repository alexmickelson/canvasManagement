import Providers from "@/components/providers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Suspense } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Suspense>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </Suspense>
  );
}
