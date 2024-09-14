"use client";
import ButtonSelect from "@/components/ButtonSelect";
import TextInput from "@/components/form/TextInput";
import { Spinner } from "@/components/Spinner";
import { useCreateAssignmentMutation } from "@/hooks/localCourse/assignmentHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { useCreatePageMutation } from "@/hooks/localCourse/pageHooks";
import { useCreateQuizMutation } from "@/hooks/localCourse/quizHooks";
import { AssignmentSubmissionType } from "@/models/local/assignment/assignmentSubmissionType";
import { LocalAssignmentGroup } from "@/models/local/assignment/localAssignmentGroup";
import { dateToMarkdownString } from "@/models/local/timeUtils";
import React, { useState } from "react";

export default function NewItemForm({ moduleName }: { moduleName: string }) {
  const [type, setType] = useState<"Assignment" | "Quiz" | "Page">(
    "Assignment"
  );
  const [name, setName] = useState("");
  const [assignmentGroup, setAssignmentGroup] =
    useState<LocalAssignmentGroup>();
  const { data: settings } = useLocalCourseSettingsQuery();
  const createAssignment = useCreateAssignmentMutation();
  const createPage = useCreatePageMutation();
  const createQuiz = useCreateQuizMutation();

  const isPending =
    createAssignment.isPending || createPage.isPending || createQuiz.isPending;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (type === "Assignment") {
          createAssignment.mutate({
            assignment: {
              name,
              description: "",
              dueAt: dateToMarkdownString(new Date()),
              submissionTypes: [
                AssignmentSubmissionType.ONLINE_TEXT_ENTRY,
                AssignmentSubmissionType.ONLINE_UPLOAD,
              ],
              allowedFileUploadExtensions: ["pdf"],
              rubric: [],
            },
            moduleName: moduleName,
            assignmentName: name,
          });
        } else if (type === "Quiz") {
        } else if (type === "Page") {
        }
      }}
    >
      <div>
        <ButtonSelect<"Assignment" | "Quiz" | "Page">
          options={["Assignment", "Quiz", "Page"]}
          getName={(o) => o?.toString() ?? ""}
          setSelectedOption={(t) => setType(t ?? "Assignment")}
          selectedOption={type}
        />
      </div>
      <div>
        <TextInput label={type + " Name"} value={name} setValue={setName} />
      </div>
      <div>
        <ButtonSelect
          options={settings.assignmentGroups}
          getName={(g) => g?.name ?? ""}
          setSelectedOption={setAssignmentGroup}
          selectedOption={assignmentGroup}
        />
      </div>
      {settings.assignmentGroups.length === 0 && (
        <div>
          No assignment groups created, create them in the course settings page
        </div>
      )}
      <button>Create</button>
      {isPending && <Spinner />}
    </form>
  );
}
