import React from "react";
import EditPage from "./EditPage";

export default async function Page({
  params: { moduleName, pageName },
}: {
  params: { pageName: string; moduleName: string };
}) {
  const decodedPageName = decodeURIComponent(pageName);
  const decodedModuleName = decodeURIComponent(moduleName);
  return <EditPage pageName={decodedPageName} moduleName={decodedModuleName} />;
}
