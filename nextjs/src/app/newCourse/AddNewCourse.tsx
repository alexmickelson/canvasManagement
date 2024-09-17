"use client";
import React, { useState } from "react";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import NewCourseForm from "./NewCourseForm";
import ClientOnly from "@/components/ClientOnly";

export default function AddNewCourse() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Add New Course</button>

      <div className={" collapsible " + (showForm && "expand")}>
        <div className="border rounded-md p-3 m-3">
          <SuspenseAndErrorHandling>
            <ClientOnly>{showForm && <NewCourseForm />}</ClientOnly>
          </SuspenseAndErrorHandling>
        </div>
      </div>
    </div>
  );
}
