import { CanvasModuleItem } from "@/models/canvas/modules/canvasModuleItems";
import { CanvasPage } from "@/models/canvas/pages/canvasPageModel";
import { axiosClient } from "../axiosUtils";
import { canvasApi } from "./canvasServiceUtils";
import { CanvasModule } from "@/models/canvas/modules/canvasModule";

export const canvasModuleService = {
  async updateModuleItem(
    canvasCourseId: number,
    canvasModuleId: number,
    item: CanvasModuleItem
  ) {
    console.log(`Updating module item ${item.title}`);
    const url = `${canvasApi}/courses/${canvasCourseId}/modules/${canvasModuleId}/items/${item.id}`;
    const body = {
      module_item: { title: item.title, position: item.position },
    };
    const { data } = await axiosClient.put<CanvasModuleItem>(url, body);

    if (!data) throw new Error("Something went wrong updating module item");
  },

  async createModuleItem(
    canvasCourseId: number,
    canvasModuleId: number,
    title: string,
    type: "Assignment" | "Quiz",
    contentId: number | string
  ) {
    console.log(`Creating new module item ${title}`);
    const url = `${canvasApi}/courses/${canvasCourseId}/modules/${canvasModuleId}/items`;
    const body = { module_item: { title, type, content_id: contentId } };
    await axiosClient.post(url, body);
  },

  async createPageModuleItem(
    canvasCourseId: number,
    canvasModuleId: number,
    title: string,
    canvasPage: CanvasPage
  ) {
    console.log(`Creating new module item ${title}`);
    const url = `${canvasApi}/courses/${canvasCourseId}/modules/${canvasModuleId}/items`;
    const body = {
      module_item: { title, type: "Page", page_url: canvasPage.url },
    };
    await axiosClient.post<CanvasModuleItem>(url, body);
  },

  async getCourseModules(canvasCourseId: number) {
    const url = `${canvasApi}/courses/${canvasCourseId}/modules`;
    const response = await axiosClient.get<CanvasModule[]>(url);
    return response.data;
  },

  async createModule(canvasCourseId: number, moduleName: string) {
    const url = `${canvasApi}/courses/${canvasCourseId}/modules`;
    const body = {
      module: {
        name: moduleName,
      },
    };
    const response = await axiosClient.post<CanvasModule>(url, body);
    return response.data.id;
  },
};
