import { Lecture } from "../../../features/local/lectures/lectureModel";
import { getDateOnlyMarkdownString } from "./timeUtils";

export function getLectureForDay(
  weeks: { weekName: string; lectures: Lecture[] }[],
  dayAsDate: Date
) {
  return weeks
    .flatMap((w) => w.lectures)
    .find((l) => l.date == getDateOnlyMarkdownString(dayAsDate));
}
