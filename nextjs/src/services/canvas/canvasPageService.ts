import { CanvasPage } from "@/models/canvas/pages/canvasPageModel";
import { LocalCoursePage } from "@/models/local/page/localCoursePage";
import { canvasServiceUtils } from "./canvasServiceUtils";

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

  // async create(canvasCourseId: number, localCourse: LocalCoursePage): Promise<CanvasPage> {
  //   console.log(`Creating course page: ${localCourse.name}`);
  //   const url = `courses/${canvasCourseId}/pages`;
  //   const body = {
  //     wiki_page: {
  //       title: localCourse.name,
  //       body: localCourse.getBodyHtml(),
  //     },
  //   };

  //   const { canvasPage, response } = await webRequestor.post<CanvasPage>({
  //     url,
  //     body,
  //   });

  //   if (!canvasPage) {
  //     throw new Error("Created canvas course page was null");
  //   }

  //   return canvasPage;
  // },

  // async update(courseId: number, canvasPageId: number, localCoursePage: LocalCoursePage): Promise<void> {
  //   console.log(`Updating course page: ${localCoursePage.name}`);
  //   const url = `courses/${courseId}/pages/${canvasPageId}`;
  //   const body = {
  //     wiki_page: {
  //       title: localCoursePage.name,
  //       body: localCoursePage.getBodyHtml(),
  //     },
  //   };

  //   await webRequestor.put({
  //     url,
  //     body,
  //   });
  // },

  // async delete(courseId: number, canvasPageId: number): Promise<void> {
  //   console.log(`Deleting page from canvas ${canvasPageId}`);
  //   const url = `courses/${courseId}/pages/${canvasPageId}`;
  //   const response = await webRequestor.delete({ url });

  //   if (!response.isSuccessful) {
  //     console.error(url);
  //     throw new Error("Failed to delete canvas course page");
  //   }
  // },
};
