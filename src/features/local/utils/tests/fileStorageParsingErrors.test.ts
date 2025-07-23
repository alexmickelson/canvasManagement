import { describe, it, expect, beforeEach } from "vitest";
import { promises as fs } from "fs";
import { fileStorageService } from "../fileStorageService";
import { basePath } from "../fileSystemUtils";
import { courseItemFileStorageService } from "@/features/local/course/courseItemFileStorageService";
import { createModuleFile } from "@/features/local/modules/moduleRouter";

describe("FileStorageTests", () => {
  beforeEach(async () => {
    const storageDirectory =
      process.env.STORAGE_DIRECTORY ?? "/tmp/canvasManagerTests";
    process.env.GLOBAL_SETTINGS = `courses:
      - path: testCourse
        name: testCourse`;
    try {
      await fs.access(storageDirectory);
      await fs.rm(storageDirectory, { recursive: true });
    } catch {}
    await fs.mkdir(storageDirectory, { recursive: true });
  });

  it("invalid quizzes do not get loaded", async () => {
    const courseName = "testCourse";
    const moduleName = "testModule";
    const validQuizMarkdown = `Name: validQuiz
LockAt: 08/28/2024 23:59:00
DueAt: 08/28/2024 23:59:00
Password: 
ShuffleAnswers: true
ShowCorrectAnswers: false
OneQuestionAtATime: false
AssignmentGroup: Assignments
AllowedAttempts: -1
Description: Repeat this quiz until you can complete it without notes/help.
---
Points: 0.25

An empty string is 

a) truthy
*b) falsy
`;
    const invalidQuizMarkdown = "name: testQuiz\n---\nnot a quiz";
    await fileStorageService.createCourseFolderForTesting(courseName);
    await createModuleFile(courseName, moduleName);

    await fs.mkdir(`${basePath}/${courseName}/${moduleName}/quizzes`, {
      recursive: true,
    });
    await fs.writeFile(
      `${basePath}/${courseName}/${moduleName}/quizzes/testQuiz.md`,
      invalidQuizMarkdown
    );
    await fs.writeFile(
      `${basePath}/${courseName}/${moduleName}/quizzes/validQuiz.md`,
      validQuizMarkdown
    );

    const quizzes = await courseItemFileStorageService.getItems({
      courseName,
      moduleName,
      type: "Quiz",
    });
    const quizNames = quizzes.map((q) => q.name);

    expect(quizNames).not.includes("testQuiz");
    expect(quizNames).include("validQuiz");
  });

  it("invalid assignments dont get loaded", async () => {
    const courseName = "testCourse";
    const moduleName = "testModule";
    const validAssignmentMarkdown = `Name: testAssignment
LockAt: 09/19/2024 23:59:00
DueAt: 09/19/2024 23:59:00
AssignmentGroupName: Assignments
SubmissionTypes:
- online_text_entry
- online_upload
AllowedFileUploadExtensions:
- pdf
---
this is the test description
## Rubric
- 2pts: animation has at least 5 transition states
`;
    const invalidAssignment = "name: invalidAssignment\n---\nnot an assignment";
    await fileStorageService.createCourseFolderForTesting(courseName);
    await createModuleFile(courseName, moduleName);

    await fs.mkdir(`${basePath}/${courseName}/${moduleName}/assignments`, {
      recursive: true,
    });
    await fs.writeFile(
      `${basePath}/${courseName}/${moduleName}/assignments/testAssignment.md`,
      validAssignmentMarkdown
    );
    await fs.writeFile(
      `${basePath}/${courseName}/${moduleName}/assignments/invalidAssignment.md`,
      invalidAssignment
    );

    const assignments = await courseItemFileStorageService.getItems({
      courseName,
      moduleName,
      type: "Assignment",
    });
    const assignmentNames = assignments.map((q) => q.name);

    expect(assignmentNames).not.includes("invalidAssignment");
    expect(assignmentNames).include("testAssignment");
  });

  it("invalid pages dont get loaded", async () => {
    const courseName = "testCourse";
    const moduleName = "testModule";
    const validPageMarkdown = `Name: validPage
DueDateForOrdering: 08/31/2024 23:59:00
---
# Deploying React
`;
    const invalidPageMarkdown = `Name: invalidPage
DueDateFo59:00
---
# Deploying React`;
    await fileStorageService.createCourseFolderForTesting(courseName);
    await createModuleFile(courseName, moduleName);

    await fs.mkdir(`${basePath}/${courseName}/${moduleName}/pages`, {
      recursive: true,
    });
    await fs.writeFile(
      `${basePath}/${courseName}/${moduleName}/pages/validPage.md`,
      validPageMarkdown
    );
    await fs.writeFile(
      `${basePath}/${courseName}/${moduleName}/pages/invalidPage.md`,
      invalidPageMarkdown
    );

    const pages = await courseItemFileStorageService.getItems({
      courseName,
      moduleName,
      type: "Page",
    });
    const assignmentNames = pages.map((q) => q.name);

    expect(assignmentNames).include("validPage");
    expect(assignmentNames).not.includes("invalidPage");
  });
});
