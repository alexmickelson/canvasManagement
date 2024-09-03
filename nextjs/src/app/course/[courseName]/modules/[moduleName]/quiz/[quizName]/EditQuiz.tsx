"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useQuizQuery } from "@/hooks/localCourse/quizHooks";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import { useState } from "react";

export default function EditQuiz({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const { data: quiz } = useQuizQuery(moduleName, quizName);
  const [quizText, setQuizText] = useState(quizMarkdownUtils.toMarkdown(quiz));
  // console.log(quizText);

  return (
    <div>
      {quiz.name}
      <MonacoEditor value={quizText} onChange={setQuizText} />
    </div>
  );
}
