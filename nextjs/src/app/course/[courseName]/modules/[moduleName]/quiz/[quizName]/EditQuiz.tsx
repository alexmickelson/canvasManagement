"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
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

      <MonacoEditor
        value={""}
        onChange={function (value: string): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
}
