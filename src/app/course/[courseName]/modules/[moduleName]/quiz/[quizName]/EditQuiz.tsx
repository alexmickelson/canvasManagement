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
} from "@/features/local/quizzes/quizHooks";
import { useAuthoritativeUpdates } from "../../../../utils/useAuthoritativeUpdates";
import { extractLabelValue } from "@/features/local/assignments/models/utils/markdownUtils";
import EditQuizHeader from "./EditQuizHeader";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { useGlobalSettingsQuery } from "@/features/local/globalSettings/globalSettingsHooks";
import { getFeedbackDelimitersFromSettings } from "@/features/local/globalSettings/globalSettingsUtils";
import type { GlobalSettings } from "@/features/local/globalSettings/globalSettingsModels";
import { EditLayout } from "@/components/EditLayout";
import { quizMarkdownUtils } from "@/features/local/quizzes/models/utils/quizMarkdownUtils";
import { LocalCourseSettings } from "@/features/local/course/localCourseSettings";

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
short answer with auto-graded responses
*a) answer 1
*b) other valid answer
short_answer=
---
this is a matching question
^ left answer - right dropdown
^ other thing -  another option
^ - distractor
^ - other distractor
---
Points: 3
FEEDBACK EXAMPLE
What is 2+3?
+ Correct! Good job
- Incorrect, try again
... This is general feedback shown regardless
*a) 4
*b) 5
c) 6
---
Points: 2
FEEDBACK EXAMPLE
Multiline feedback example
+
Great work!
You understand the concept.
-
Not quite right.
Review the material and try again.
*a) correct answer
b) wrong answer`;
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
  const { data: globalSettings } = useGlobalSettingsQuery();
  const feedbackDelimiters = getFeedbackDelimitersFromSettings(
    (globalSettings ?? ({} as GlobalSettings)) as GlobalSettings,
  );

  const { clientIsAuthoritative, text, textUpdate, monacoKey } =
    useAuthoritativeUpdates({
      serverUpdatedAt: serverDataUpdatedAt,
      startingText: quizMarkdownUtils.toMarkdown(quiz, feedbackDelimiters),
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
          quizMarkdownUtils.toMarkdown(quiz, feedbackDelimiters) !==
          quizMarkdownUtils.toMarkdown(
            quizMarkdownUtils.parseMarkdown(text, name, feedbackDelimiters),
            feedbackDelimiters,
          )
        ) {
          if (clientIsAuthoritative) {
            const updatedQuiz = quizMarkdownUtils.parseMarkdown(
              text,
              quizName,
              feedbackDelimiters,
            );
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
              "client not authoritative, updating client with server quiz",
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
    feedbackDelimiters,
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
            <pre className=" max-w-96 h-full overflow-y-auto">
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
