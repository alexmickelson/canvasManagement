"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeIcon from "./icons/HomeIcon";
import { RightSingleChevron } from "./icons/RightSingleChevron";

export const BreadCrumbs = () => {
  const pathname = usePathname();

  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const isCourseRoute = pathSegments[0] === "course";

  const courseName =
    isCourseRoute && pathSegments[1]
      ? decodeURIComponent(pathSegments[1])
      : null;

  const isLectureRoute = isCourseRoute && pathSegments[2] === "lecture";
  const lectureDate =
    isLectureRoute && pathSegments[3]
      ? decodeURIComponent(pathSegments[3])
      : null;

  const lectureDateOnly = lectureDate
    ? (() => {
        const dateStr = lectureDate.split(" ")[0];
        const date = new Date(dateStr);
        const month = date.toLocaleDateString("en-US", { month: "short" });
        const day = date.getDate();
        return `${month} ${day}`;
      })()
    : null;

  const sharedBackgroundClassNames = `
    group 
    hover:bg-blue-900/30 
    rounded-lg 
    h-full 
    flex 
    items-center 
    transition
  `;
  const sharedLinkClassNames = `
    text-slate-300 
    transition 
    group-hover:text-slate-100 
    rounded-lg 
    h-full 
    flex 
    items-center 
    px-3
  `;

  return (
    <nav className="flex flex-row font-bold text-sm items-center">
      <span className={sharedBackgroundClassNames}>
        <Link
          href="/"
          shallow={true}
          className="flex items-center gap-1 rounded-lg h-full "
        >
          <span className={sharedLinkClassNames}>
            <HomeIcon />
          </span>
        </Link>
      </span>

      {courseName && (
        <>
          <span className="text-slate-500 cursor-default select-none">
            <RightSingleChevron />
          </span>
          <span className={sharedBackgroundClassNames}>
            <Link
              href={`/course/${encodeURIComponent(courseName)}`}
              shallow={true}
              className={sharedLinkClassNames}
            >
              {courseName}
            </Link>
          </span>
        </>
      )}

      {isLectureRoute && lectureDate && courseName && (
        <>
          <span className="text-slate-500 cursor-default select-none">
            <RightSingleChevron />
          </span>
          <span className={sharedBackgroundClassNames}>
            <Link
              href={`/course/${encodeURIComponent(
                courseName
              )}/lecture/${encodeURIComponent(lectureDate)}`}
              shallow={true}
              className={sharedLinkClassNames}
            >
              {lectureDateOnly}
            </Link>
          </span>
        </>
      )}
    </nav>
  );
};
