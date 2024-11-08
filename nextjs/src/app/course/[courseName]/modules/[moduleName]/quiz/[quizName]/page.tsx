import React from "react";
import EditQuiz from "./EditQuiz";

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
