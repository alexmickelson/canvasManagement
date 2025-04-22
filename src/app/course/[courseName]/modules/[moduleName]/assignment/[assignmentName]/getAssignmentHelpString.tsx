"use client";
import { AssignmentSubmissionType } from "@/models/local/assignment/assignmentSubmissionType";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";

export function getAssignmentHelpString(settings: LocalCourseSettings) {
  const groupNames = settings.assignmentGroups.map((g) => g.name).join("\n- ");
  const helpString = `
Assignment Group Names:
- ${groupNames}
SubmissionTypes:
- ${AssignmentSubmissionType.ONLINE_TEXT_ENTRY}
- ${AssignmentSubmissionType.ONLINE_UPLOAD}
- ${AssignmentSubmissionType.DISCUSSION_TOPIC}
AllowedFileUploadExtensions:
- pdf
- jpg
- jpeg
- png
---

description goes here

## Rubric
- 1pt: singular point
- 1pts: plural points
- 10pts: (extra credit) extra credit points
- 10pts: (Extra Credit) Caps also works`;
  return helpString;
}
