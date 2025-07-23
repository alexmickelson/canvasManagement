"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useEffect, useState } from "react";
import QuizPreview from "./QuizPreview";
import { QuizButtons } from "./QuizButton";
import ClientOnly from "@/components/ClientOnly";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import { useRouter } from "next/navigation";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  useQuizQuery,
  useUpdateQuizMutation,
} from "@/hooks/localCourse/quizHooks";
import { useAuthoritativeUpdates } from "../../../../utils/useAuthoritativeUpdates";
import { extractLabelValue } from "@/features/local/assignments/models/utils/markdownUtils";
import EditQuizHeader from "./EditQuizHeader";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { EditLayout } from "@/components/EditLayout";
import { quizMarkdownUtils } from "@/features/local/quizzes/models/utils/quizMarkdownUtils";

const helpString = (settings: LocalCourseSettings) => {
  const groupNames = settings.assignmentGroups.map((g) => g.name).join("\n- ");
  return `Assignment Group Names:
- ${groupNames}

QUESTION REFERENCE
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
^ other thing -  another option
^ - distractor
^ - other distractor`;
};

export default function EditQuiz({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const router = useRouter();
  const { data: settings } = useLocalCourseSettingsQuery();
  const { courseName } = useCourseContext();
  const {
    data: quiz,
    dataUpdatedAt: serverDataUpdatedAt,
    isFetching,
  } = useQuizQuery(moduleName, quizName);
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
            const updatedQuiz = quizMarkdownUtils.parseMarkdown(text, quizName);
            await updateQuizMutation.mutateAsync({
              quiz: updatedQuiz,
              moduleName,
              quizName: quizName,
              previousModuleName: moduleName,
              previousQuizName: quizName,
              courseName,
            });
          } else {
            console.log(
              "client not authoritative, updating client with server quiz"
            );
            textUpdate(quizMarkdownUtils.toMarkdown(quiz), true);
          }
        }
        setError("");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <EditLayout
      Header={<EditQuizHeader moduleName={moduleName} quizName={quizName} />}
      Body={
        <>
          {showHelp && (
            <pre className=" max-w-96">
              <code>{helpString(settings)}</code>
            </pre>
          )}
          <div className="flex-1 h-full">
            <MonacoEditor key={monacoKey} value={text} onChange={textUpdate} />
          </div>
          <div className="flex-1 h-full">
            <div className="text-red-300">{error && error}</div>
            <QuizPreview moduleName={moduleName} quizName={quizName} />
          </div>
        </>
      }
      Footer={
        <ClientOnly>
          <SuspenseAndErrorHandling>
            <QuizButtons
              moduleName={moduleName}
              quizName={quizName}
              toggleHelp={() => setShowHelp((h) => !h)}
            />
          </SuspenseAndErrorHandling>
        </ClientOnly>
      }
    />
  );
}
