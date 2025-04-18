"use client";

import AssignmentGroupManagement from "./AssignmentGroupManagement";
import DaysOfWeekSettings from "./DaysOfWeekSettings";
import DefaultDueTime from "./DefaultDueTime";
import DefaultFileUploadTypes from "./DefaultFileUploadTypes";
import GithubClassroomList from "./GithubClassroomList";
import HolidayConfig from "./HolidayConfig";
import SettingsHeader from "./SettingsHeader";
import StartAndEndDate from "./StartAndEndDate";
import SubmissionDefaults from "./SubmissionDefaults";

export default function AllSettings() {
  return (
    <>
      <SettingsHeader />
      <DaysOfWeekSettings />
      <StartAndEndDate />
      <GithubClassroomList />
      <SubmissionDefaults />
      <DefaultFileUploadTypes />
      <DefaultDueTime />
      <AssignmentGroupManagement />
      <HolidayConfig />
    </>
  );
}
