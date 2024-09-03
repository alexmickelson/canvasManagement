"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  useQuizQuery,
  useUpdateQuizMutation,
} from "@/hooks/localCourse/quizHooks";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import { useEffect, useState } from "react";
import QuizPreview from "./QuizPreview";

export default function EditQuiz({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const { data: quiz } = useQuizQuery(moduleName, quizName);
  const updateQuizMutation = useUpdateQuizMutation();
  const [quizText, setQuizText] = useState(quizMarkdownUtils.toMarkdown(quiz));
  const [error, setError] = useState("");
  // console.log(quizText);

  useEffect(() => {
    const delay = 500;
    const handler = setTimeout(() => {
      if (
        quizMarkdownUtils.toMarkdown(quiz) !==
        quizMarkdownUtils.toMarkdown(quizMarkdownUtils.parseMarkdown(quizText))
      ) {
        try {
          const updatedQuiz = quizMarkdownUtils.parseMarkdown(quizText);
          updateQuizMutation.mutate({
            quiz: updatedQuiz,
            moduleName,
            quizName,
          });
        } catch (e: any) {
          setError(e.toString());
        }
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [moduleName, quiz, quizName, quizText, updateQuizMutation]);

  return (
    <div className="h-full flex flex-col">
      {quiz.name}
      <div className="columns-2 min-h-0 flex-1">
        <MonacoEditor value={quizText} onChange={setQuizText} />
        <div>
          <div className="text-red-300">{error && error}</div>
          <QuizPreview quiz={quiz} />
        </div>
      </div>
    </div>
  );
}
