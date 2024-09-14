"use client"

import { useCourseContext } from "./context/courseContext"

export default function CourseTitle() {
  const {courseName}= useCourseContext()
  return (
    <title>{courseName}</title>
  )
}
