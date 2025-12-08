import MarkdownDisplay from "@/components/MarkdownDisplay";
import { Lecture } from "@/features/local/lectures/lectureModel";

export default function LecturePreview({ lecture }: { lecture: Lecture }) {
  return (
    <>
      <section className="border-b-slate-700 border-b-4">
        <div className="text-center font-extrabold">{lecture.name}</div>
        <div className="text-center font-bold text-slate-400">
          {lecture.date}
        </div>
      </section>
      <section>
        <MarkdownDisplay markdown={lecture.content} convertImages={false} />
      </section>
    </>
  );
}
