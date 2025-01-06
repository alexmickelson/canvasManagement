import { CanvasEnrollmentTermModel } from "@/models/canvas/enrollmentTerms/canvasEnrollmentTermModel";
import { canvasApi, paginatedRequest } from "./canvasServiceUtils";
import { CanvasCourseModel } from "@/models/canvas/courses/canvasCourseModel";
import { axiosClient } from "../axiosUtils";
import { CanvasCourseStudentModel } from "@/models/canvas/courses/canvasCourseStudentModel";

const getAllTerms = async () => {
  const url = `${canvasApi}/accounts/10/terms?per_page=100`;
  const data = await paginatedRequest<
    {
      enrollment_terms: CanvasEnrollmentTermModel[];
    }[]
  >({ url });
  const terms = data.flatMap((t) => t.enrollment_terms);
  return terms;
};

export const canvasService = {
  getAllTerms,
  async getCourses(termId: number) {
    const url = `${canvasApi}/courses?per_page=100`;
    const allCourses = await paginatedRequest<CanvasCourseModel[]>({ url });
    const coursesInTerm = allCourses
      .flatMap((l) => l)
      .filter((c) => c.enrollment_term_id === termId);
    return coursesInTerm;
  },

  async getCourse(courseId: number): Promise<CanvasCourseModel> {
    const url = `${canvasApi}/courses/${courseId}`;
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

  async getEnrolledStudents(canvasCourseId: number) {
    console.log(`Getting students for course ${canvasCourseId}`);
    const url = `${canvasApi}/courses/${canvasCourseId}/users?enrollment_type=student`;
    const data  = await paginatedRequest<CanvasCourseStudentModel[]>({url});

    if (!data)
      throw new Error(
        `Something went wrong getting enrollments for ${canvasCourseId}`
      );

    return data;
  },
};
