import { IModuleItem } from "@/models/local/IModuleItem";
import { LocalModule } from "@/models/local/localModules";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import React, { useState } from "react";
import { useCourseContext } from "../context/courseContext";
import {
  useAssignmentNamesQuery,
  useAssignmentsQueries,
} from "@/hooks/localCourse/assignmentHooks";
import {
  useQuizNamesQuery,
  useQuizzesQueries,
} from "@/hooks/localCourse/quizHooks";
import {
  usePageNamesQuery,
  usePagesQueries,
} from "@/hooks/localCourse/pageHooks";

export default function ExpandableModule({
  moduleName,
}: {
  moduleName: string;
}) {
  const { courseName } = useCourseContext();
  const { data: assignmentNames } = useAssignmentNamesQuery(
    courseName,
    moduleName
  );
  const { data: assignments } = useAssignmentsQueries(
    courseName,
    moduleName,
    assignmentNames
  );
  const { data: quizNames } = useQuizNamesQuery(courseName, moduleName);
  const { data: quizzes } = useQuizzesQueries(
    courseName,
    moduleName,
    quizNames
  );
  const { data: pageNames } = usePageNamesQuery(courseName, moduleName);
  const { data: pages } = usePagesQueries(courseName, moduleName, pageNames);

  const [expanded, setExpanded] = useState(false);

  const moduleItems: {
    type: "assignment" | "quiz" | "page";
    item: IModuleItem;
  }[] = assignments
    .map(
      (
        a
      ): {
        type: "assignment" | "quiz" | "page";
        item: IModuleItem;
      } => ({
        type: "assignment",
        item: a,
      })
    )
    .concat(quizzes.map((q) => ({ type: "quiz", item: q })))
    .concat(pages.map((p) => ({ type: "page", item: p })))
    .sort(
      (a, b) =>
        getDateFromStringOrThrow(
          a.item.dueAt,
          "item due date in expandable module"
        ).getTime() -
        getDateFromStringOrThrow(
          b.item.dueAt,
          "item due date in expandable module"
        ).getTime()
    );

  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-600 mb-3">
      <div
        className="font-bold "
        role="button"
        onClick={() => setExpanded((e) => !e)}
      >
        {moduleName}
      </div>
      <div
        className={
          `
          overflow-hidden 
           transition-all duration-1000 ease-in
          ` + (expanded ? " max-h-[30vh]" : " max-h-0")
        }
      >
        <hr />
        {moduleItems.map(({ type, item }) => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}
