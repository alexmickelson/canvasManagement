"use client";
import ClientOnly from "@/components/ClientOnly";
import { StoragePathSelector } from "@/components/form/StoragePathSelector";
import TextInput from "@/components/form/TextInput";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import {
  useGlobalSettingsQuery,
  useUpdateGlobalSettingsMutation,
} from "@/features/local/globalSettings/globalSettingsHooks";
import { useDirectoryIsCourseQuery } from "@/features/local/utils/storageDirectoryHooks";
import { FC, useEffect, useRef, useState } from "react";

export const AddExistingCourseToGlobalSettings = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div className="flex justify-center">
        <button className="" onClick={() => setShowForm((i) => !i)}>
          {showForm ? "Hide Form" : "Import Existing Course"}
        </button>
      </div>

      <div className={" collapsible " + (showForm && "expand")}>
        <div className="border rounded-md p-3 m-3">
          <SuspenseAndErrorHandling>
            <ClientOnly>{showForm && <ExistingCourseForm />}</ClientOnly>
          </SuspenseAndErrorHandling>
        </div>
      </div>
    </div>
  );
};

const ExistingCourseForm: FC<object> = () => {
  const [path, setPath] = useState("./");
  const [name, setName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const directoryIsCourseQuery = useDirectoryIsCourseQuery(path);
  const { data: globalSettings } = useGlobalSettingsQuery();
  const updateSettingsMutation = useUpdateGlobalSettingsMutation();

  // Focus name input when directory becomes a valid course
  useEffect(() => {
    console.log("Checking directory:", directoryIsCourseQuery.data);
    if (directoryIsCourseQuery.data) {
      console.log("Focusing name input");
      nameInputRef.current?.focus();
    }
  }, [directoryIsCourseQuery.data]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log(path);

        await updateSettingsMutation.mutateAsync({
          globalSettings: {
            ...globalSettings,
            courses: [
              ...globalSettings.courses,
              {
                name,
                path,
              },
            ],
          },
        });
        setName("");
        setPath("./");
      }}
      className="min-w-3xl"
    >
      <h2>Add Existing Course</h2>

      <div className="flex items-center mt-2 text-slate-500">
        {directoryIsCourseQuery.isLoading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            <span>Checking directory...</span>
          </>
        ) : directoryIsCourseQuery.data ? (
          <>
            <span className="text-green-600 mr-2">✅</span>
            <span>This is a valid course directory.</span>
          </>
        ) : (
          <>
            <span className="text-red-600 mr-2">❌</span>
            <span>Not a course directory.</span>
          </>
        )}
      </div>
      <StoragePathSelector
        value={path}
        setValue={setPath}
        label={"Course Directory Path"}
      />
      {directoryIsCourseQuery.data && (
        <>
          <TextInput
            value={name}
            setValue={setName}
            label={"Display Name"}
            inputRef={nameInputRef}
          />
          <div className="text-center">
            <button className="text-center mt-3">Save</button>
          </div>
        </>
      )}
    </form>
  );
};
