"use client";
import { LocalCourse, LocalCourseSettings } from "@/models/local/localCourse";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { localCourseKeys } from "./localCourseKeys";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import {
  createCourseOnServer,
  updateCourseSettingsOnServer,
} from "./localCoursesServerActions";
import { trpc } from "@/services/trpc/utils";

export const useLocalCoursesSettingsQuery = () =>
  trpc.settings.allCoursesSettings.useSuspenseQuery();
// useSuspenseQuery({
//   queryKey: localCourseKeys.allCoursesSettings,
//   queryFn: async () => {
//     return await getAllCoursesSettingsFromServer();
//   },
// });

export const useLocalCourseSettingsQuery = () => {
  const { courseName } = useCourseContext();
  // const { data: settingsList } = useLocalCoursesSettingsQuery();
  return trpc.settings.courseSettings.useSuspenseQuery({ courseName });
  // return useSuspenseQuery({
  //   queryKey: localCourseKeys.settings(courseName),
  //   queryFn: async () => {
  //     const settingsList = await getAllCoursesSettingsFromServer();
  //     const s = settingsList.find((s) => s.name === courseName);
  //     if (!s) {
  //       console.log(courseName, settingsList);
  //       throw Error("Could not find settings for course " + courseName);
  //     }
  //     return s;
  //   },
  // });
};

export const useCreateLocalCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCourse: LocalCourse) => {
      await createCourseOnServer({ course: newCourse });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.allCoursesSettings,
      });
    },
  });
};

export const useUpdateLocalCourseSettingsMutation = () => {
  const { courseName } = useCourseContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedSettings: LocalCourseSettings) => {
      // queryClient.setQueryData(
      //   localCourseKeys.settings(courseName),
      //   updatedSettings
      // );
      await updateCourseSettingsOnServer({
        courseName,
        settings: updatedSettings,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.allCoursesSettings,
      });
      await queryClient.invalidateQueries({
        queryKey: localCourseKeys.settings(courseName),
      });
    },
  });
};

// export const useUpdateCourseMutation = (courseName: string) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (body: {
//       updatedCourse: LocalCourse;
//       previousCourse: LocalCourse;
//     }) => {
//       const url = `/api/courses/${courseName}`;
//       await axiosClient.put(url, body);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: localCourseKeys.settings(courseName),
//       });
//     },
//     scope: {
//       id: "all courses",
//     },
//   });
// };
