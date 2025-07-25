"use client";
import TextInput from "@/components/form/TextInput";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/features/local/course/localCoursesHooks";
import { useState, useEffect } from "react";
import { settingsBox } from "./sharedSettings";

export default function DefaultFileUploadTypes() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const [defaultFileUploadTypes, setDefaultFileUploadTypes] = useState<
    string[]
  >(settings.defaultFileUploadTypes);
  const updateSettings = useUpdateLocalCourseSettingsMutation();

  useEffect(() => {
    const id = setTimeout(() => {
      if (
        JSON.stringify(settings.defaultFileUploadTypes) !==
        JSON.stringify(defaultFileUploadTypes)
      ) {
        updateSettings.mutate({
          settings: {
            ...settings,
            defaultFileUploadTypes: defaultFileUploadTypes,
          },
        });
      }
    }, 500);
    return () => clearTimeout(id);
  }, [defaultFileUploadTypes, settings, updateSettings]);

  return (
    <div className={settingsBox}>
      <div className="text-center">Default File Upload Types</div>

      {defaultFileUploadTypes.map((type, index) => (
        <div key={index} className="flex flex-row gap-3">
          <TextInput
            value={type}
            setValue={(newValue) =>
              setDefaultFileUploadTypes((oldTypes) =>
                oldTypes.map((t, i) => (i === index ? newValue : t))
              )
            }
            label={"Default Type " + index}
          />
        </div>
      ))}
      <div className="flex gap-3 mt-3">
        <button
          className="btn-danger"
          onClick={() => {
            setDefaultFileUploadTypes((old) => old.slice(0, -1));
          }}
        >
          Remove Default File Upload Type
        </button>
        <button
          onClick={() => setDefaultFileUploadTypes((old) => [...old, ""])}
        >
          Add Default File Upload Type
        </button>
      </div>
    </div>
  );
}
