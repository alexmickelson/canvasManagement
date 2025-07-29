import React from "react";
import EditQuiz from "./EditQuiz";
import { getTitle } from "@/services/titleUtils";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    courseName: string;
    quizName: string;
    moduleName: string;
  }>;
}): Promise<Metadata> {
  const { courseName, quizName } = await params;
  const decodedQuizName = decodeURIComponent(quizName);
  const decodedCourseName = decodeURIComponent(courseName);
  return {
    title: getTitle(`${decodedQuizName}, ${decodedCourseName}`),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ quizName: string; moduleName: string }>;
}) {
  const { moduleName, quizName } = await params;
  const decodedQuizName = decodeURIComponent(quizName)
  const decodedModuleName = decodeURIComponent(moduleName)
  return <EditQuiz quizName={decodedQuizName} moduleName={decodedModuleName} />;
}
