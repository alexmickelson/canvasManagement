import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";
import React from "react";

export default function AssignmentPreview({
  assignment,
}: {
  assignment: LocalAssignment;
}) {
  return (
    <div>
      <section>
        <div className="flex">
          <div className="flex-1 text-end pe-3">Due Date</div>
          <div className="flex-1">{assignment.dueAt}</div>
        </div>
        <div className="flex">
          <div className="flex-1 text-end pe-3">Lock Date</div>
          <div className="flex-1">{assignment.lockAt}</div>
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
        <div
          dangerouslySetInnerHTML={{
            __html: markdownToHTMLSafe(assignment.description),
          }}
        ></div>
      </section>
    </div>
  );
}
