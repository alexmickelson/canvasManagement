"use client"

import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import AssignmentGroupManagement from "./AssignmentGroupManagement";
import DaysOfWeekSettings from "./DaysOfWeekSettings";
import DefaultDueTime from "./DefaultDueTime";
import DefaultFileUploadTypes from "./DefaultFileUploadTypes";
import HolidayConfig from "./HolidayConfig";
import SettingsHeader from "./SettingsHeader";
import StartAndEndDate from "./StartAndEndDate";
import SubmissionDefaults from "./SubmissionDefaults";
import { Fragment } from "react";

export default function AllSettings() {
  const [_, { dataUpdatedAt }] = useLocalCourseSettingsQuery();
  return (
    <Fragment key={dataUpdatedAt}>
      <SettingsHeader />
      <DaysOfWeekSettings />
      <StartAndEndDate />
      <SubmissionDefaults />
      <DefaultFileUploadTypes />
      <DefaultDueTime />
      <AssignmentGroupManagement />
      <HolidayConfig />
    </Fragment>
  );
}
