import React from "react";
import EditQuiz from "./EditQuiz";

export default async function Page({
  params: { moduleName, quizName },
}: {
  params: { quizName: string; moduleName: string };
}) {
  const decodedQuizName = decodeURIComponent(quizName)
  const decodedModuleName = decodeURIComponent(moduleName)
  return <EditQuiz quizName={decodedQuizName} moduleName={decodedModuleName} />;
}
