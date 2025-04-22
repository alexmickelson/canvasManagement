"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  useAssignmentQuery,
  useUpdateAssignmentMutation,
  useUpdateImageSettingsForAssignment,
} from "@/hooks/localCourse/assignmentHooks";
import {
  LocalAssignment,
  localAssignmentMarkdown,
} from "@/models/local/assignment/localAssignment";
import { useEffect, useState } from "react";
import AssignmentPreview from "./AssignmentPreview";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import ClientOnly from "@/components/ClientOnly";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import { useRouter } from "next/navigation";
import { AssignmentFooterButtons } from "./AssignmentFooterButtons";
import { useAuthoritativeUpdates } from "@/app/course/[courseName]/utils/useAuthoritativeUpdates";
import EditAssignmentHeader from "./EditAssignmentHeader";
import { Spinner } from "@/components/Spinner";
import { getAssignmentHelpString } from "./getAssignmentHelpString";

export default function EditAssignment({
  moduleName,
  assignmentName,
}: {
  assignmentName: string;
  moduleName: string;
}) {
  const router = useRouter();
  const { courseName } = useCourseContext();
  const [settings] = useLocalCourseSettingsQuery();
  const [
    assignment,
    { dataUpdatedAt: serverDataUpdatedAt, isFetching: assignmentIsFetching },
  ] = useAssignmentQuery(moduleName, assignmentName);
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
    <div className="h-full flex flex-col align-middle px-1">
      <EditAssignmentHeader
        moduleName={moduleName}
        assignmentName={assignmentName}
      />
      <div className={"min-h-0 flex flex-row w-full flex-grow"}>
        {showHelp && (
          <pre className=" max-w-96">
            <code>{getAssignmentHelpString(settings)}</code>
          </pre>
        )}
        <div className="flex-1 h-full">
          <MonacoEditor key={monacoKey} value={text} onChange={textUpdate} />
        </div>
        <div className="flex-1 h-full">
          <div className="text-red-300">{error && error}</div>

          <div className="px-3 h-full">
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
      </div>
      <ClientOnly>
        <SuspenseAndErrorHandling>
          <AssignmentFooterButtons
            moduleName={moduleName}
            assignmentName={assignmentName}
            toggleHelp={() => setShowHelp((h) => !h)}
          />
        </SuspenseAndErrorHandling>
      </ClientOnly>
    </div>
  );
}
