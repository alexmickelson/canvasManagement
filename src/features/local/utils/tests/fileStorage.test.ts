import { describe, it, expect, beforeEach } from "vitest";
import { promises as fs } from "fs";
import { fileStorageService } from "../fileStorageService";
import {
  LocalCourseSettings,
  DayOfWeek,
} from "@/features/local/course/localCourseSettings";
import {
  createModuleFile,
  getModuleNamesFromFiles,
} from "@/features/local/modules/moduleRouter";

describe("FileStorageTests", () => {
  beforeEach(async () => {
    const storageDirectory =
      process.env.STORAGE_DIRECTORY ?? "/tmp/canvasManagerTests";
    process.env.GLOBAL_SETTINGS = `courses:
      - path: test empty course
        name: test empty course`;
    try {
      await fs.access(storageDirectory);
      await fs.rm(storageDirectory, { recursive: true });
    } catch {}
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
      assets: [],
    };

    await fileStorageService.settings.updateCourseSettings(name, settings);

    const loadedSettings = await fileStorageService.settings.getCourseSettings({
      name,
      path: name,
    });

    expect(loadedSettings).toEqual(settings);
  });

  it("empty course modules can be created", async () => {
    const courseName = "test empty course";
    const moduleName = "test module 1";

    await createModuleFile(courseName, moduleName);

    const moduleNames = await getModuleNamesFromFiles(courseName);

    expect(moduleNames).toContain(moduleName);
  });
});
