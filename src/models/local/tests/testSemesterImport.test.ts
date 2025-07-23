import { describe, it, expect } from "vitest";
import { LocalAssignment } from "../../../features/local/assignments/models/localAssignment";
import {
  prepAssignmentForNewSemester,
  prepLectureForNewSemester,
  prepPageForNewSemester,
  prepQuizForNewSemester,
} from "../utils/semesterTransferUtils";
import { Lecture } from "../lecture";
import { LocalCoursePage } from "@/features/local/pages/localCoursePageModels";
import { LocalQuiz } from "@/features/local/quizzes/models/localQuiz";

describe("can take an assignment and template it for a new semester", () => {
  it("can sanitize assignment github classroom repo url", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: `
## test description 

[GitHub Classroom Assignment](https://classroom.github.com/a/y_eOxTfL)

other stuff below`,
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [],
      localAssignmentGroupName: "Final Project",
      rubric: [],
      allowedFileUploadExtensions: [],
    };
    const oldSemesterStartDate = "08/26/2023 23:59:00";
    const newSemesterStartDate = "01/08/2024 23:59:00";

    const sanitizedAssignment = prepAssignmentForNewSemester(
      assignment,
      oldSemesterStartDate,
      newSemesterStartDate
    );

    expect(sanitizedAssignment.description).toEqual(`
## test description 

[GitHub Classroom Assignment](insert_github_classroom_url)

other stuff below`);
  });

  it("can sanitize assignment github classroom repo url 2", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: `
<https://classroom.github.com/a/y_eOxTfL>
other stuff below`,
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [],
      localAssignmentGroupName: "Final Project",
      rubric: [],
      allowedFileUploadExtensions: [],
    };
    const oldSemesterStartDate = "08/26/2023 23:59:00";
    const newSemesterStartDate = "01/08/2024 23:59:00";

    const sanitizedAssignment = prepAssignmentForNewSemester(
      assignment,
      oldSemesterStartDate,
      newSemesterStartDate
    );

    expect(sanitizedAssignment.description).toEqual(`
<insert_github_classroom_url>
other stuff below`);
  });

  it("can sanitize assignment github classroom repo url 3", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: `https://classroom.github.com/a/y_eOxTfL other things`,
      dueAt: "08/21/2023 23:59:00",
      lockAt: "08/21/2023 23:59:00",
      submissionTypes: [],
      localAssignmentGroupName: "Final Project",
      rubric: [],
      allowedFileUploadExtensions: [],
    };
    const oldSemesterStartDate = "08/26/2023 23:59:00";
    const newSemesterStartDate = "01/08/2024 23:59:00";

    const sanitizedAssignment = prepAssignmentForNewSemester(
      assignment,
      oldSemesterStartDate,
      newSemesterStartDate
    );

    expect(sanitizedAssignment.description).toEqual(
      `insert_github_classroom_url other things`
    );
  });
});

describe("can offset date based on new semester start", () => {
  it("assignment with new semester start", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: `https://classroom.github.com/a/y_eOxTfL other things`,
      dueAt: "08/29/2023 23:59:00",
      lockAt: "08/29/2023 23:59:00",
      submissionTypes: [],
      localAssignmentGroupName: "Final Project",
      rubric: [],
      allowedFileUploadExtensions: [],
    };

    const oldSemesterStartDate = "08/26/2023 23:59:00";
    const newSemesterStartDate = "01/08/2024 23:59:00";

    const sanitizedAssignment = prepAssignmentForNewSemester(
      assignment,
      oldSemesterStartDate,
      newSemesterStartDate
    );

    expect(sanitizedAssignment.dueAt).toEqual("01/11/2024 23:59:00");
    expect(sanitizedAssignment.lockAt).toEqual("01/11/2024 23:59:00");
  });
  it("assignment with new semester start, no lock date", () => {
    const assignment: LocalAssignment = {
      name: "test assignment",
      description: `https://classroom.github.com/a/y_eOxTfL other things`,
      dueAt: "08/29/2023 23:59:00",
      lockAt: undefined,
      submissionTypes: [],
      localAssignmentGroupName: "Final Project",
      rubric: [],
      allowedFileUploadExtensions: [],
    };

    const oldSemesterStartDate = "08/26/2023 23:59:00";
    const newSemesterStartDate = "01/08/2024 23:59:00";

    const sanitizedAssignment = prepAssignmentForNewSemester(
      assignment,
      oldSemesterStartDate,
      newSemesterStartDate
    );

    expect(sanitizedAssignment.dueAt).toEqual("01/11/2024 23:59:00");
    expect(sanitizedAssignment.lockAt).toEqual(undefined);
  });
});

describe("can prep quizzes", () => {
  it("quiz gets new lock and due dates", () => {
    const quiz: LocalQuiz = {
      name: "Test Quiz",
      description: `
# quiz description
`,
      dueAt: "08/29/2023 23:59:00",
      lockAt: "08/30/2023 23:59:00",
      shuffleAnswers: true,
      oneQuestionAtATime: false,
      localAssignmentGroupName: "someId",
      allowedAttempts: -1,
      showCorrectAnswers: false,
      questions: [],
    };

    const oldSemesterStartDate = "08/26/2023 23:59:00";
    const newSemesterStartDate = "01/08/2024 23:59:00";

    const sanitizedQuiz = prepQuizForNewSemester(
      quiz,
      oldSemesterStartDate,
      newSemesterStartDate
    );

    expect(sanitizedQuiz.dueAt).toEqual("01/11/2024 23:59:00");
    expect(sanitizedQuiz.lockAt).toEqual("01/12/2024 23:59:00");
  });
});

describe("can prep pages", () => {
  it("page gets new due date and github url changes", () => {
    const page: LocalCoursePage = {
      name: "test title",
      text: "test text content",
      dueAt: "08/30/2023 23:59:00",
    };

    const oldSemesterStartDate = "08/26/2023 23:59:00";
    const newSemesterStartDate = "01/08/2024 23:59:00";

    const sanitizedPage = prepPageForNewSemester(
      page,
      oldSemesterStartDate,
      newSemesterStartDate
    );

    expect(sanitizedPage.dueAt).toEqual("01/12/2024 23:59:00");
  });
});

describe("can prep lecture", () => {
  it("lecture gets new date, github url changes", () => {
    const lecture: Lecture = {
      name: "test title",
      date: "08/30/2023",
      content: "test text content",
    };

    const oldSemesterStartDate = "08/26/2023 23:59:00";
    const newSemesterStartDate = "01/08/2024 23:59:00";

    const sanitizedLecture = prepLectureForNewSemester(
      lecture,
      oldSemesterStartDate,
      newSemesterStartDate
    );

    expect(sanitizedLecture.date).toEqual("01/12/2024");
  });
});
