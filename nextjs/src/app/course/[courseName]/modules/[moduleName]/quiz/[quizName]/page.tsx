import React from "react";
import EditQuiz from "./EditQuiz";

export default async function Page({
  params: { moduleName, quizName },
}: {
  params: { quizName: string; moduleName: string };
}) {
  return <EditQuiz quizName={quizName} moduleName={moduleName} />;
}
