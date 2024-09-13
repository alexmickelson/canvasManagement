"use client";
import { LocalCourse, LocalCourseSettings } from "@/models/local/localCourse";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { localCourseKeys } from "./localCourseKeys";
import { axiosClient } from "@/services/axiosUtils";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";

export const useLocalCoursesSettingsQuery = () =>
  useSuspenseQuery({
    queryKey: localCourseKeys.allCoursesSettings,
    queryFn: async () => {
      const url = `/api/courses/settings`;
      const response = await axiosClient.get<LocalCourseSettings[]>(url);
      return response.data;
    },
  });

export const useLocalCourseSettingsQuery = () => {
  const { courseName } = useCourseContext();
  const { data: settingsList } = useLocalCoursesSettingsQuery();
  return useSuspenseQuery({
    queryKey: localCourseKeys.settings(courseName),
    queryFn: () => {
      const s = settingsList.find((s) => s.name === courseName);
      if (!s) {
        console.log(courseName, settingsList);
        throw Error("Could not find settings for course " + courseName);
      }
      return s;
    },
  });
};

export const useCreateLocalCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCourse: LocalCourse) => {
      const url = `/api/courses`;
      await axiosClient.post(url, newCourse);
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
      queryClient.setQueryData(
        localCourseKeys.settings(courseName),
        updatedSettings
      );
      const url = `/api/courses/${courseName}/settings`;
      await axiosClient.put(url, updatedSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.settings(courseName),
      });
      queryClient.invalidateQueries({
        queryKey: localCourseKeys.allCoursesSettings,
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
