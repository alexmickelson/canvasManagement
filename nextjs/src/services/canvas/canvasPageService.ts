import { CanvasPage } from "@/models/canvas/pages/canvasPageModel";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { canvasApi, paginatedRequest } from "./canvasServiceUtils";
import { markdownToHTMLSafe } from "../htmlMarkdownUtils";
import { axiosClient } from "../axiosUtils";
import { rateLimitAwareDelete } from "./canvasWebRequestor";
import { LocalCourseSettings } from "@/models/local/localCourseSettings";

export const canvasPageService = {
  async getAll(courseId: number): Promise<CanvasPage[]> {
    console.log("requesting pages");
    const url = `${canvasApi}/courses/${courseId}/pages`;
    const pages = await paginatedRequest<CanvasPage[]>({
      url,
    });
    return pages.flatMap((pageList) => pageList);
  },

  async create(
    canvasCourseId: number,
    page: LocalCoursePage,
    settings: LocalCourseSettings
  ): Promise<CanvasPage> {
    console.log(`Creating course page: ${page.name}`);
    const url = `${canvasApi}/courses/${canvasCourseId}/pages`;
    const body = {
      wiki_page: {
        title: page.name,
        body: markdownToHTMLSafe(page.text, settings),
      },
    };

    const { data: canvasPage } = await axiosClient.post<CanvasPage>(url, body);
    if (!canvasPage) {
      throw new Error("Created canvas course page was null");
    }
    return canvasPage;
  },

  async update(
    courseId: number,
    canvasPageId: number,
    page: LocalCoursePage,
    settings: LocalCourseSettings
  ): Promise<void> {
    console.log(`Updating course page: ${page.name}`);
    const url = `${canvasApi}/courses/${courseId}/pages/${canvasPageId}`;
    const body = {
      wiki_page: {
        title: page.name,
        body: markdownToHTMLSafe(page.text, settings),
      },
    };
    await axiosClient.put(url, body);
  },

  async delete(courseId: number, canvasPageId: number): Promise<void> {
    console.log(`Deleting page from canvas ${canvasPageId}`);
    const url = `${canvasApi}/courses/${courseId}/pages/${canvasPageId}`;
    await rateLimitAwareDelete(url);
  },
};
