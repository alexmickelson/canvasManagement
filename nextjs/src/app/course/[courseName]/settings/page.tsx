import React from "react";
import { useCourseContext } from "../context/courseContext";
import StartAndEndDate from "./StartAndEndDate";
import SettingsHeader from "./SettingsHeader";
import DefaultDueTime from "./DefaultDueTime";
import DaysOfWeekSelector from "./DaysOfWeekSelector";

export default function page() {
  return (
    <div>
      <SettingsHeader />
      <DaysOfWeekSelector />
      <StartAndEndDate />
      <DefaultDueTime />
    </div>
  );
}
