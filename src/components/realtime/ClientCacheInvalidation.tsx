"use client";

import { useTRPC } from "@/services/serverFunctions/trpcClient";
import React, { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalSettingsQuery } from "@/features/local/globalSettings/globalSettingsHooks";
import { GlobalSettings } from "@/features/local/globalSettings/globalSettingsModels";

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

function getCourseNameByPath(
  filePath: string,
  settings: GlobalSettings
) {
  const courseSettings = settings.courses.find((c) => {
    const normalizedFilePath = filePath.startsWith("./")
      ? filePath.substring(2)
      : filePath;
    const normalizedCoursePath = c.path.startsWith("./")
      ? c.path.substring(2)
      : c.path;
    return normalizedFilePath.startsWith(normalizedCoursePath);
  });
  return courseSettings?.name;
}

export function ClientCacheInvalidation() {
  const invalidateCache = useFilePathInvalidation();
  const [connectionAttempted, setConnectionAttempted] = useState(false);
  useEffect(() => {
    if (!connectionAttempted) {
      socket.connect();
      setConnectionAttempted(true);
    }

    socket.on("connect", () => {
      console.log("Socket connected successfully.");
    });

    socket.on("message", (data) => {
      console.log("Received message:", data);
    });

    socket.on("fileChanged", invalidateCache);

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      console.error("File system real time updates disabled");
      socket.disconnect();
    });

    return () => {
      socket.off("message");
      socket.off("fileChanged");
      socket.off("connect_error");
    };
  }, [connectionAttempted, invalidateCache]);

  return <></>;
}

const useFilePathInvalidation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: settings } = useGlobalSettingsQuery();

  return useCallback(
    (filePath: string) => {
      const courseName = getCourseNameByPath(filePath, settings);
      // console.log(filePath, settings, courseName);
      if (!courseName) {
        console.log(
          "no course settings found for file path, not invalidating cache",
          filePath
        );
        return;
      }

      const splitPath = filePath.split("/");
      const [moduleOrLectures, itemType, itemFile] = splitPath.slice(-3);

      const itemName = itemFile ? removeFileExtension(itemFile) : undefined;
      const allParts = { courseName, moduleOrLectures, itemType, itemName };
      // console.log(
      //   "received file to invalidate",
      //   filePath,
      //   allParts,
      //   itemName,
      //   itemType
      // );

      if (moduleOrLectures === "settings.yml") {
        queryClient.invalidateQueries({
          queryKey: trpc.settings.allCoursesSettings.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.settings.courseSettings.queryKey({ courseName }),
        });
        return;
      }

      if (moduleOrLectures === "00 - lectures") {
        console.log("lecture updated on FS ", allParts);
        queryClient.invalidateQueries({
          queryKey: trpc.lectures.getLectures.queryKey({ courseName }),
        });
        return;
      }

      if (itemType === "assignments") {
        console.log("assignment updated on FS ", allParts);
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAllAssignments.queryKey({
            courseName,
            moduleName: moduleOrLectures,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAssignment.queryKey({
            courseName,
            moduleName: moduleOrLectures,
            assignmentName: itemName,
          }),
        });
        return;
      }

      if (itemType === "quizzes") {
        console.log("quiz updated on FS ", allParts);
        queryClient.invalidateQueries({
          queryKey: trpc.quiz.getAllQuizzes.queryKey({
            courseName,
            moduleName: moduleOrLectures,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.quiz.getQuiz.queryKey({
            courseName,
            moduleName: moduleOrLectures,
            quizName: itemName,
          }),
        });
        return;
      }

      if (itemType === "pages") {
        console.log("page updated on FS ", allParts);
        queryClient.invalidateQueries({
          queryKey: trpc.page.getAllPages.queryKey({
            courseName,
            moduleName: moduleOrLectures,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.page.getPage.queryKey({
            courseName,
            moduleName: moduleOrLectures,
            pageName: itemName,
          }),
        });
        return;
      }

      console.log("no cache invalidation match for file ", allParts);
    },
    [
      queryClient,
      trpc.assignment.getAllAssignments,
      trpc.assignment.getAssignment,
      trpc.lectures.getLectures,
      trpc.page.getAllPages,
      trpc.page.getPage,
      trpc.quiz.getAllQuizzes,
      trpc.quiz.getQuiz,
      trpc.settings.allCoursesSettings,
      trpc.settings.courseSettings,
      settings,
    ]
  );
};
