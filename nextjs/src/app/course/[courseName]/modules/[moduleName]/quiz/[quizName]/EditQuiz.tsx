"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import { useCallback, useEffect, useState } from "react";
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
  const [_, { dataUpdatedAt }] = useQuizQuery(moduleName, quizName);
  return (
    <InnerEditQuiz
      key={dataUpdatedAt}
      quizName={quizName}
      moduleName={moduleName}
    />
  );
}
export function InnerEditQuiz({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const router = useRouter();
  const { courseName } = useCourseContext();
  const [quiz, { dataUpdatedAt: serverDataUpdatedAt }] = useQuizQuery(
    moduleName,
    quizName
  );
  const updateQuizMutation = useUpdateQuizMutation();
  const [quizText, setQuizText] = useState(quizMarkdownUtils.toMarkdown(quiz));

  const [updateMonacoKey, setUpdateMonacoKey] = useState(1);
  const [clientDataUpdatedAt, setClientDataUpdatedAt] =
    useState(serverDataUpdatedAt);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const textUpdate = useCallback((t: string) => {
    setQuizText(t);
    setClientDataUpdatedAt(Date.now());
  }, []);

  useEffect(() => {
    const delay = 1000;
    const clientIsAuthoritative = serverDataUpdatedAt <= clientDataUpdatedAt;
    console.log("client is authoritative", clientIsAuthoritative);

    const handler = setTimeout(async () => {
      try {
        if (
          quizMarkdownUtils.toMarkdown(quiz) !==
          quizMarkdownUtils.toMarkdown(
            quizMarkdownUtils.parseMarkdown(quizText)
          )
        ) {
          if (clientIsAuthoritative) {
            const updatedQuiz = quizMarkdownUtils.parseMarkdown(quizText);
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
              "client not authoritative, updating client with server data"
            );
            textUpdate(quizMarkdownUtils.toMarkdown(quiz));
            setUpdateMonacoKey((k) => k + 1);
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
    clientDataUpdatedAt,
    courseName,
    moduleName,
    quiz,
    quizName,
    quizText,
    router,
    serverDataUpdatedAt,
    textUpdate,
    updateQuizMutation,
  ]);

  console.log("updateMonacoKey", updateMonacoKey);
  return (
    <div className="h-full flex flex-col align-middle px-1">
      <div className={"min-h-96 h-full flex flex-row w-full"}>
        {showHelp && (
          <pre className=" max-w-96">
            <code>{helpString}</code>
          </pre>
        )}
        <div className="flex-1 h-full">
          <MonacoEditor
            key={updateMonacoKey}
            value={quizText}
            onChange={textUpdate}
          />
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
