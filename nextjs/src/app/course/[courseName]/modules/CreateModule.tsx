import TextInput from "@/components/form/TextInput";
import { useCreateModuleMutation } from "@/hooks/localCourse/localCourseModuleHooks";
import React, { useState } from "react";

export default function CreateModule() {
  const createModule = useCreateModuleMutation();
  const [showForm, setShowForm] = useState(false);
  const [moduleName, setModuleName] = useState("");
  return (
    <>
      <button onClick={() => setShowForm((v) => !v)}>
        {showForm ? "Hide Form" : "Create Module"}
      </button>
      <div className={"collapsible " + (showForm ? "expand" : "")}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (moduleName) {
              await createModule.mutateAsync(moduleName);
              setModuleName("");
            }
          }}
          className="p-1 border border-slate-500 rounded-md my-1 flex flex-row gap-3 justify-between"
        >
          <TextInput
            className="flex-grow"
            value={moduleName}
            setValue={setModuleName}
            label={"New Module Name"}
          />
          <button className="mt-auto">Add</button>
        </form>
      </div>
    </>
  );
}