"use client";
import { useTRPC } from "@/services/serverFunctions/trpcClient";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "./localCoursesHooks";
import {
  extractImageSources,
  markdownToHtmlNoImages,
} from "@/services/htmlMarkdownUtils";
import { useEffect, useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useAssignmentQuery = (
  moduleName: string,
  assignmentName: string
) => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.assignment.getAssignment.queryOptions({
      moduleName,
      courseName,
      assignmentName,
    })
  );
};

const enable_images = process.env.NEXT_PUBLIC_ENABLE_FILE_SYNC === "true";

export const useUpdateImageSettingsForAssignment = ({
  moduleName,
  assignmentName,
}: {
  moduleName: string;
  assignmentName: string;
}) => {
  const { data: assignment } = useAssignmentQuery(moduleName, assignmentName);
  const [isPending, setIsPending] = useState(false);
  const addNewImagesToCanvasMutation = useAddNewImagesToCanvasMutation();

  useEffect(() => {
    if (!enable_images) {
      console.log(
        "not uploading images, NEXT_PUBLIC_ENABLE_FILE_SYNC is not set to true"
      );
      return;
    }

    if (isPending) {
      console.log("not updating image assets, still loading");
      return;
    }
    setIsPending(true);
    const assignmentMarkdown = markdownToHtmlNoImages(assignment.description);

    addNewImagesToCanvasMutation
      .mutateAsync({
        markdownString: assignmentMarkdown,
      })
      .then(() => setIsPending(false));
    // not sure why mutation reference changes...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment.description, isPending]);
  return { isPending };
};

export const useAddNewImagesToCanvasMutation = () => {
  const { data: settings } = useLocalCourseSettingsQuery();
  const trpc = useTRPC();
  const createCanvasUrlMutation = useMutation(
    trpc.canvasFile.getCanvasFileUrl.mutationOptions()
  );
  const updateSettings = useUpdateLocalCourseSettingsMutation();

  return useMutation({
    mutationFn: async ({ markdownString }: { markdownString: string }) => {
      const imageSources = extractImageSources(markdownString);
      // console.log("original image urls", imageSources);
      const newImages = imageSources.filter((source) =>
        settings.assets.every((a) => a.sourceUrl !== source)
      );

      if (newImages.length === 0) {
        console.log("no new images to upload");
        return;
      }

      const newAssets = await Promise.all(
        newImages.map(async (source) => {
          console.log("uploading image to canvas", source);
          const canvasUrl = await createCanvasUrlMutation.mutateAsync({
            sourceUrl: source,
            canvasCourseId: settings.canvasId,
          });
          console.log("got canvas url", source, canvasUrl);
          return { sourceUrl: source, canvasUrl };
        })
      );
      await updateSettings.mutateAsync({
        settings: {
          ...settings,
          assets: [...settings.assets, ...newAssets],
        },
      });
    },
  });
};

export const useAssignmentNamesQuery = (moduleName: string) => {
  const { courseName } = useCourseContext();
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.assignment.getAllAssignments.queryOptions({
      moduleName,
      courseName,
    }),
    select: (assignments) => assignments.map((a) => a.name),
  });
};

export const useUpdateAssignmentMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.assignment.updateAssignment.mutationOptions({
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
          queryClient.invalidateQueries({
            queryKey: trpc.assignment.getAllAssignments.queryKey({
              courseName,
              moduleName: previousModuleName,
            }),
          });
        }
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAllAssignments.queryKey({
            courseName,
            moduleName,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAssignment.queryKey({
            courseName,
            moduleName,
            assignmentName,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAssignment.queryKey({
            courseName,
            moduleName,
            assignmentName: previousAssignmentName,
          }),
        });
      },
    })
  );
};

export const useCreateAssignmentMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.assignment.createAssignment.mutationOptions({
      onSuccess: (_result, { courseName, moduleName }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAllAssignments.queryKey({
            courseName,
            moduleName,
          }),
        });
      },
    })
  );
};

export const useDeleteAssignmentMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.assignment.deleteAssignment.mutationOptions({
      onSuccess: (_result, { courseName, moduleName, assignmentName }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAllAssignments.queryKey({
            courseName,
            moduleName,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.assignment.getAssignment.queryKey({
            courseName,
            moduleName,
            assignmentName,
          }),
        });
      },
    })
  );
};
