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
import { getModuleItemUrl } from "@/services/urlUtils";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import ClientOnly from "@/components/ClientOnly";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import { AssignmentSubmissionType } from "@/models/local/assignment/assignmentSubmissionType";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";
import { useRouter } from "next/navigation";
import { AssignmentButtons } from "./AssignmentButtons";
import { useAuthoritativeUpdates } from "@/app/course/[courseName]/utils/useAuthoritativeUpdates";
import { extractLabelValue } from "@/models/local/assignment/utils/markdownUtils";

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

        const name = extractLabelValue(text, "Name");
        const updatedAssignment: LocalAssignment =
          localAssignmentMarkdown.parseMarkdown(text, name);
        if (
          localAssignmentMarkdown.toMarkdown(assignment) !==
          localAssignmentMarkdown.toMarkdown(updatedAssignment)
        ) {
          if (clientIsAuthoritative) {
            console.log("updating assignment, client is authoritative");
            updateAssignment
              .mutateAsync({
                assignment: updatedAssignment,
                moduleName,
                assignmentName: updatedAssignment.name,
                previousModuleName: moduleName,
                previousAssignmentName: assignmentName,
                courseName,
              })
              .then(async () => {
                // await new Promise(resolve => setTimeout(resolve, 1000));

                if (updatedAssignment.name !== assignmentName)
                  router.replace(
                    getModuleItemUrl(
                      courseName,
                      moduleName,
                      "assignment",
                      updatedAssignment.name
                    ), {
                      
                    }
                  );
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
      <div className={"min-h-0 flex flex-row w-full flex-grow"}>
        {showHelp && (
          <pre className=" max-w-96">
            <code>{getHelpString(settings)}</code>
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
                <AssignmentPreview assignment={assignment} />
              </SuspenseAndErrorHandling>
            </ClientOnly>
          </div>
        </div>
      </div>
      <ClientOnly>
        <SuspenseAndErrorHandling>
          <AssignmentButtons
            moduleName={moduleName}
            assignmentName={assignmentName}
            toggleHelp={() => setShowHelp((h) => !h)}
          />
        </SuspenseAndErrorHandling>
      </ClientOnly>
    </div>
  );
}

function getHelpString(settings: LocalCourseSettings) {
  const groupNames = settings.assignmentGroups.map((g) => g.name).join("\n- ");
  const helpString = `SubmissionTypes:
- ${AssignmentSubmissionType.ONLINE_TEXT_ENTRY}
- ${AssignmentSubmissionType.ONLINE_UPLOAD}
- ${AssignmentSubmissionType.DISCUSSION_TOPIC}
AllowedFileUploadExtensions:
- pdf
- jpg
- jpeg
- png
Assignment Group Names:
- ${groupNames}`;
  return helpString;
}
