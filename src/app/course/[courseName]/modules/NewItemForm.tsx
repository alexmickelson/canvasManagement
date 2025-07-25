"use client";
import ButtonSelect from "@/components/ButtonSelect";
import SelectInput from "@/components/form/SelectInput";
import TextInput from "@/components/form/TextInput";
import { Spinner } from "@/components/Spinner";
import { useModuleNamesQuery } from "@/features/local/modules/localCourseModuleHooks";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { useCreatePageMutation } from "@/features/local/pages/pageHooks";
import { LocalAssignmentGroup } from "@/features/local/assignments/models/localAssignmentGroup";

import React, { useState } from "react";
import { useCourseContext } from "../context/courseContext";
import { useCreateQuizMutation } from "@/features/local/quizzes/quizHooks";
import {
  getDateFromString,
  dateToMarkdownString,
  getDateFromStringOrThrow,
} from "@/features/local/utils/timeUtils";
import { useCreateAssignmentMutation } from "@/features/local/assignments/assignmentHooks";

export default function NewItemForm({
  moduleName: defaultModuleName,
  onCreate = () => {},
  creationDate,
}: {
  moduleName?: string;
  creationDate?: string;
  onCreate?: () => void;
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
  const { courseName } = useCourseContext();
  const { data: modules } = useModuleNamesQuery();
  const [type, setType] = useState<"Assignment" | "Quiz" | "Page">(
    "Assignment"
  );

  const [moduleName, setModuleName] = useState<string | undefined>(
    defaultModuleName
  );

  const [name, setName] = useState("");

  const defaultDate = getDateFromString(
    creationDate ? creationDate : dateToMarkdownString(new Date())
  );
  defaultDate?.setMinutes(settings.defaultDueTime.minute);
  defaultDate?.setHours(settings.defaultDueTime.hour);
  defaultDate?.setSeconds(0);

  const [dueDate, setDueDate] = useState(
    dateToMarkdownString(defaultDate ?? new Date())
  );
  const [assignmentGroup, setAssignmentGroup] =
    useState<LocalAssignmentGroup>();

  const createPage = useCreatePageMutation();
  const createQuiz = useCreateQuizMutation();
  const createAssignment = useCreateAssignmentMutation();

  const isPending =
    createAssignment.isPending || createPage.isPending || createQuiz.isPending;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const dueAt =
          dueDate === ""
            ? dueDate
            : dateToMarkdownString(defaultDate ?? new Date());
        const lockAt =
          settings.defaultLockHoursOffset === undefined
            ? undefined
            : dateToMarkdownString(
                addHoursToDate(
                  getDateFromStringOrThrow(
                    dueDate,
                    "getting default lock time"
                  ),
                  settings.defaultLockHoursOffset
                )
              );

        if (!moduleName) {
          return;
        }
        if (type === "Assignment") {
          createAssignment.mutate({
            assignment: {
              name,
              description: "",
              localAssignmentGroupName: assignmentGroup?.name ?? "",
              dueAt,
              lockAt,
              submissionTypes: settings.defaultAssignmentSubmissionTypes,
              allowedFileUploadExtensions: settings.defaultFileUploadTypes,
              rubric: [],
            },
            moduleName: moduleName,
            assignmentName: name,
            courseName,
          });
        } else if (type === "Quiz") {
          createQuiz.mutate({
            quiz: {
              name,
              description: "",
              localAssignmentGroupName: assignmentGroup?.name ?? "",
              dueAt,
              lockAt,
              shuffleAnswers: true,
              showCorrectAnswers: true,
              oneQuestionAtATime: true,
              allowedAttempts: -1,
              questions: [],
            },
            moduleName: moduleName,
            quizName: name,
            courseName,
          });
        } else if (type === "Page") {
          createPage.mutate({
            page: {
              name,
              text: "",
              dueAt,
            },
            moduleName: moduleName,
            pageName: name,
            courseName,
          });
        }
        onCreate();
      }}
    >
      <div>
        <TextInput
          label={type + " due date"}
          value={dueDate ?? ""}
          setValue={setDueDate}
        />
      </div>
      <div>
        <SelectInput
          value={moduleName}
          setValue={(m) => setModuleName(m)}
          label={"Module"}
          options={modules}
          getOptionName={(m) => m}
        />
      </div>
      <div>
        <ButtonSelect<"Assignment" | "Quiz" | "Page">
          options={["Assignment", "Quiz", "Page"]}
          getOptionName={(o) => o?.toString() ?? ""}
          setValue={(t) => setType(t ?? "Assignment")}
          value={type}
          label="Type"
        />
      </div>
      <div>
        <TextInput label={type + " Name"} value={name} setValue={setName} />
      </div>
      <div>
        {type !== "Page" && (
          <ButtonSelect
            options={settings.assignmentGroups}
            getOptionName={(g) => g?.name ?? ""}
            setValue={setAssignmentGroup}
            value={assignmentGroup}
            label="Assignment Group"
          />
        )}
      </div>
      {settings.assignmentGroups.length === 0 && (
        <div>
          No assignment groups created, create them in the course settings page
        </div>
      )}
      <button type="submit">Create</button>
      {isPending && <Spinner />}
    </form>
  );
}

function addHoursToDate(date: Date, hours: number): Date {
  const newDate = new Date(date.getTime());
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
}
