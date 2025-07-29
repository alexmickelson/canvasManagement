import React from "react";
import EditPage from "./EditPage";
import { getTitle } from "@/services/titleUtils";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    courseName: string;
    pageName: string;
    moduleName: string;
  }>;
}): Promise<Metadata> {
  const { courseName, pageName } = await params;
  const decodedPageName = decodeURIComponent(pageName);
  const decodedCourseName = decodeURIComponent(courseName);
  return {
    title: getTitle(`${decodedPageName}, ${decodedCourseName}`),
  };
}

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
