import path from "path";
import { describe, it, expect, beforeEach } from "vitest";
import { promises as fs } from "fs";
import {
  DayOfWeek,
  LocalCourse,
  LocalCourseSettings,
} from "@/models/local/localCourse";
import { QuestionType } from "@/models/local/quiz/localQuizQuestion";
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

  it("course settings can be saved and loaded", async () => {
    const name = "test empty course";
    await fileStorageService.createCourseFolderForTesting(name);
    const settings: LocalCourseSettings = {
      name,
      assignmentGroups: [],
      daysOfWeek: [DayOfWeek.Monday, DayOfWeek.Wednesday],
      startDate: "07/09/2024 23:59:00",
      endDate: "07/09/2024 23:59:00",
      defaultDueTime: { hour: 1, minute: 59 },
      canvasId: 0,
    };

    await fileStorageService.settings.updateCourseSettings(name, settings);

    const loadedSettings = await fileStorageService.settings.getCourseSettings(
      name
    );

    expect(loadedSettings).toEqual(settings);
  });

  it("empty course modules can be created", async () => {
    const courseName = "test empty course";
    const moduleName = "test module 1";

    await fileStorageService.modules.createModule(courseName, moduleName);

    const moduleNames = await fileStorageService.modules.getModuleNames(
      courseName
    );

    expect(moduleNames).toContain(moduleName);
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

});
