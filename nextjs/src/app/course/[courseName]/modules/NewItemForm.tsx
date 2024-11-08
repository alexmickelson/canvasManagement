"use client";
import ButtonSelect from "@/components/ButtonSelect";
import SelectInput from "@/components/form/SelectInput";
import TextInput from "@/components/form/TextInput";
import { Spinner } from "@/components/Spinner";
import { useCreateAssignmentMutation } from "@/hooks/localCourse/assignmentHooks";
import { useCreateItemMutation } from "@/hooks/localCourse/courseItemHooks";
import { useModuleNamesQuery } from "@/hooks/localCourse/localCourseModuleHooks";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { useCreatePageMutation } from "@/hooks/localCourse/pageHooks";
import { LocalAssignmentGroup } from "@/models/local/assignment/localAssignmentGroup";
import {
  dateToMarkdownString,
  getDateFromString,
  getDateFromStringOrThrow,
} from "@/models/local/timeUtils";
import { trpc } from "@/services/trpc/utils";
import React, { useState } from "react";
import { useCourseContext } from "../context/courseContext";

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
  const assignmentCreationMutation = useCreateAssignmentMutation({
    courseName,
    moduleName: defaultModuleName ?? "",
  });

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
  const createQuiz = useCreateItemMutation("Quiz");

  const isPending =
    assignmentCreationMutation.isPending ||
    createPage.isPending ||
    createQuiz.isPending;

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

        console.log("submitting");
        if (!moduleName) {
          return;
        }
        if (type === "Assignment") {
          // createAssignment.mutate({
          //   item: {
          //     name,
          //     description: "",
          //     localAssignmentGroupName: assignmentGroup?.name ?? "",
          //     dueAt,
          //     lockAt,
          //     submissionTypes: settings.defaultAssignmentSubmissionTypes,
          //     allowedFileUploadExtensions: settings.defaultFileUploadTypes,
          //     rubric: [],
          //   },
          //   moduleName: moduleName,
          //   itemName: name,
          // });
          assignmentCreationMutation.mutate({
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
            item: {
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
            itemName: name,
          });
        } else if (type === "Page") {
          createPage.mutate({
            item: {
              name,
              text: "",
              dueAt,
            },
            moduleName: moduleName,
            itemName: name,
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
          getName={(o) => o?.toString() ?? ""}
          setSelectedOption={(t) => setType(t ?? "Assignment")}
          selectedOption={type}
        />
      </div>
      <div>
        <TextInput label={type + " Name"} value={name} setValue={setName} />
      </div>
      <div>
        {type !== "Page" && (
          <ButtonSelect
            options={settings.assignmentGroups}
            getName={(g) => g?.name ?? ""}
            setSelectedOption={setAssignmentGroup}
            selectedOption={assignmentGroup}
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
