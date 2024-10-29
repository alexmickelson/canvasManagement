"use server";

import { ItemInDay } from "@/app/course/[courseName]/calendar/day/ItemInDay";
import {
  CourseItemReturnType,
  CourseItemType,
} from "@/models/local/courseItemTypes";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function getAllItemsFromServer<T extends CourseItemType>({
  courseName,
  moduleName,
  type,
}: {
  courseName: string;
  moduleName: string;
  type: T;
}): Promise<CourseItemReturnType<T>[]> {
  if (type === "Assignment") {
    const assignments = await fileStorageService.assignments.getAssignments(
      courseName,
      moduleName
    );
    return assignments as CourseItemReturnType<T>[];
  }
  if (type === "Quiz") {
    const quizzes = await fileStorageService.quizzes.getQuizzes(
      courseName,
      moduleName
    );
    return quizzes as CourseItemReturnType<T>[];
  }
  const pages = await fileStorageService.pages.getPages(courseName, moduleName);
  return pages as CourseItemReturnType<T>[];
}

export async function getItemFromServer<T extends CourseItemType>({
  courseName,
  moduleName,
  type,
  itemName,
}: {
  courseName: string;
  moduleName: string;
  type: T;
  itemName: string;
}): Promise<CourseItemReturnType<T>> {
  if (type === "Assignment") {
    const assignment = await fileStorageService.assignments.getAssignment(
      courseName,
      moduleName,
      itemName
    );
    return assignment as CourseItemReturnType<T>;
  }
  if (type === "Assignment") {
    const quiz = await fileStorageService.quizzes.getQuiz(
      courseName,
      moduleName,
      itemName
    );
    return quiz as CourseItemReturnType<T>;
  }
  const page = await fileStorageService.pages.getPage(
    courseName,
    moduleName,
    itemName
  );
  return page as CourseItemReturnType<T>;
}
