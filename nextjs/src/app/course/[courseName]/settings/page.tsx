import React from "react";
import { useCourseContext } from "../context/courseContext";
import StartAndEndDate from "./StartAndEndDate";
import SettingsHeader from "./SettingsHeader";
import DefaultDueTime from "./DefaultDueTime";
import DaysOfWeekSettings from "./DaysOfWeekSettings";
import AssignmentGroupManagement from "./AssignmentGroupManagement";
import SubmissionDefaults from "./SubmissionDefaults";
import DefaultFileUploadTypes from "./DefaultFileUploadTypes";
import HolidayConfig from "./HolidayConfig";

export default function page() {
  return (
    <div className="flex justify-center h-full overflow-auto pt-5  ">
      <div className=" w-fit ">
        <SettingsHeader />
        <DaysOfWeekSettings />
        <StartAndEndDate />
        <SubmissionDefaults />
        <DefaultFileUploadTypes />
        <DefaultDueTime />
        <AssignmentGroupManagement />
        <HolidayConfig />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
