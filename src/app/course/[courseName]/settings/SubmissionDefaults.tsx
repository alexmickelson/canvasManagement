"use client";
import SelectInput from "@/components/form/SelectInput";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import {
  AssignmentSubmissionType,
  AssignmentSubmissionTypeList,
} from "@/features/local/assignments/models/assignmentSubmissionType";
import React, { useEffect, useState } from "react";
import { settingsBox } from "./sharedSettings";

export default function SubmissionDefaults() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const [defaultSubmissionTypes, setDefaultSubmissionTypes] = useState<
    AssignmentSubmissionType[]
  >(settings.defaultAssignmentSubmissionTypes);
  const updateSettings = useUpdateLocalCourseSettingsMutation();

  useEffect(() => {
    if (
      JSON.stringify(settings.defaultAssignmentSubmissionTypes) !==
      JSON.stringify(defaultSubmissionTypes)
    ) {
      updateSettings.mutate({
        settings: {
          ...settings,
          defaultAssignmentSubmissionTypes: defaultSubmissionTypes,
        },
      });
    }
  }, [defaultSubmissionTypes, settings, updateSettings]);

  return (
    <div className={settingsBox}>
      <div className="text-center">Default Assignment Submission Type</div>

      {defaultSubmissionTypes.map((type, index) => (
        <div key={index} className="flex flex-row gap-3">
          <SelectInput
            value={type}
            setValue={(newType) => {
              if (newType)
                setDefaultSubmissionTypes((oldTypes) =>
                  oldTypes.map((t, i) => (i === index ? newType : t))
                );
            }}
            label={""}
            options={AssignmentSubmissionTypeList}
            getOptionName={(t) => t}
          />
        </div>
      ))}
      <div className="flex gap-3 mt-3">
        <button
          className="btn-danger"
          onClick={() => {
            setDefaultSubmissionTypes((old) => old.slice(0, -1));
          }}
        >
          Remove Default Type
        </button>
        <button
          onClick={() =>
            setDefaultSubmissionTypes((old) => [
              ...old,
              AssignmentSubmissionType.NONE,
            ])
          }
        >
          Add Default Type
        </button>
      </div>
    </div>
  );
}
