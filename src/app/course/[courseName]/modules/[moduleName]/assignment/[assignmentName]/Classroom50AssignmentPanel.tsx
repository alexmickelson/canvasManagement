"use client";
import CommandResultDisplay from "@/components/CommandResultDisplay";
import CopyableCommand from "@/components/CopyableCommand";
import LocalGhSetupNote from "@/components/LocalGhSetupNote";
import TextInput from "@/components/form/TextInput";
import { Spinner } from "@/components/Spinner";
import { useAssignmentQuery } from "@/features/local/assignments/assignmentHooks";
import {
  useClassroom50StatusQuery,
  useCreateClassroom50AssignmentMutation,
} from "@/features/local/classroom50/classroom50Hooks";
import {
  getClassroom50AcceptUrl,
  getClassroom50LocalCommands,
  classroomUrlToken,
} from "@/features/local/classroom50/classroom50UrlUtils";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useState } from "react";

const suggestSlug = (assignmentName: string) =>
  assignmentName
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");

export function Classroom50AssignmentPanel({
  moduleName,
  assignmentName,
}: {
  moduleName: string;
  assignmentName: string;
}) {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const { data: assignment } = useAssignmentQuery(moduleName, assignmentName);
  const statusQuery = useClassroom50StatusQuery();
  const createAssignment = useCreateClassroom50AssignmentMutation();
  const [template, setTemplate] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [bareRepo, setBareRepo] = useState(false);

  const slug = assignment.classroom50Slug;
  const acceptUrl = getClassroom50AcceptUrl(settings, slug);
  const localCommands = getClassroom50LocalCommands(settings, slug);
  const inClassroom =
    !!slug &&
    !!statusQuery.data?.configured &&
    statusQuery.data.assignmentSlugs.includes(slug);

  if (!slug)
    return (
      <div>
        <h5 className="text-center">Classroom 50</h5>
        <p className="text-slate-400">
          This assignment has no slug yet. Add this line to the settings block
          at the top of the assignment markdown:
        </p>
        <CopyableCommand
          command={`Classroom50Slug: ${suggestSlug(assignmentName)}`}
        />
        <p className="text-slate-500 text-sm">
          The student accept link and repo names are derived from the slug, so
          keep it short and lowercase.
        </p>
      </div>
    );

  return (
    <div>
      <h5 className="text-center">
        Classroom 50{" "}
        {statusQuery.isLoading ? (
          <span className="text-slate-500 text-sm">checking...</span>
        ) : inClassroom ? (
          <span className="text-emerald-300 text-sm">created · {slug}</span>
        ) : (
          <span className="text-slate-400 text-sm">not created · {slug}</span>
        )}
      </h5>

      {acceptUrl && (
        <CopyableCommand
          command={acceptUrl}
          note={`Student accept link (use [text](${classroomUrlToken}) in the description to embed it)`}
        />
      )}

      {!inClassroom && (
        <div className="border border-slate-600 rounded-md p-2 my-2">
          <TextInput
            value={template}
            setValue={setTemplate}
            label="Starter code repo (owner/repo or owner/repo@branch, blank for an empty repo with autograding)"
          />
          {!template.trim() && (
            <label className="block my-1">
              <input
                type="checkbox"
                checked={bareRepo}
                onChange={(e) => setBareRepo(e.target.checked)}
              />{" "}
              Bare repo — students build everything from scratch. Disables
              autograding and the feedback PR permanently.
            </label>
          )}
          <label className="block my-1">
            <input
              type="checkbox"
              checked={isGroup}
              onChange={(e) => setIsGroup(e.target.checked)}
            />{" "}
            Group assignment
          </label>
          {isGroup && (
            <TextInput
              value={maxGroupSize}
              setValue={setMaxGroupSize}
              label="Max group size (blank for unlimited)"
            />
          )}
          <div className="flex flex-row justify-end gap-3 items-center mt-2">
            {createAssignment.isPending && <Spinner />}
            <button
              disabled={createAssignment.isPending}
              onClick={() =>
                createAssignment.mutate({
                  courseName,
                  moduleName,
                  assignmentName,
                  template: template.trim() || undefined,
                  emptyRepo: (bareRepo && !template.trim()) || undefined,
                  mode: isGroup ? "group" : "individual",
                  maxGroupSize:
                    isGroup && maxGroupSize
                      ? parseInt(maxGroupSize)
                      : undefined,
                })
              }
            >
              Create in Classroom 50
            </button>
          </div>
        </div>
      )}

      {createAssignment.data && (
        <CommandResultDisplay result={createAssignment.data.result} />
      )}

      {localCommands?.downloadSubmissions && (
        <>
          <CopyableCommand
            command={localCommands.downloadSubmissions}
            note="Clone all submissions for grading (run on your machine, the -d path is only a suggestion)"
          />
          <LocalGhSetupNote />
        </>
      )}
    </div>
  );
}
