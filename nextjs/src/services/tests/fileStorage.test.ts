import path from "path";
import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import {
  DayOfWeek,
  LocalCourse,
  LocalCourseSettings,
} from "@/models/local/localCourse";
import { QuestionType } from "@/models/local/quiz/localQuizQuestion";
import { fileStorageService } from "../fileStorage/fileStorageService";
import { basePath } from "../fileStorage/utils/fileSystemUtils";

describe("FileStorageTests", () => {
  beforeEach(() => {
    const storageDirectory =
      process.env.STORAGE_DIRECTORY ?? "/tmp/canvasManagerTests";
    if (fs.existsSync(storageDirectory)) {
      fs.rmdirSync(storageDirectory, { recursive: true });
    }
    fs.mkdirSync(storageDirectory, { recursive: true });
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
    const invalidQuizMarkdown = "not a quiz";
    await fileStorageService.createCourseFolderForTesting(courseName);
    await fileStorageService.modules.createModule(courseName, "testModule");
    // fs.writeFile(`${basePath}/${courseName}/testModule/testQuiz.md`, invalidQuizMarkdown)
  });
});
