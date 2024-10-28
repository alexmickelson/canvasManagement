import { describe, it, expect } from "vitest";
import { LocalAssignment } from "../assignment/localAssignment";
import { prepAssignmentForNewSemester, prepQuizForNewSemester } from "../semesterTransferUtils";
import { LocalQuiz } from "../quiz/localQuiz";

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
  it("assignment with new semester start, no lock date", () => {
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
