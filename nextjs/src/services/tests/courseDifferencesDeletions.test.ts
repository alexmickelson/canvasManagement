import { describe, it, expect } from "vitest";
import { LocalCourse } from "@/models/local/localCourse";
import { CourseDifferences } from "../fileStorage/utils/courseDifferences";

describe("CourseDifferencesDeletionsTests", () => {
  // it("same module does not get deleted", () => {
  //   const oldCourse: LocalCourse = {
  //     settings: {
  //       name: "test course",
  //       assignmentGroups: [],
  //       daysOfWeek: [],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: {
  //         hour: 23,
  //         minute: 59,
  //       },
  //     },
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };
  //   const newCourse: LocalCourse = {
  //     ...oldCourse,
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };

  //   const differences = CourseDifferences.getDeletedChanges(
  //     newCourse,
  //     oldCourse
  //   );

  //   expect(differences.namesOfModulesToDeleteCompletely).toHaveLength(0);
  // });

  // it("changed module - old one gets deleted", () => {
  //   const oldCourse: LocalCourse = {
  //     settings: {
  //       name: "test course",
  //       assignmentGroups: [],
  //       daysOfWeek: [],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: {
  //         hour: 23,
  //         minute: 59,
  //       },
  //     },
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };
  //   const newCourse: LocalCourse = {
  //     ...oldCourse,
  //     modules: [
  //       {
  //         name: "test module 2",
  //         assignments: [],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };

  //   const differences = CourseDifferences.getDeletedChanges(
  //     newCourse,
  //     oldCourse
  //   );

  //   expect(differences.namesOfModulesToDeleteCompletely).toHaveLength(1);
  //   expect(differences.namesOfModulesToDeleteCompletely[0]).toBe("test module");
  // });

  // it("new assignment name gets deleted", () => {
  //   const oldCourse: LocalCourse = {
  //     settings: {
  //       name: "test course",
  //       assignmentGroups: [],
  //       daysOfWeek: [],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: {
  //         hour: 23,
  //         minute: 59,
  //       },
  //     },
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [
  //           {
  //             name: "test assignment",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             submissionTypes: [],
  //             allowedFileUploadExtensions: [],
  //             rubric: [],
  //           },
  //         ],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };
  //   const newCourse: LocalCourse = {
  //     ...oldCourse,
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [
  //           {
  //             name: "test assignment changed name",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             submissionTypes: [],
  //             allowedFileUploadExtensions: [],
  //             rubric: [],
  //           },
  //         ],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };

  //   const differences = CourseDifferences.getDeletedChanges(
  //     newCourse,
  //     oldCourse
  //   );

  //   expect(differences.namesOfModulesToDeleteCompletely).toHaveLength(0);
  //   expect(differences.deleteContentsOfModule).toHaveLength(1);
  //   expect(differences.deleteContentsOfModule[0].assignments).toHaveLength(1);
  //   expect(differences.deleteContentsOfModule[0].assignments[0].name).toBe(
  //     "test assignment"
  //   );
  // });

  // it("assignments with changed descriptions do not get deleted", () => {
  //   const oldCourse: LocalCourse = {
  //     settings: {
  //       name: "test course",
  //       assignmentGroups: [],
  //       daysOfWeek: [],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: {
  //         hour: 23,
  //         minute: 59,
  //       },
  //     },
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [
  //           {
  //             name: "test assignment",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             submissionTypes: [],
  //             allowedFileUploadExtensions: [],
  //             rubric: [],
  //           },
  //         ],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };
  //   const newCourse: LocalCourse = {
  //     ...oldCourse,
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [
  //           {
  //             name: "test assignment",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             submissionTypes: [],
  //             allowedFileUploadExtensions: [],
  //             rubric: [],
  //           },
  //         ],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };

  //   const differences = CourseDifferences.getDeletedChanges(
  //     newCourse,
  //     oldCourse
  //   );

  //   expect(differences.deleteContentsOfModule).toHaveLength(0);
  // });

  // it("can detect changed and unchanged assignments", () => {
  //   const oldCourse: LocalCourse = {
  //     settings: {
  //       name: "test course",
  //       assignmentGroups: [],
  //       daysOfWeek: [],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: {
  //         hour: 23,
  //         minute: 59,
  //       },
  //     },
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [
  //           {
  //             name: "test assignment",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             submissionTypes: [],
  //             allowedFileUploadExtensions: [],
  //             rubric: [],
  //           },
  //           {
  //             name: "test assignment 2",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             submissionTypes: [],
  //             allowedFileUploadExtensions: [],
  //             rubric: [],
  //           },
  //         ],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };
  //   const newCourse: LocalCourse = {
  //     ...oldCourse,
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [
  //           {
  //             name: "test assignment",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             submissionTypes: [],
  //             allowedFileUploadExtensions: [],
  //             rubric: [],
  //           },
  //           {
  //             name: "test assignment 2 changed",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             submissionTypes: [],
  //             allowedFileUploadExtensions: [],
  //             rubric: [],
  //           },
  //         ],
  //         quizzes: [],
  //         pages: [],
  //       },
  //     ],
  //   };

  //   const differences = CourseDifferences.getDeletedChanges(
  //     newCourse,
  //     oldCourse
  //   );

  //   expect(differences.deleteContentsOfModule).toHaveLength(1);
  //   expect(differences.deleteContentsOfModule[0].assignments).toHaveLength(1);
  //   expect(differences.deleteContentsOfModule[0].assignments[0].name).toBe(
  //     "test assignment 2"
  //   );
  // });

  // it("changed quizzes get deleted", () => {
  //   const oldCourse: LocalCourse = {
  //     settings: {
  //       name: "test course",
  //       assignmentGroups: [],
  //       daysOfWeek: [],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: {
  //         hour: 23,
  //         minute: 59,
  //       },
  //     },
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [],
  //         quizzes: [
  //           {
  //             name: "Test Quiz",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             shuffleAnswers: false,
  //             showCorrectAnswers: false,
  //             oneQuestionAtATime: false,
  //             allowedAttempts: 0,
  //             questions: [],
  //           },
  //           {
  //             name: "Test Quiz 2",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             shuffleAnswers: false,
  //             showCorrectAnswers: false,
  //             oneQuestionAtATime: false,
  //             allowedAttempts: 0,
  //             questions: [],
  //           },
  //         ],
  //         pages: [],
  //       },
  //     ],
  //   };
  //   const newCourse: LocalCourse = {
  //     ...oldCourse,
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [],
  //         quizzes: [
  //           {
  //             name: "Test Quiz",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             shuffleAnswers: false,
  //             showCorrectAnswers: false,
  //             oneQuestionAtATime: false,
  //             allowedAttempts: 0,
  //             questions: [],
  //           },
  //           {
  //             name: "Test Quiz 3",
  //             description: "test description",
  //             dueAt: "07/09/2024 23:59:00",
  //             shuffleAnswers: false,
  //             showCorrectAnswers: false,
  //             oneQuestionAtATime: false,
  //             allowedAttempts: 0,
  //             questions: [],
  //           },
  //         ],
  //         pages: [],
  //       },
  //     ],
  //   };

  //   const differences = CourseDifferences.getDeletedChanges(
  //     newCourse,
  //     oldCourse
  //   );

  //   expect(differences.deleteContentsOfModule).toHaveLength(1);
  //   expect(differences.deleteContentsOfModule[0].quizzes).toHaveLength(1);
  //   expect(differences.deleteContentsOfModule[0].quizzes[0].name).toBe(
  //     "Test Quiz 2"
  //   );
  // });

  // it("changed pages get deleted", () => {
  //   const oldCourse: LocalCourse = {
  //     settings: {
  //       name: "test course",
  //       assignmentGroups: [],
  //       daysOfWeek: [],
  //       startDate: "07/09/2024 23:59:00",
  //       endDate: "07/09/2024 23:59:00",
  //       defaultDueTime: {
  //         hour: 23,
  //         minute: 59,
  //       },
  //     },
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [],
  //         quizzes: [],
  //         pages: [
  //           {
  //             name: "Test Page",
  //             text: "test contents",
  //             dueAt: "07/09/2024 23:59:00",
  //           },
  //           {
  //             name: "Test Page 2",
  //             text: "test contents",
  //             dueAt: "07/09/2024 23:59:00",
  //           },
  //         ],
  //       },
  //     ],
  //   };
  //   const newCourse: LocalCourse = {
  //     ...oldCourse,
  //     modules: [
  //       {
  //         name: "test module",
  //         assignments: [],
  //         quizzes: [],
  //         pages: [
  //           {
  //             name: "Test Page",
  //             text: "test contents",
  //             dueAt: "07/09/2024 23:59:00",
  //           },
  //           {
  //             name: "Test Page 3",
  //             text: "test contents",
  //             dueAt: "07/09/2024 23:59:00",
  //           },
  //         ],
  //       },
  //     ],
  //   };

  //   const differences = CourseDifferences.getDeletedChanges(
  //     newCourse,
  //     oldCourse
  //   );

  //   expect(differences.deleteContentsOfModule).toHaveLength(1);
  //   expect(differences.deleteContentsOfModule[0].pages).toHaveLength(1);
  //   expect(differences.deleteContentsOfModule[0].pages[0].name).toBe(
  //     "Test Page 2"
  //   );
  // });
});
