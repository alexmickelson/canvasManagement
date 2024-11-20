"use client";
import { trpc } from "@/services/serverFunctions/trpcClient";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "./localCoursesHooks";
import {
  extractImageSources,
  markdownToHtmlNoImages,
} from "@/services/htmlMarkdownUtils";
import { useActionState, useEffect, useState } from "react";

export const useAssignmentQuery = (
  moduleName: string,
  assignmentName: string
) => {
  const { courseName } = useCourseContext();
  return trpc.assignment.getAssignment.useSuspenseQuery({
    moduleName,
    courseName,
    assignmentName,
  });
};

export const useUpdateImageSettingsForAssignment = ({
  moduleName,
  assignmentName,
}: {
  moduleName: string;
  assignmentName: string;
}) => {
  const [settings] = useLocalCourseSettingsQuery();
  const [assignment] = useAssignmentQuery(moduleName, assignmentName);
  const updateSettings = useUpdateLocalCourseSettingsMutation();
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  // useEffect(() => {
  //   if (isUpdatingSettings) {
  //     console.log("not updating image assets, still loading");
  //     return;
  //   }
  //   setIsUpdatingSettings(true);
  //   const assignmentMarkdown = markdownToHtmlNoImages(assignment.description);

  //   const imageSources = extractImageSources(assignmentMarkdown);
  //   const imagesToUpdate = imageSources.filter((source) =>
  //     settings.assets.every((a) => a.sourceUrl !== source)
  //   );
  //   console.log("images to update", imagesToUpdate);


  //   Promise.all(
  //     imagesToUpdate.map(async (source) => {
  //       // todo: get canvas url
  //       const canvasUrl = "";
  //       return { sourceUrl: source, canvasUrl };
  //     })
  //   ).then(async (newAssets) => {
  //     await updateSettings.mutateAsync({
  //       settings: {
  //         ...settings,
  //         assets: [...settings.assets, ...newAssets],
  //       },
  //     });
  //     setIsUpdatingSettings(false);
  //   });
  // }, [
  //   assignment.description,
  //   isUpdatingSettings,
  //   settings,
  //   settings.assets,
  //   updateSettings,
  // ]);
};

export const useAssignmentNamesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  return trpc.assignment.getAllAssignments.useSuspenseQuery(
    {
      moduleName,
      courseName,
    },
    {
      select: (assignments) => assignments.map((a) => a.name),
    }
  );
};

export const useUpdateAssignmentMutation = () => {
  const utils = trpc.useUtils();
  return trpc.assignment.updateAssignment.useMutation({
    onSuccess: (
      _,
      { courseName, moduleName, assignmentName, previousAssignmentName }
    ) => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
      utils.assignment.getAssignment.invalidate({
        courseName,
        moduleName,
        assignmentName,
      });
      utils.assignment.getAssignment.invalidate({
        courseName,
        moduleName,
        assignmentName: previousAssignmentName,
      });
    },
  });
};

export const useCreateAssignmentMutation = () => {
  const utils = trpc.useUtils();
  return trpc.assignment.createAssignment.useMutation({
    onSuccess: (_, { courseName, moduleName }) => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
    },
  });
};

export const useDeleteAssignmentMutation = () => {
  const utils = trpc.useUtils();
  return trpc.assignment.deleteAssignment.useMutation({
    onSuccess: (_, { courseName, moduleName, assignmentName }) => {
      utils.assignment.getAllAssignments.invalidate({ courseName, moduleName });
      utils.assignment.getAssignment.invalidate(
        {
          courseName,
          moduleName,
          assignmentName,
        },
        {
          refetchType: "all",
        }
      );
    },
  });
};
