import { Expandable } from "@/components/Expandable";
import TextInput from "@/components/form/TextInput";
import { useCreateModuleMutation } from "@/hooks/localCourse/localCourseModuleHooks";
import React, { useState } from "react";

export default function CreateModule() {
  const createModule = useCreateModuleMutation();
  const [moduleName, setModuleName] = useState("");
  return (
    <>
      <Expandable
        ExpandableElement={({ setIsExpanded, isExpanded }) => (
          <button onClick={() => setIsExpanded((v) => !v)}>
            {isExpanded ? "Hide Form" : "Create Module"}
          </button>
        )}
      >
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
      </Expandable>
    </>
  );
}
