import { CanvasModuleItem } from "@/features/canvas/models/modules/canvasModuleItems";
import { CanvasPage } from "@/features/canvas/models/pages/canvasPageModel";
import { canvasApi, paginatedRequest } from "./canvasServiceUtils";
import { CanvasModule } from "@/features/canvas/models/modules/canvasModule";
import { axiosClient } from "@/services/axiosUtils";
import { rateLimitAwarePost } from "./canvasWebRequestUtils";

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

  async getModuleWithItems(canvasCourseId: number, moduleId: number) {
    const url = `${canvasApi}/courses/${canvasCourseId}/modules/${moduleId}`;
    const params = { include: ["items"] };
    const response = await axiosClient.get<CanvasModule>(url, { params });
    return response.data;
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
    await rateLimitAwarePost(url, body);
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
    await rateLimitAwarePost<CanvasModuleItem>(url, body);
  },

  async getCourseModules(canvasCourseId: number) {
    const url = `${canvasApi}/courses/${canvasCourseId}/modules`;
    const response = await paginatedRequest<CanvasModule[]>({ url });
    return response;
  },

  async createModule(canvasCourseId: number, moduleName: string) {
    const url = `${canvasApi}/courses/${canvasCourseId}/modules`;
    const body = {
      module: {
        name: moduleName,
      },
    };
    const response = await rateLimitAwarePost<CanvasModule>(url, body);
    return response.data.id;
  },

  async reorderModuleItems(
    canvasCourseId: number,
    canvasModuleId: number,
    itemIds: number[]
  ) {
    for (let i = 0; i < itemIds.length; i++) {
      const itemId = itemIds[i];
      const url = `${canvasApi}/courses/${canvasCourseId}/modules/${canvasModuleId}/items/${itemId}`;
      const body = {
        module_item: {
          position: i + 1,
        },
      };
      await axiosClient.put(url, body);
    }
  },
};
