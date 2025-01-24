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

const enable_images = process.env.NEXT_PUBLIC_ENABLE_FILE_SYNC === "true";

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
  const [isPending, setIsPending] = useState(false);
  const createCanvasUrlMutation =
    trpc.canvasFile.getCanvasFileUrl.useMutation();

  useEffect(() => {
    if (!enable_images) {
      console.log("not uploading images, FILE_POLLING is not set to true");
      return;
    }

    if (isPending) {
      console.log("not updating image assets, still loading");
      return;
    }
    setIsPending(true);
    const assignmentMarkdown = markdownToHtmlNoImages(assignment.description);

    const imageSources = extractImageSources(assignmentMarkdown);
    const imagesToUpdate = imageSources.filter((source) =>
      settings.assets.every((a) => a.sourceUrl !== source)
    );

    if (imagesToUpdate.length) {
      Promise.all(
        imagesToUpdate.map(async (source) => {
          // todo: get canvas url
          // const canvasUrl = "";
          console.log(source);
          const canvasUrl = await createCanvasUrlMutation.mutateAsync({
            sourceUrl: source,
            canvasCourseId: settings.canvasId,
          });
          console.log("got canvas url", source, canvasUrl);
          return { sourceUrl: source, canvasUrl };
        })
      ).then(async (newAssets) => {
        await updateSettings.mutateAsync({
          settings: {
            ...settings,
            assets: [...settings.assets, ...newAssets],
          },
        });
        setIsPending(false);
      });
    } else {
      setIsPending(false)
    }
  }, [
    assignment.description,
    createCanvasUrlMutation,
    isPending,
    settings,
    settings.assets,
    updateSettings,
  ]);
  return { isPending };
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
      {
        courseName,
        moduleName,
        assignmentName,
        previousAssignmentName,
        previousModuleName,
      }
    ) => {
      if (moduleName !== previousModuleName) {
        utils.assignment.getAllAssignments.invalidate(
          {
            courseName,
            moduleName: previousModuleName,
          },
          { refetchType: "all" }
        );
      }
      utils.assignment.getAllAssignments.invalidate(
        { courseName, moduleName },
        { refetchType: "all" }
      );
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
