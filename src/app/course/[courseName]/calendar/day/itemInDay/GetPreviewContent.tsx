"use client";
import MarkdownDisplay from "@/components/MarkdownDisplay";
import { getClassroomReplaceText } from "@/features/local/classroom50/classroom50UrlUtils";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import { FC } from "react";

export const GetPreviewContent: FC<{
  type: "assignment" | "page" | "quiz";
  item: IModuleItem;
}> = ({ type, item }) => {
  const { data: settings } = useLocalCourseSettingsQuery();
  if (type === "assignment" && "description" in item) {
    const assignment = item as {
      description: string;
      classroom50Slug?: string;
    };
    return (
      <MarkdownDisplay
        markdown={assignment.description}
        replaceText={getClassroomReplaceText({ assignment, settings })}
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
