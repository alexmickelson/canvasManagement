"use client";
import MonacoEditor from "@/components/MonacoEditor";
import { useQuizQuery } from "@/hooks/localCourse/quizHooks";

export default function EditQuiz({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const { data: quiz } = useQuizQuery(moduleName, quizName);

  return (
    <div>
      {quiz.name}

      {/* <MonacoEditor /> */}
    </div>
  );
}
