"use client";
import MonacoEditor from "@/components/MonacoEditor";
import { useQuizQuery } from "@/hooks/localCourse/quizHooks";

export default function EditQuiz({
  courseName,
  moduleName,
  quizName,
}: {
  courseName: string;
  quizName: string;
  moduleName: string;
}) {
  const { data: quiz } = useQuizQuery(courseName, moduleName, quizName);

  return (
    <div>
      {quiz.name}

      {/* <MonacoEditor /> */}
    </div>
  );
}
