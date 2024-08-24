import { describe, it, expect } from "vitest";
import { LocalCourse } from "@/models/local/localCourse";
import { CourseDifferences } from "../fileStorage/utils/courseDifferences";
import { AssignmentSubmissionType } from "@/models/local/assignmnet/assignmentSubmissionType";

describe("CourseDifferencesChangesTests", () => {
  it("can detect new settings", () => {
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: "09/07/2024 23:59:00",
        endDate: "09/07/2024 23:59:00",
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
      settings: {
        ...oldCourse.settings,
        name: "new course name",
      },
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).toHaveLength(0);
    expect(differences.settings).not.toBeNull();
    expect(differences.settings?.name).toBe("new course name");
  });

  it("can detect new module", () => {
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: "09/07/2024 23:59:00",
        endDate: "09/07/2024 23:59:00",
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [],
          pages: [],
        },
      ],
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).not.toBeNull();
    expect(differences.modules).toHaveLength(1);
    expect(differences.modules?.[0].name).toBe("new module");
  });

  it("can detect changed assignment", () => {
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: "09/07/2024 23:59:00",
        endDate: "09/07/2024 23:59:00",
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [
        {
          name: "new module",
          assignments: [
            {
              name: "test assignment",
              description: "",
              dueAt: "09/07/2024 23:59:00",
              submissionTypes: [],
              allowedFileUploadExtensions: [],
              rubric: [],
            },
          ],
          quizzes: [],
          pages: [],
        },
      ],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
      modules: [
        {
          name: "new module",
          assignments: [
            {
              name: "test assignment",
              description: "new description",
              dueAt: "09/07/2024 23:59:00",
              submissionTypes: [],
              allowedFileUploadExtensions: [],
              rubric: [],
            },
          ],
          quizzes: [],
          pages: [],
        },
      ],
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).not.toBeNull();
    expect(differences.modules).toHaveLength(1);
    expect(differences.modules?.[0].assignments?.[0].description).toBe(
      "new description"
    );
  });

  it("can properly ignore unchanged modules", () => {
    const commonDate = "09/07/2024 23:59:00";
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: commonDate,
        endDate: commonDate,
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [
        {
          name: "new module",
          assignments: [
            {
              name: "test assignment",
              description: "",
              dueAt: commonDate,
              submissionTypes: [],
              allowedFileUploadExtensions: [],
              rubric: [],
            },
          ],
          quizzes: [],
          pages: [],
        },
      ],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).toHaveLength(0);
  });

  it("only changed assignment represented", () => {
    const commonDate = "09/07/2024 23:59:00";
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: commonDate,
        endDate: commonDate,
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [
        {
          name: "new module",
          assignments: [
            {
              name: "test assignment",
              description: "",
              dueAt: commonDate,
              submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
              allowedFileUploadExtensions: [],
              rubric: [{ points: 1, label: "rubric" }],
            },
            {
              name: "test assignment 2",
              description: "",
              dueAt: commonDate,
              submissionTypes: [],
              allowedFileUploadExtensions: [],
              rubric: [],
            },
          ],
          quizzes: [],
          pages: [],
        },
      ],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
      modules: [
        {
          name: "new module",
          assignments: [
            {
              name: "test assignment",
              description: "",
              dueAt: commonDate,
              submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
              allowedFileUploadExtensions: [],
              rubric: [{ points: 1, label: "rubric" }],
            },
            {
              name: "test assignment 2 with a new name",
              description: "",
              dueAt: commonDate,
              submissionTypes: [],
              allowedFileUploadExtensions: [],
              rubric: [],
            },
          ],
          quizzes: [],
          pages: [],
        },
      ],
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).toHaveLength(1);
    expect(differences.modules?.[0].assignments).toHaveLength(1);
    expect(differences.modules?.[0].assignments?.[0].name).toBe(
      "test assignment 2 with a new name"
    );
  });

  it("identical quizzes ignored", () => {
    const commonDate = "09/07/2024 23:59:00";
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: commonDate,
        endDate: commonDate,
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [
            {
              name: "Test Quiz",
              description: "this is my description",
              dueAt: commonDate,
              shuffleAnswers: true,
              showCorrectAnswers: false,
              oneQuestionAtATime: false,
              allowedAttempts: -1,
              questions: [],
            },
          ],
          pages: [],
        },
      ],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).toHaveLength(0);
  });

  it("can detect different quiz", () => {
    const commonDate = "09/07/2024 23:59:00";
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: commonDate,
        endDate: commonDate,
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [
            {
              name: "Test Quiz",
              description: "this is my description",
              dueAt: commonDate,
              shuffleAnswers: true,
              showCorrectAnswers: false,
              oneQuestionAtATime: false,
              allowedAttempts: -1,
              questions: [],
            },
          ],
          pages: [],
        },
      ],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [
            {
              name: "Test Quiz",
              description: "this is my description",
              dueAt: commonDate,
              shuffleAnswers: true,
              showCorrectAnswers: false,
              oneQuestionAtATime: false,
              allowedAttempts: -1,
              questions: [],
              lockAt: "12/31/9999 23:59:59",
            },
          ],
          pages: [],
        },
      ],
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).toHaveLength(1);
    expect(differences.modules?.[0].quizzes).toHaveLength(1);
    expect(differences.modules?.[0].quizzes?.[0].lockAt).toBe(
      "12/31/9999 23:59:59"
    );
  });

  it("can detect only different quiz when other quizzes stay", () => {
    const commonDate = "09/07/2024 23:59:00";
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: commonDate,
        endDate: commonDate,
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [
            {
              name: "Test Quiz",
              description: "this is my description",
              dueAt: commonDate,
              shuffleAnswers: true,
              showCorrectAnswers: false,
              oneQuestionAtATime: false,
              allowedAttempts: -1,
              questions: [],
            },
          ],
          pages: [],
        },
      ],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [
            {
              name: "Test Quiz",
              description: "this is my description",
              dueAt: commonDate,
              shuffleAnswers: true,
              showCorrectAnswers: false,
              oneQuestionAtATime: false,
              allowedAttempts: -1,
              questions: [],
            },
            {
              name: "Test Quiz 2",
              description: "this is my description",
              dueAt: commonDate,
              shuffleAnswers: true,
              showCorrectAnswers: false,
              oneQuestionAtATime: false,
              allowedAttempts: -1,
              questions: [],
            },
          ],
          pages: [],
        },
      ],
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).toHaveLength(1);
    expect(differences.modules?.[0].quizzes).toHaveLength(1);
    expect(differences.modules?.[0].quizzes?.[0].name).toBe("Test Quiz 2");
  });

  it("same pages not detected", () => {
    const commonDate = "09/07/2024 23:59:00";
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: commonDate,
        endDate: commonDate,
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [],
          pages: [
            {
              name: "test page",
              text: "test description",
              dueAt: commonDate,
            },
          ],
        },
      ],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).toHaveLength(0);
  });

  it("different page detected", () => {
    const commonDate = "09/07/2024 23:59:00";
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: commonDate,
        endDate: commonDate,
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [],
          pages: [
            {
              name: "test page",
              text: "test description",
              dueAt: commonDate,
            },
          ],
        },
      ],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [],
          pages: [
            {
              name: "test page",
              text: "test description changed",
              dueAt: commonDate,
            },
          ],
        },
      ],
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).toHaveLength(1);
    expect(differences.modules?.[0].pages).toHaveLength(1);
    expect(differences.modules?.[0].pages?.[0].text).toBe(
      "test description changed"
    );
  });

  it("different page detected but not same page", () => {
    const commonDate = "09/07/2024 23:59:00";
    const oldCourse: LocalCourse = {
      settings: {
        name: "Test Course",
        assignmentGroups: [],
        daysOfWeek: [],
        startDate: commonDate,
        endDate: commonDate,
        defaultDueTime: {
          hour: 23,
          minute: 59,
        },
      },
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [],
          pages: [
            {
              name: "test page",
              text: "test description",
              dueAt: commonDate,
            },
          ],
        },
      ],
    };
    const newCourse: LocalCourse = {
      ...oldCourse,
      modules: [
        {
          name: "new module",
          assignments: [],
          quizzes: [],
          pages: [
            {
              name: "test page",
              text: "test description",
              dueAt: commonDate,
            },
            {
              name: "test page 2",
              text: "test description",
              dueAt: commonDate,
            },
          ],
        },
      ],
    };

    const differences = CourseDifferences.getNewChanges(newCourse, oldCourse);

    expect(differences.modules).toHaveLength(1);
    expect(differences.modules?.[0].pages).toHaveLength(1);
    expect(differences.modules?.[0].pages?.[0].name).toBe("test page 2");
  });
});
