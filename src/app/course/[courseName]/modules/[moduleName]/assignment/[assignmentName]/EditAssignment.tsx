"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  LocalAssignment,
  localAssignmentMarkdown,
} from "@/features/local/assignments/models/localAssignment";
import { useEffect, useState } from "react";
import AssignmentPreview from "./AssignmentPreview";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import ClientOnly from "@/components/ClientOnly";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import { useRouter } from "next/navigation";
import { AssignmentFooterButtons } from "./AssignmentFooterButtons";
import { useAuthoritativeUpdates } from "@/app/course/[courseName]/utils/useAuthoritativeUpdates";
import EditAssignmentHeader from "./EditAssignmentHeader";
import { Spinner } from "@/components/Spinner";
import { getAssignmentHelpString } from "./getAssignmentHelpString";
import { EditLayout } from "@/components/EditLayout";
import {
  useAssignmentQuery,
  useUpdateAssignmentMutation,
  useUpdateImageSettingsForAssignment,
} from "@/features/local/assignments/assignmentHooks";

export default function EditAssignment({
  moduleName,
  assignmentName,
}: {
  assignmentName: string;
  moduleName: string;
}) {
  const router = useRouter();
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const {
    data: assignment,
    dataUpdatedAt: serverDataUpdatedAt,
    isFetching: assignmentIsFetching,
  } = useAssignmentQuery(moduleName, assignmentName);
  const updateAssignment = useUpdateAssignmentMutation();
  const { isPending: imageUpdateIsPending } =
    useUpdateImageSettingsForAssignment({ moduleName, assignmentName });

  const {
    clientIsAuthoritative,
    text,
    textUpdate,
    monacoKey,
    serverUpdatedAt,
    clientDataUpdatedAt,
  } = useAuthoritativeUpdates({
    serverUpdatedAt: serverDataUpdatedAt,
    startingText: localAssignmentMarkdown.toMarkdown(assignment),
  });

  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const delay = 500;

    const handler = setTimeout(() => {
      try {
        if (assignmentIsFetching || updateAssignment.isPending) {
          console.log("network requests in progress, not updating assignments");
          return;
        }

        // make separate way to update name?
        const updatedAssignment: LocalAssignment =
          localAssignmentMarkdown.parseMarkdown(text, assignmentName);
        if (
          localAssignmentMarkdown.toMarkdown(assignment) !==
          localAssignmentMarkdown.toMarkdown(updatedAssignment)
        ) {
          if (clientIsAuthoritative) {
            console.log("updating assignment, client is authoritative");
            updateAssignment.mutateAsync({
              assignment: updatedAssignment,
              moduleName,
              assignmentName,
              previousModuleName: moduleName,
              previousAssignmentName: assignmentName,
              courseName,
            });
          } else {
            console.log(
              "client not authoritative, updating client with server assignment",
              "client updated",
              clientDataUpdatedAt,
              "server updated",
              serverUpdatedAt
            );
            textUpdate(localAssignmentMarkdown.toMarkdown(assignment), true);
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
    assignment,
    assignmentName,
    clientDataUpdatedAt,
    clientIsAuthoritative,
    courseName,
    assignmentIsFetching,
    moduleName,
    router,
    serverUpdatedAt,
    text,
    textUpdate,
    updateAssignment,
  ]);

  return (
    <EditLayout
      Header={
        <EditAssignmentHeader
          moduleName={moduleName}
          assignmentName={assignmentName}
        />
      }
      Body={
        <>
          {showHelp && (
            <div className=" max-w-96 flex-1 h-full overflow-y-auto">
              <pre>
                <code>{getAssignmentHelpString(settings)}</code>
              </pre>
              <a
                href="https://www.markdownguide.org/cheat-sheet/"
                target="_blank"
                className="text-blue-400 underline"
              >
                Markdown Cheat Sheet
              </a>
              <a
                href="https://mermaid.live/edit"
                target="_blank"
                className="text-blue-400 underline ps-3"
              >
                Mermaid Live Editor
              </a>
            </div>
          )}
          <div className="flex-1 h-full">
            <MonacoEditor key={monacoKey} value={text} onChange={textUpdate} />
          </div>
          <div className="flex-1 h-full">
            <div className="text-red-300">{error && error}</div>

            <div className="px-3 h-full ">
              <ClientOnly>
                <SuspenseAndErrorHandling showToast={false}>
                  {imageUpdateIsPending && (
                    <div className="flex justify-center">
                      <Spinner /> images being uploaded to canvas
                    </div>
                  )}

                  <AssignmentPreview assignment={assignment} />
                </SuspenseAndErrorHandling>
              </ClientOnly>
            </div>
          </div>
        </>
      }
      Footer={
        <ClientOnly>
          <SuspenseAndErrorHandling>
            <AssignmentFooterButtons
              moduleName={moduleName}
              assignmentName={assignmentName}
              toggleHelp={() => setShowHelp((h) => !h)}
            />
          </SuspenseAndErrorHandling>
        </ClientOnly>
      }
    />
  );
}
