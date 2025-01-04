import React, { ReactNode, Suspense } from "react";


export default function layout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
