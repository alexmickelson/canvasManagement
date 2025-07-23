"use client";
import { AssignmentSubmissionType } from "@/features/local/assignments/models/assignmentSubmissionType";
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


## Markdown
You can use markdown to format your assignment description. For example, you can make lists like this:
- Item 1
- Item 2
- Item 3

**Bold text**

*Italic text*

[Link to Canvas](https://canvas.instructure.com)


\`Inline code\`

> Blockquote

---

1. First item
2. Second item
3. Third item

you can make mermaid diagrams like this:

\`\`\`mermaid
flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
\`\`\`

## github classroom links will be replaced by the GithubClassroomAssignmentShareLink setting

[Github Classroom](insert_github_classroom_url)

## Rubric

- 1pt: singular point
- 1pts: plural points
- 10pts: (extra credit) extra credit points
- 10pts: (Extra Credit) Caps also works`;
  return helpString;
}
