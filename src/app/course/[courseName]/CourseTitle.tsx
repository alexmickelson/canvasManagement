"use client"

import { useCourseContext } from "./context/courseContext"

export default function CourseTitle() {
  const {courseName}= useCourseContext()
  return (
    <title>{(process.env.NEXT_PUBLIC_TITLE_PREFIX ?? "")}{courseName}</title>
  )
}
