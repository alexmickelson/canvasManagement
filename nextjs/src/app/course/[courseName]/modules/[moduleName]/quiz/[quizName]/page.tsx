import React from "react";
import EditQuiz from "./EditQuiz";

export default async function Page({
  params: { courseName, moduleName, quizName },
}: {
  params: { courseName: string; quizName: string; moduleName: string };
}) {
  return (
    <EditQuiz
      courseName={courseName}
      quizName={quizName}
      moduleName={moduleName}
    />
  );
}
