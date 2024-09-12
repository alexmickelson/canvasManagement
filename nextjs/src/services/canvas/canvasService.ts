import { CanvasEnrollmentTermModel } from "@/models/canvas/enrollmentTerms/canvasEnrollmentTermModel";
import { canvasServiceUtils } from "./canvasServiceUtils";
import { CanvasCourseModel } from "@/models/canvas/courses/canvasCourseModel";
import { CanvasModuleItem } from "@/models/canvas/modules/canvasModuleItems";
import { CanvasPage } from "@/models/canvas/pages/canvasPageModel";
import { CanvasEnrollmentModel } from "@/models/canvas/enrollments/canvasEnrollmentModel";
import { axiosClient } from "../axiosUtils";

const baseCanvasUrl = "https://snow.instructure.com/api/v1";

const getAllTerms = async () => {
  const url = `${baseCanvasUrl}/accounts/10/terms`;
  const { data } = await axiosClient.get<
    {
      enrollment_terms: CanvasEnrollmentTermModel[];
    }[]
  >(url);
  const terms = data.flatMap((r) => r.enrollment_terms);
  return terms;
};

export const canvasService = {
  getAllTerms,
  async getCourses(termId: number) {
    const url = `${baseCanvasUrl}/courses`;
    const response = await axiosClient.get<CanvasCourseModel[][]>(url);
    const allCourses = response.data;
    const coursesInTerm = allCourses
      .flatMap((l) => l)
      .filter((c) => c.enrollment_term_id === termId);
    return coursesInTerm;
  },

  async getCourse(courseId: number): Promise<CanvasCourseModel> {
    const url = `${baseCanvasUrl}/courses/${courseId}`;
    const { data } = await axiosClient.get<CanvasCourseModel>(url);
    return data;
  },

  async getCurrentTermsFor(queryDate: Date = new Date()) {
    const terms = await getAllTerms();
    const currentTerms = terms
      .filter(
        (t) =>
          t.end_at &&
          new Date(t.end_at) > queryDate &&
          new Date(t.end_at) <
            new Date(queryDate.setFullYear(queryDate.getFullYear() + 1))
      )
      .sort(
        (a, b) =>
          new Date(a.start_at ?? "").getTime() -
          new Date(b.start_at ?? "").getTime()
      )
      .slice(0, 3);

    return currentTerms;
  },

  async updateModuleItem(
    canvasCourseId: number,
    canvasModuleId: number,
    item: CanvasModuleItem
  ) {
    console.log(`Updating module item ${item.title}`);
    const url = `${baseCanvasUrl}/courses/${canvasCourseId}/modules/${canvasModuleId}/items/${item.id}`;
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
    type: string,
    contentId: number | string
  ): Promise<void> {
    console.log(`Creating new module item ${title}`);
    const url = `${baseCanvasUrl}/courses/${canvasCourseId}/modules/${canvasModuleId}/items`;
    const body = { module_item: { title, type, content_id: contentId } };
    const response = await axiosClient.post(url, body);
  },

  async createPageModuleItem(
    canvasCourseId: number,
    canvasModuleId: number,
    title: string,
    canvasPage: CanvasPage
  ): Promise<void> {
    console.log(`Creating new module item ${title}`);
    const url = `${baseCanvasUrl}/courses/${canvasCourseId}/modules/${canvasModuleId}/items`;
    const body = {
      module_item: { title, type: "Page", page_url: canvasPage.url },
    };
    await axiosClient.post<CanvasModuleItem>(url, body);
  },

  async getEnrolledStudents(canvasCourseId: number) {
    console.log(`Getting students for course ${canvasCourseId}`);
    const url = `${baseCanvasUrl}/courses/${canvasCourseId}/enrollments?enrollment_type=student`;
    const { data } = await axiosClient.get<CanvasEnrollmentModel[]>(url);

    if (!data)
      throw new Error(
        `Something went wrong getting enrollments for ${canvasCourseId}`
      );

    return data;
  },
};
