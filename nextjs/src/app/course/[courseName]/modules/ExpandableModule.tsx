import { IModuleItem } from "@/models/local/IModuleItem";
import { LocalModule } from "@/models/local/localModules";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import React, { useState } from "react";

export default function ExpandableModule({ module }: { module: LocalModule }) {
  const [expanded, setExpanded] = useState(false);

  const moduleItems: {
    type: "assignment" | "quiz" | "page";
    item: IModuleItem;
  }[] = module.assignments
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
    .concat(module.quizzes.map((q) => ({ type: "quiz", item: q })))
    .concat(module.pages.map((p) => ({ type: "page", item: p })))
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
        {module.name}
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
