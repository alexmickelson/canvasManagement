import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { Lecture } from "@/models/local/lecture";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";

export default function LecturePreview({ lecture }: { lecture: Lecture }) {
  const [settings] = useLocalCourseSettingsQuery();
  return (
    <>
      <section className="border-b-slate-700 border-b-4">
        <div className="text-center font-extrabold">{lecture.name}</div>
        <div className="text-center font-bold text-slate-400">{lecture.date}</div>
      </section>
      <section>
        <div
          className="markdownPreview "
          dangerouslySetInnerHTML={{
            __html: markdownToHTMLSafe(lecture.content, settings),
          }}
        ></div>
      </section>
    </>
  );
}
