import { CanvasPage } from "@/models/canvas/pages/canvasPageModel";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { canvasServiceUtils } from "./canvasServiceUtils";
import { markdownToHTMLSafe } from "../htmlMarkdownUtils";
import { axiosClient } from "../axiosUtils";
import { rateLimitAwareDelete } from "./canvasWebRequestor";

const baseCanvasUrl = "https://snow.instructure.com/api/v1";

export const canvasPageService = {
  async getAll(courseId: number): Promise<CanvasPage[]> {
    console.log("requesting pages");
    const url = `${baseCanvasUrl}/courses/${courseId}/pages`;
    const pages = await canvasServiceUtils.paginatedRequest<CanvasPage[]>({
      url,
    });
    return pages.flatMap((pageList) => pageList);
  },

  async create(
    canvasCourseId: number,
    page: LocalCoursePage
  ): Promise<CanvasPage> {
    console.log(`Creating course page: ${page.name}`);
    const url = `${baseCanvasUrl}/courses/${canvasCourseId}/pages`;
    const body = {
      wiki_page: {
        title: page.name,
        body: markdownToHTMLSafe(page.text),
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
    page: LocalCoursePage
  ): Promise<void> {
    console.log(`Updating course page: ${page.name}`);
    const url = `${baseCanvasUrl}/courses/${courseId}/pages/${canvasPageId}`;
    const body = {
      wiki_page: {
        title: page.name,
        body: markdownToHTMLSafe(page.text),
      },
    };
    await axiosClient.put(url, body);
  },

  async delete(courseId: number, canvasPageId: number): Promise<void> {
    console.log(`Deleting page from canvas ${canvasPageId}`);
    const url = `${baseCanvasUrl}/courses/${courseId}/pages/${canvasPageId}`;
    await rateLimitAwareDelete(url);
  },
};
