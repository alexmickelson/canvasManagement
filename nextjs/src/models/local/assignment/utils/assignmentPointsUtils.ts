import { LocalAssignment } from "../localAssignment";

export const assignmentPoints = (assignment: LocalAssignment) => {
  const basePoints = assignment.rubric
    .map((r) =>
      r.label.toLowerCase().includes("(extra credit)") ? 0 : r.points
    )
    .reduce((acc, current) => acc + current, 0);
  return basePoints;
};
