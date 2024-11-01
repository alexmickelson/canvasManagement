import { Lecture } from "@/models/local/lecture";
import { markdownToHTMLSafe } from "@/services/htmlMarkdownUtils";

export default function LecturePreview({ lecture }: { lecture: Lecture }) {
  return (
    <div>
      <section>
        <div className="flex">
          <div className="flex-1 text-end pe-3">Name</div>
          <div className="flex-1">{lecture.name}</div>
        </div>
        <div className="flex">
          <div className="flex-1 text-end pe-3">Date</div>
          <div className="flex-1">{lecture.date}</div>
        </div>
      </section>
      <section>
        <div
          className="markdownPreview"
          dangerouslySetInnerHTML={{
            __html: markdownToHTMLSafe(lecture.content),
          }}
        ></div>
      </section>
    </div>
  );
}
