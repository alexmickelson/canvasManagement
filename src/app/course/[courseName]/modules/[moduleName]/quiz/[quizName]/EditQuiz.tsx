"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import { useEffect, useState } from "react";
import QuizPreview from "./QuizPreview";
import { QuizButtons } from "./QuizButton";
import ClientOnly from "@/components/ClientOnly";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import { useRouter } from "next/navigation";
import { getModuleItemUrl } from "@/services/urlUtils";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  useQuizQuery,
  useUpdateQuizMutation,
} from "@/hooks/localCourse/quizHooks";
import { useAuthoritativeUpdates } from "../../../../utils/useAuthoritativeUpdates";
import { extractLabelValue } from "@/models/local/assignment/utils/markdownUtils";

const helpString = `QUESTION REFERENCE
---
Points: 2
this is a question?
*a) correct
b) not correct
---
points: 1
question goes here
[*] correct
[ ] not correct
[] not correct
---
the points default to 1?
*a) true
b) false
---
Markdown is supported

- like
- this
- list

[*] true
[ ] false
---
This is a one point essay question
essay
---
points: 4
this is a short answer question
short_answer
---
points: 4
the underscore is optional
short answer
---
this is a matching question
^ left answer - right dropdown
^ other thing -  another option`;

export default function EditQuiz({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const router = useRouter();
  const { courseName } = useCourseContext();
  const [quiz, { dataUpdatedAt: serverDataUpdatedAt, isFetching }] =
    useQuizQuery(moduleName, quizName);
  const updateQuizMutation = useUpdateQuizMutation();
  const { clientIsAuthoritative, text, textUpdate, monacoKey } =
    useAuthoritativeUpdates({
      serverUpdatedAt: serverDataUpdatedAt,
      startingText: quizMarkdownUtils.toMarkdown(quiz),
    });

  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const delay = 1000;
    const handler = setTimeout(async () => {
      if (isFetching || updateQuizMutation.isPending) {
        console.log("network requests in progress, not updating page");
        return;
      }
      try {
        const name = extractLabelValue(text, "Name");
        if (
          quizMarkdownUtils.toMarkdown(quiz) !==
          quizMarkdownUtils.toMarkdown(
            quizMarkdownUtils.parseMarkdown(text, name)
          )
        ) {
          if (clientIsAuthoritative) {
            const updatedName = extractLabelValue(text, "Name");
            const updatedQuiz = quizMarkdownUtils.parseMarkdown(
              text,
              updatedName
            );
            await updateQuizMutation
              .mutateAsync({
                quiz: updatedQuiz,
                moduleName,
                quizName: updatedQuiz.name,
                previousModuleName: moduleName,
                previousQuizName: quizName,
                courseName,
              })
              .then(() => {
                if (updatedQuiz.name !== quizName)
                  router.replace(
                    getModuleItemUrl(
                      courseName,
                      moduleName,
                      "quiz",
                      updatedQuiz.name
                    )
                  );
              });
          } else {
            console.log(
              "client not authoritative, updating client with server quiz"
            );
            textUpdate(quizMarkdownUtils.toMarkdown(quiz), true);
          }
        }
        setError("");
      } catch (e: any) {
        setError(e.toString());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [
    clientIsAuthoritative,
    courseName,
    isFetching,
    moduleName,
    quiz,
    quizName,
    router,
    text,
    textUpdate,
    updateQuizMutation,
  ]);

  return (
    <div className="h-full flex flex-col align-middle px-1">
      <div className={"min-h-96 h-full flex flex-row w-full"}>
        {showHelp && (
          <pre className=" max-w-96">
            <code>{helpString}</code>
          </pre>
        )}
        <div className="flex-1 h-full">
          <MonacoEditor key={monacoKey} value={text} onChange={textUpdate} />
        </div>
        <div className="flex-1 h-full">
          <div className="text-red-300">{error && error}</div>
          <QuizPreview moduleName={moduleName} quizName={quizName} />
        </div>
      </div>
      <ClientOnly>
        <SuspenseAndErrorHandling>
          <QuizButtons
            moduleName={moduleName}
            quizName={quizName}
            toggleHelp={() => setShowHelp((h) => !h)}
          />
        </SuspenseAndErrorHandling>
      </ClientOnly>
    </div>
  );
}
