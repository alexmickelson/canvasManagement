import { describe, it, expect } from 'vitest';
import { LocalAssignment } from '../../assignmnet/localAssignment';
import { AssignmentSubmissionType } from '../../assignmnet/assignmentSubmissionType';
import { assignmentMarkdownStringifier } from '../../assignmnet/utils/assignmentMarkdownParser';
import { assignmentMarkdownParser } from '../../assignmnet/utils/assignmentMarkdownStringifier';

describe('AssignmentMarkdownTests', () => {
  it('can parse assignment settings', () => {
    const assignment: LocalAssignment ={
      name: 'test assignment',
      description: 'here is the description',
      dueAt: new Date().toISOString(),
      lockAt: new Date().toISOString(),
      submissionTypes: [AssignmentSubmissionType.OnlineUpload],
      localAssignmentGroupName: 'Final Project',
      rubric: [
        { points: 4, label: 'do task 1' },
        { points: 2, label: 'do task 2' },
      ],
      allowedFileUploadExtensions: [],
    };

    const assignmentMarkdown = assignmentMarkdownStringifier.toMarkdown(assignment);
    const parsedAssignment = assignmentMarkdownParser.parseMarkdown(assignmentMarkdown);

    expect(parsedAssignment).toEqual(assignment);
  });

  // it('assignment with empty rubric can be parsed', () => {
  //   const assignment = new LocalAssignment({
  //     name: 'test assignment',
  //     description: 'here is the description',
  //     dueAt: new Date(),
  //     lockAt: new Date(),
  //     submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
  //     localAssignmentGroupName: 'Final Project',
  //     rubric: [],
  //   });

  //   const assignmentMarkdown = assignment.toMarkdown();
  //   const parsedAssignment = LocalAssignment.parseMarkdown(assignmentMarkdown);

  //   expect(parsedAssignment).toEqual(assignment);
  // });

  // it('assignment with empty submission types can be parsed', () => {
  //   const assignment = new LocalAssignment({
  //     name: 'test assignment',
  //     description: 'here is the description',
  //     dueAt: new Date(),
  //     lockAt: new Date(),
  //     submissionTypes: [],
  //     localAssignmentGroupName: 'Final Project',
  //     rubric: [
  //       new RubricItem({ points: 4, label: 'do task 1' }),
  //       new RubricItem({ points: 2, label: 'do task 2' }),
  //     ],
  //   });

  //   const assignmentMarkdown = assignment.toMarkdown();
  //   const parsedAssignment = LocalAssignment.parseMarkdown(assignmentMarkdown);

  //   expect(parsedAssignment).toEqual(assignment);
  // });

  // it('assignment without lockAt date can be parsed', () => {
  //   const assignment = new LocalAssignment({
  //     name: 'test assignment',
  //     description: 'here is the description',
  //     dueAt: new Date(),
  //     lockAt: null,
  //     submissionTypes: [],
  //     localAssignmentGroupName: 'Final Project',
  //     rubric: [
  //       new RubricItem({ points: 4, label: 'do task 1' }),
  //       new RubricItem({ points: 2, label: 'do task 2' }),
  //     ],
  //   });

  //   const assignmentMarkdown = assignment.toMarkdown();
  //   const parsedAssignment = LocalAssignment.parseMarkdown(assignmentMarkdown);

  //   expect(parsedAssignment).toEqual(assignment);
  // });

  // it('assignment without description can be parsed', () => {
  //   const assignment = new LocalAssignment({
  //     name: 'test assignment',
  //     description: '',
  //     dueAt: new Date(),
  //     lockAt: new Date(),
  //     submissionTypes: [],
  //     localAssignmentGroupName: 'Final Project',
  //     rubric: [
  //       new RubricItem({ points: 4, label: 'do task 1' }),
  //       new RubricItem({ points: 2, label: 'do task 2' }),
  //     ],
  //   });

  //   const assignmentMarkdown = assignment.toMarkdown();
  //   const parsedAssignment = LocalAssignment.parseMarkdown(assignmentMarkdown);

  //   expect(parsedAssignment).toEqual(assignment);
  // });

  // it('assignments can have three dashes', () => {
  //   const assignment = new LocalAssignment({
  //     name: 'test assignment',
  //     description: 'test assignment\n---\nsomestuff',
  //     dueAt: new Date(),
  //     lockAt: new Date(),
  //     submissionTypes: [],
  //     localAssignmentGroupName: 'Final Project',
  //     rubric: [],
  //   });

  //   const assignmentMarkdown = assignment.toMarkdown();
  //   const parsedAssignment = LocalAssignment.parseMarkdown(assignmentMarkdown);

  //   expect(parsedAssignment).toEqual(assignment);
  // });

  // it('assignments can restrict upload types', () => {
  //   const assignment = new LocalAssignment({
  //     name: 'test assignment',
  //     description: 'here is the description',
  //     dueAt: new Date(),
  //     lockAt: new Date(),
  //     submissionTypes: [AssignmentSubmissionType.ONLINE_UPLOAD],
  //     allowedFileUploadExtensions: ['pdf', 'txt'],
  //     localAssignmentGroupName: 'Final Project',
  //     rubric: [],
  //   });

  //   const assignmentMarkdown = assignment.toMarkdown();
  //   const parsedAssignment = LocalAssignment.parseMarkdown(assignmentMarkdown);

  //   expect(parsedAssignment).toEqual(assignment);
  // });
});
