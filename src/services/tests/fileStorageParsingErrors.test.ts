import { describe, it, expect, beforeEach } from "vitest";
import { promises as fs } from "fs";
import { fileStorageService } from "../fileStorage/fileStorageService";
import { basePath } from "../fileStorage/utils/fileSystemUtils";

describe("FileStorageTests", () => {
  beforeEach(async () => {
    const storageDirectory =
      process.env.STORAGE_DIRECTORY ?? "/tmp/canvasManagerTests";
    try {
      await fs.access(storageDirectory);
      await fs.rm(storageDirectory, { recursive: true });
    } catch (error) {}
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
    await fileStorageService.modules.createModule(courseName, moduleName);

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

    const quizzes = await fileStorageService.quizzes.getQuizzes(
      courseName,
      moduleName
    );
    const quizNames = quizzes.map((q) => q.name);

    expect(quizNames).not.includes("testQuiz");
    expect(quizNames).include("validQuiz");
  });

  // it("invalid quizes give error messages", async () => {
  //   const courseName = "testCourse";
  //   const moduleName = "testModule";
  //   const invalidQuizMarkdown = "name: testQuiz\n---\nnot a quiz";
  //   await fileStorageService.createCourseFolderForTesting(courseName);
  //   await fileStorageService.modules.createModule(courseName, moduleName);

  //   await fs.mkdir(`${basePath}/${courseName}/${moduleName}/quizzes`, {
  //     recursive: true,
  //   });
  //   await fs.writeFile(
  //     `${basePath}/${courseName}/${moduleName}/quizzes/testQuiz.md`,
  //     invalidQuizMarkdown
  //   );
    
  //   const invalidReasons = await fileStorageService.quizzes.getInvalidQuizzes(
  //     courseName,
  //     moduleName
  //   );
  //   const invalidQuiz = invalidReasons.filter((q) => q.quizName === "testQuiz");

  //   expect(invalidQuiz.reason).is("testQuiz");
  // });

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
description
## Rubric
- 2pts: animation has at least 5 transition states
`;
    const invalidAssignment = "name: invalidAssignment\n---\nnot an assignment";
    await fileStorageService.createCourseFolderForTesting(courseName);
    await fileStorageService.modules.createModule(courseName, moduleName);

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

    const assignments = await fileStorageService.assignments.getAssignments(
      courseName,
      moduleName
    );
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
    await fileStorageService.modules.createModule(courseName, moduleName);

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

    const pages = await fileStorageService.pages.getPages(
      courseName,
      moduleName
    );
    const assignmentNames = pages.map((q) => q.name);

    expect(assignmentNames).include("validPage");
    expect(assignmentNames).not.includes("invalidPage");
  });
});
