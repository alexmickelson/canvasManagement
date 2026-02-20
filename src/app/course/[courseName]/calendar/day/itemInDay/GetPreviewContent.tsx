"use client";
import MarkdownDisplay from "@/components/MarkdownDisplay";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import { FC } from "react";

export const GetPreviewContent: FC<{
  type: "assignment" | "page" | "quiz";
  item: IModuleItem;
}> = ({ type, item }) => {
  if (type === "assignment" && "description" in item) {
    const assignment = item as {
      description: string;
      githubClassroomAssignmentShareLink?: string;
    };
    return (
      <MarkdownDisplay
        markdown={assignment.description}
        replaceText={[
          {
            source: "insert_github_classroom_url",
            destination: assignment.githubClassroomAssignmentShareLink || "",
          },
        ]}
      />
    );
  } else if (type === "page" && "text" in item) {
    return <MarkdownDisplay markdown={item.text as string} />;
  } else if (type === "quiz" && "questions" in item) {
    const quiz = item as { questions: { text: string }[] };
    return quiz.questions.map((q, i: number) => (
      <div key={i} className="">
        <MarkdownDisplay markdown={q.text as string} />
      </div>
    ));
  }
  return null;
};
