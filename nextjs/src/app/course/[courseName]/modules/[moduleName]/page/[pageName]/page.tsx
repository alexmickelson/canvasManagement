import React from "react";
import EditPage from "./EditPage";

export default async function Page({
  params,
}: {
  params: Promise<{ pageName: string; moduleName: string }>;
}) {
  const { moduleName, pageName } = await params;
  const decodedPageName = decodeURIComponent(pageName);
  const decodedModuleName = decodeURIComponent(moduleName);
  return <EditPage pageName={decodedPageName} moduleName={decodedModuleName} />;
}
