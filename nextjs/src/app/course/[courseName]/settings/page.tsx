import React from "react";
import { useCourseContext } from "../context/courseContext";
import StartAndEndDate from "./StartAndEndDate";
import SettingsHeader from "./SettingsHeader";
import DefaultDueTime from "./DefaultDueTime";

export default function page() {
  return (
    <div>
      <SettingsHeader />
      <StartAndEndDate />
      <DefaultDueTime />
    </div>
  );
}
