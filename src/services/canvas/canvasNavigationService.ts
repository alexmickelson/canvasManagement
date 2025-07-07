import { axiosClient } from "../axiosUtils";
import { canvasApi } from "./canvasServiceUtils";

export interface CanvasCourseTab {
  id: string;
  html_url: string;
  full_url: string;
  position: number;
  visibility: "public" | "members" | "admins" | "none";
  label: string;
  type: "internal" | "external";
  hidden?: boolean;
  unused?: boolean;
  url?: string;
}

export const canvasNavigationService = {
  async getCourseTabs(canvasCourseId: number) {
    const url = `${canvasApi}/courses/${canvasCourseId}/tabs`;
    const { data } = await axiosClient.get<CanvasCourseTab[]>(url);
    return data;
  },

  async updateCourseTab(
    canvasCourseId: number,
    tabId: string,
    params: { hidden?: boolean; position?: number }
  ) {
    const url = `${canvasApi}/courses/${canvasCourseId}/tabs/${tabId}`;
    const body = { ...params };
    const { data } = await axiosClient.put(url, body);
    return data;
  },
};
