"use client";
import React, { useState } from "react";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import AddNewCourseToGlobalSettingsForm from "./AddCourseToGlobalSettingsForm";
import ClientOnly from "@/components/ClientOnly";

export default function AddCourseToGlobalSettings() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex justify-center">
        <button className="" onClick={() => setShowForm((i) => !i)}>
          {showForm ? "Hide Form" : "Add New Course"}
          
        </button>
      </div>

      <div className={" collapsible " + (showForm && "expand")}>
        <div className="border rounded-md p-3 m-3">
          <SuspenseAndErrorHandling>
            <ClientOnly>
              {showForm && <AddNewCourseToGlobalSettingsForm />}
            </ClientOnly>
          </SuspenseAndErrorHandling>
        </div>
      </div>
    </div>
  );
}
