"use client";
import ClientOnly from "@/components/ClientOnly";
import { StoragePathSelector } from "@/components/form/StoragePathSelector";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import { FC, useState } from "react";

export const AddExistingCourseToGlobalSettings = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div className="flex justify-center">
        <button className="" onClick={() => setShowForm((i) => !i)}>
          Add Existing Course
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

const ExistingCourseForm: FC<{}> = () => {
  const [path, setPath] = useState("./");
  return (
    <div>
      <h2>Add Existing Course</h2>
      <StoragePathSelector
        startingValue={path}
        submitValue={setPath}
        label={"Course Directory Path"}
      />
    </div>
  );
};
