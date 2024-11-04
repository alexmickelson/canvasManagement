"use server";

import { ItemInDay } from "@/app/course/[courseName]/calendar/day/ItemInDay";
import { LocalAssignment } from "@/models/local/assignment/localAssignment";
import {
  CourseItemReturnType,
  CourseItemType,
} from "@/models/local/courseItemTypes";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { LocalQuiz } from "@/models/local/quiz/localQuiz";
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
  if (type === "Page") {
    const pages = await fileStorageService.pages.getPages(
      courseName,
      moduleName
    );
    return pages as CourseItemReturnType<T>[];
  }

  throw Error(`cannot get item from server, invalid type: ${type}`)
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

export async function createItemOnServer<T extends CourseItemType>({
  courseName,
  moduleName,
  type,
  item,
  itemName,
}: {
  courseName: string;
  moduleName: string;
  type: T;
  item: CourseItemReturnType<T>;
  itemName: string;
}) {
  if (type === "Assignment") {
    const assignment = item as LocalAssignment;
    await fileStorageService.assignments.updateOrCreateAssignment({
      courseName,
      moduleName,
      assignmentName: itemName,
      assignment,
    });
  }
  if (type === "Quiz") {
    const quiz = item as LocalQuiz;
    await fileStorageService.quizzes.updateQuiz(
      courseName,
      moduleName,
      itemName,
      quiz
    );
  }
  if (type === "Page") {
    const page = item as LocalCoursePage;
    await fileStorageService.pages.updatePage(
      courseName,
      moduleName,
      itemName,
      page
    );
  }
}

export async function updateItemOnServer<T extends CourseItemType>({
  item,
  courseName,
  moduleName,
  previousModuleName,
  previousItemName,
  itemName,
  type,
}: {
  item: CourseItemReturnType<T>;
  courseName: string;
  moduleName: string;
  previousModuleName: string;
  previousItemName: string;
  itemName: string;
  type: T;
}) {
  if (type === "Assignment") {
    const assignment = item as LocalAssignment;
    await fileStorageService.assignments.updateOrCreateAssignment({
      courseName,
      moduleName,
      assignmentName: itemName,
      assignment,
    });

    if (
      assignment.name !== previousItemName ||
      moduleName !== previousModuleName
    ) {
      fileStorageService.assignments.delete({
        courseName,
        moduleName: previousModuleName,
        assignmentName: previousItemName,
      });
    }
  }
  if (type === "Quiz") {
    const quiz = item as LocalQuiz;
    await fileStorageService.quizzes.updateQuiz(
      courseName,
      moduleName,
      itemName,
      quiz
    );

    if (
      previousModuleName &&
      previousItemName &&
      (quiz.name !== previousItemName || moduleName !== previousModuleName)
    ) {
      fileStorageService.quizzes.delete({
        courseName,
        moduleName: previousModuleName,
        quizName: previousItemName,
      });
    }
  }
  if (type === "Page") {
    const page = item as LocalCoursePage;
    await fileStorageService.pages.updatePage(
      courseName,
      moduleName,
      itemName,
      page
    );

    if (
      previousModuleName &&
      previousItemName &&
      (page.name !== previousItemName || moduleName !== previousModuleName)
    ) {
      fileStorageService.pages.delete({
        courseName,
        moduleName: previousModuleName,
        pageName: previousItemName,
      });
    }
  }
}

export async function deleteItemOnServer<T extends CourseItemType>({
  courseName,
  moduleName,
  itemName,
  type,
}: {
  courseName: string;
  moduleName: string;
  itemName: string;
  type: T;
}) {
  if (type === "Assignment") {
    await fileStorageService.assignments.delete({
      courseName,
      moduleName,
      assignmentName: itemName,
    });
  }
  if (type === "Quiz") {
    await fileStorageService.quizzes.delete({
      courseName,
      moduleName,
      quizName: itemName,
    });
  }
  if (type === "Page") {
    await fileStorageService.pages.delete({
      courseName,
      moduleName,
      pageName: itemName,
    });
  }
}
