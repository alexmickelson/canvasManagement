"use client";
import SelectInput from "@/components/form/SelectInput";
import { useCanvasTermsQuery } from "@/hooks/canvas/canvasHooks";
import React, { useState } from "react";
import NewCourseForm from "./NewCourseForm";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";

export default function AddNewCourse() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Add New Course</button>

      <div className={" collapsable " + (showForm && "expand")}>
        <div className="border rounded-md p-3 m-3">

        <SuspenseAndErrorHandling>
          {showForm && <NewCourseForm />}
        </SuspenseAndErrorHandling>
        </div>
      </div>
    </div>
  );
}
