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

    await fileStorageService.updateCourseSettings(name, settings);

    const loadedSettings = await fileStorageService.getCourseSettings(name);

    expect(loadedSettings).toEqual(settings);
  });

  it("empty course modules can be created", async () => {
    const courseName = "test empty course";
    const moduleName = "test module 1";

    await fileStorageService.createModule(courseName, moduleName);

    const moduleNames = await fileStorageService.getModuleNames(courseName);

    expect(moduleNames).toContain(moduleName);
  });

  // it("course modules with assignments can be saved and loaded", async () => {
  //   const testCourse: LocalCourse = {
  //     settings: {
  //       name: "Test Course with modules and assignments",
  //       assignmentGroups: [],
  //       daysOfWeek: [],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: { hour: 1, minute: 59 },
  //     },
  //     modules: [
  //       {
  //         name: "test module 1 with assignments",
  //         assignments: [
  //           {
  //             name: "test assignment",
  //             description: "here is the description",
  //             dueAt: "07/09/2024 23:59:00",
  //             lockAt: "07/09/2024 23:59:00",
  //             submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
  //             localAssignmentGroupName: "Final Project",
  //             rubric: [
  //               { points: 4, label: "do task 1" },
  //               { points: 2, label: "do task 2" },
  //             ],
  //             allowedFileUploadExtensions: [],
  //           },
  //         ],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };

  //   await fileStorageService.saveCourseAsync(testCourse);

  //   const loadedCourses = await fileStorageService.loadSavedCourses();
  //   const loadedCourse = loadedCourses.find(
  //     (c) => c.settings.name === testCourse.settings.name
  //   );

  //   expect(loadedCourse?.modules[0].assignments).toEqual(
  //     testCourse.modules[0].assignments
  //   );
  // });

  // it("course modules with quizzes can be saved and loaded", async () => {
  //   const testCourse: LocalCourse = {
  //     settings: {
  //       name: "Test Course with modules and quiz",
  //       assignmentGroups: [],
  //       daysOfWeek: [],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: { hour: 1, minute: 59 },
  //     },
  //     modules: [
  //       {
  //         name: "test module 1 with quiz",
  //         assignments: [],
  //         quizzes: [
  //           {
  //             name: "Test Quiz",
  //             description: "quiz description",
  //             lockAt: "07/09/2024 12:05:00",
  //             dueAt: "07/09/2024 12:05:00",
  //             shuffleAnswers: true,
  //             oneQuestionAtATime: true,
  //             localAssignmentGroupName: "Assignments",
  //             questions: [
  //               {
  //                 text: "test essay",
  //                 questionType: QuestionType.ESSAY,
  //                 points: 1,
  //                 answers: [],
  //                 matchDistractors: [],
  //               },
  //             ],
  //             showCorrectAnswers: false,
  //             allowedAttempts: 0,
  //           },
  //         ],
  //         pages: [],
  //       },
  //     ],
  //   };

  //   await fileStorageService.saveCourseAsync(testCourse);

  //   const loadedCourses = await fileStorageService.loadSavedCourses();
  //   const loadedCourse = loadedCourses.find(
  //     (c) => c.settings.name === testCourse.settings.name
  //   );

  //   expect(loadedCourse?.modules[0].quizzes).toEqual(
  //     testCourse.modules[0].quizzes
  //   );
  // });

  // it("markdown storage fully populated does not lose data", async () => {
  //   const testCourse: LocalCourse = {
  //     settings: {
  //       name: "Test Course with lots of data",
  //       assignmentGroups: [],
  //       daysOfWeek: [DayOfWeek.Monday, DayOfWeek.Wednesday],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: { hour: 1, minute: 59 },
  //     },
  //     modules: [
  //       {
  //         name: "new test module",
  //         assignments: [
  //           {
  //             name: "test assignment",
  //             description: "here is the description",
  //             dueAt: "07/09/2024 23:59:00",
  //             lockAt: "07/09/2024 23:59:00",
  //             submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
  //             localAssignmentGroupName: "Final Project",
  //             rubric: [
  //               { points: 4, label: "do task 1" },
  //               { points: 2, label: "do task 2" },
  //             ],
  //             allowedFileUploadExtensions: [],
  //           },
  //         ],
  //         quizzes: [
  //           {
  //             name: "Test Quiz",
  //             description: "quiz description",
  //             lockAt: "07/09/2024 23:59:00",
  //             dueAt: "07/09/2024 23:59:00",
  //             shuffleAnswers: true,
  //             oneQuestionAtATime: false,
  //             localAssignmentGroupName: "someId",
  //             allowedAttempts: -1,
  //             questions: [
  //               {
  //                 text: "test short answer",
  //                 questionType: QuestionType.SHORT_ANSWER,
  //                 points: 1,
  //                 answers: [],
  //                 matchDistractors: [],
  //               },
  //             ],
  //             showCorrectAnswers: false,
  //           },
  //         ],
  //         pages: [],
  //       },
  //     ],
  //   };

  //   await fileStorageService.saveCourseAsync(testCourse);

  //   const loadedCourses = await fileStorageService.loadSavedCourses();
  //   const loadedCourse = loadedCourses.find(
  //     (c) => c.settings.name === testCourse.settings.name
  //   );

  //   expect(loadedCourse).toEqual(testCourse);
  // });

  // it("markdown storage can persist pages", async () => {
  //   const testCourse: LocalCourse = {
  //     settings: {
  //       name: "Test Course with page",
  //       assignmentGroups: [],
  //       daysOfWeek: [DayOfWeek.Monday, DayOfWeek.Wednesday],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: { hour: 1, minute: 59 },
  //     },
  //     modules: [
  //       {
  //         name: "page test module",
  //         assignments: [],
  //         quizzes: [],
  //         pages: [
  //           {
  //             name: "test page persistence",
  //             dueAt: "07/09/2024 23:59:00",
  //             text: "this is some\n## markdown\n",
  //           },
  //         ],
  //       },
  //     ],
  //   };

  //   await fileStorageService.saveCourseAsync(testCourse);

  //   const loadedCourses = await fileStorageService.loadSavedCourses();
  //   const loadedCourse = loadedCourses.find(
  //     (c) => c.settings.name === testCourse.settings.name
  //   );

  //   expect(loadedCourse).toEqual(testCourse);
  // });
});
