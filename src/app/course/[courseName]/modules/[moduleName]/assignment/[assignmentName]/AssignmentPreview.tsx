import MarkdownDisplay from "@/components/MarkdownDisplay";
import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import { rubricItemIsExtraCredit } from "@/features/local/assignments/models/rubricItem";
import { assignmentPoints } from "@/features/local/assignments/models/utils/assignmentPointsUtils";
import { formatHumanReadableDate } from "@/services/utils/dateFormat";
import React, { Fragment } from "react";

export default function AssignmentPreview({
  assignment,
}: {
  assignment: LocalAssignment;
}) {
  const totalPoints = assignmentPoints(assignment.rubric);
  const extraPoints = assignment.rubric.reduce(
    (sum, cur) => (rubricItemIsExtraCredit(cur) ? sum + cur.points : sum),
    0
  );
  return (
    <div className="h-full overflow-y-auto ">
      <section>
        <div className="flex">
          <div className="flex-1 text-end pe-3">Due Date</div>
          <div className="flex-1">
            {formatHumanReadableDate(assignment.dueAt)}
          </div>
        </div>
        <div className="flex">
          <div className="flex-1 text-end pe-3">Lock Date</div>
          <div className="flex-1">
            {assignment.lockAt && formatHumanReadableDate(assignment.lockAt)}
          </div>
        </div>
        <div className="flex">
          <div className="flex-1 text-end pe-3">Assignment Group Name</div>
          <div className="flex-1">{assignment.localAssignmentGroupName}</div>
        </div>
        <div className="flex">
          <div className="flex-1 text-end pe-3">Submission Types</div>
          <div className="flex-1">
            <ul className="">
              {assignment.submissionTypes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex">
          <div className="flex-1 text-end pe-3">File Upload Types</div>
          <div className="flex-1">
            <ul className="">
              {assignment.allowedFileUploadExtensions.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <br />
      <hr />
      <br />
      <section>
        <MarkdownDisplay markdown={assignment.description} />
      </section>
      <hr />
      <section>
        <h2 className="text-center">Rubric - {totalPoints} Points</h2>
        {extraPoints !== 0 && (
          <h5 className="text-center">{extraPoints} Extra Credit Points</h5>
        )}
        <div className="grid grid-cols-3">
          {assignment.rubric.map((rubricItem, i) => (
            <Fragment key={rubricItem.label + i}>
              <div className="text-end pe-3 col-span-2">{rubricItem.label}</div>
              <div>
                {rubricItem.points}

                {rubricItemIsExtraCredit(rubricItem) ? " - Extra Credit" : ""}
              </div>
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}
