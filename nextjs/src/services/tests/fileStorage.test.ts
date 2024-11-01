import { describe, it, expect, beforeEach } from "vitest";
import { promises as fs } from "fs";
import { DayOfWeek, LocalCourseSettings } from "@/models/local/localCourse";
import { fileStorageService } from "../fileStorage/fileStorageService";

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
      defaultAssignmentSubmissionTypes: [],
      defaultFileUploadTypes: [],
      holidays: [],
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
});
