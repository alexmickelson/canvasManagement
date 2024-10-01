import React from "react";
import { useCourseContext } from "../context/courseContext";
import StartAndEndDate from "./StartAndEndDate";
import SettingsHeader from "./SettingsHeader";
import DefaultDueTime from "./DefaultDueTime";
import DaysOfWeekSettings from "./DaysOfWeekSettings";
import AssignmentGroupManagement from "./AssignmentGroupManagement";
import SubmissionDefaults from "./SubmissionDefaults";
import DefaultFileUploadTypes from "./DefaultFileUploadTypes";

export default function page() {
  return (
    <div className="flex justify-center">
      <div className=" w-fit mt-5">
        <SettingsHeader />
        <DaysOfWeekSettings />
        <StartAndEndDate />
        <SubmissionDefaults />
        <DefaultFileUploadTypes />
        <DefaultDueTime />
        <AssignmentGroupManagement />
      </div>
    </div>
  );
}
