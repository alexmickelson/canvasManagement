"use client";

import { trpc } from "@/services/trpc/utils";
import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  message: (data: string) => void;
  fileChanged: (filePath: string) => void;
}

interface ClientToServerEvents {
  sendMessage: (data: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("/");

function removeFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex > 0) {
    return fileName.substring(0, lastDotIndex);
  }
  return fileName;
}

export function ClientCacheInvalidation() {
  const utils = trpc.useUtils();
  useEffect(() => {
    socket.on("message", (data) => {
      console.log("Received message:", data);
    });

    socket.on("fileChanged", (filePath) => {
      const [courseName, moduleOrLectures, itemType, itemFile] =
        filePath.split("/");

      const itemName = removeFileExtension(itemFile);

      const allParts = [courseName, moduleOrLectures, itemType, itemName];

      if (moduleOrLectures === "settings.yml") {
        utils.settings.allCoursesSettings.invalidate();
        utils.settings.courseSettings.invalidate({ courseName });
        return;
      }

      if (moduleOrLectures === "00 - lectures") {
        console.log("lecture updated on FS ", allParts);
        utils.lectures.getLectures.invalidate({ courseName });
        return;
      }

      if (itemType === "assignments") {
        console.log("assignment updated on FS ", allParts);
        utils.assignment.getAllAssignments.invalidate({
          courseName,
          moduleName: moduleOrLectures,
        });
        utils.assignment.getAssignment.invalidate({
          courseName,
          moduleName: moduleOrLectures,
          assignmentName: itemName,
        });
        return;
      }

      if (itemType === "quizzes") {
        console.log("quiz updated on FS ", allParts);
        utils.quiz.getAllQuizzes.invalidate({
          courseName,
          moduleName: moduleOrLectures,
        });
        utils.quiz.getQuiz.invalidate({
          courseName,
          moduleName: moduleOrLectures,
          quizName: itemName,
        });
        return;
      }

      if (itemType === "pages") {
        console.log("page updated on FS ", allParts);
        utils.page.getAllPages.invalidate({
          courseName,
          moduleName: moduleOrLectures,
        });
        utils.page.getPage.invalidate({
          courseName,
          moduleName: moduleOrLectures,
          pageName: itemName,
        });
        return;
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return () => {
      socket.off("message");
      socket.off("fileChanged");
      socket.off("connect_error");
    };
  }, [
    utils.assignment.getAllAssignments,
    utils.assignment.getAssignment,
    utils.lectures.getLectures,
    utils.page.getAllPages,
    utils.page.getPage,
    utils.quiz.getAllQuizzes,
    utils.quiz.getQuiz,
    utils.settings.allCoursesSettings,
    utils.settings.courseSettings,
  ]);

  return <></>;
}
