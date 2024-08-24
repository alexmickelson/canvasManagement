import { LocalCourse, LocalCourseSettings } from "@/models/local/localCourse";
import { LocalModule } from "@/models/local/localModules";

export const CourseDifferences = {
  getDeletedChanges(
    newCourse: LocalCourse,
    oldCourse: LocalCourse
  ): DeleteCourseChanges {
    if (newCourse === oldCourse) {
      const emptyDeletes: DeleteCourseChanges = {
        namesOfModulesToDeleteCompletely: [],
        deleteContentsOfModule: [],
      };
      return emptyDeletes;
    }

    const moduleNamesNoLongerReferenced = oldCourse.modules
      .filter(
        (oldModule) =>
          !newCourse.modules.some(
            (newModule) => newModule.name === oldModule.name
          )
      )
      .map((oldModule) => oldModule.name);

    const modulesWithDeletions = oldCourse.modules
      .filter(
        (oldModule) =>
          !newCourse.modules.some(
            (newModule) =>
              JSON.stringify(newModule) === JSON.stringify(oldModule)
          )
      )
      .map((oldModule) => {
        const newModule = newCourse.modules.find(
          (m) => m.name === oldModule.name
        );
        if (!newModule) return oldModule;

        const unreferencedAssignments = oldModule.assignments.filter(
          (oldAssignment) =>
            !newModule.assignments.some(
              (newAssignment) => newAssignment.name === oldAssignment.name
            )
        );
        const unreferencedQuizzes = oldModule.quizzes.filter(
          (oldQuiz) =>
            !newModule.quizzes.some((newQuiz) => newQuiz.name === oldQuiz.name)
        );
        const unreferencedPages = oldModule.pages.filter(
          (oldPage) =>
            !newModule.pages.some((newPage) => newPage.name === oldPage.name)
        );

        return {
          ...oldModule,
          assignments: unreferencedAssignments,
          quizzes: unreferencedQuizzes,
          pages: unreferencedPages,
        };
      });

    return {
      namesOfModulesToDeleteCompletely: moduleNamesNoLongerReferenced,
      deleteContentsOfModule: modulesWithDeletions,
    };
  },

  getNewChanges(
    newCourse: LocalCourse,
    oldCourse: LocalCourse
  ): NewCourseChanges {
    if (newCourse === oldCourse) {
      const emptyChanges: NewCourseChanges = {
        modules: [],
      };
      return emptyChanges;
    }

    const differentModules = newCourse.modules
      .filter(
        (newModule) =>
          !oldCourse.modules.some(
            (oldModule) =>
              JSON.stringify(oldModule) === JSON.stringify(newModule)
          )
      )
      .map((newModule) => {
        const oldModule = oldCourse.modules.find(
          (m) => m.name === newModule.name
        );
        if (!oldModule) return newModule;

        const newAssignments = newModule.assignments.filter(
          (newAssignment) =>
            !oldModule.assignments.some(
              (oldAssignment) =>
                JSON.stringify(newAssignment) === JSON.stringify(oldAssignment)
            )
        );
        const newQuizzes = newModule.quizzes.filter(
          (newQuiz) =>
            !oldModule.quizzes.some(
              (oldQuiz) => JSON.stringify(newQuiz) === JSON.stringify(oldQuiz)
            )
        );
        const newPages = newModule.pages.filter(
          (newPage) =>
            !oldModule.pages.some(
              (oldPage) => JSON.stringify(newPage) === JSON.stringify(oldPage)
            )
        );

        return {
          ...newModule,
          assignments: newAssignments,
          quizzes: newQuizzes,
          pages: newPages,
        };
      });

    return {
      settings: newCourse.settings,
      modules: differentModules,
    };
  },
};

export interface DeleteCourseChanges {
  namesOfModulesToDeleteCompletely: string[];
  deleteContentsOfModule: LocalModule[];
}

export interface NewCourseChanges {
  modules: LocalModule[];
  settings?: LocalCourseSettings;
}

// Default values for DeleteCourseChanges and NewCourseChanges
// export const createDeleteCourseChanges = (
//   init?: Partial<DeleteCourseChanges>
// ): DeleteCourseChanges => ({
//   namesOfModulesToDeleteCompletely: init?.namesOfModulesToDeleteCompletely ?? [],
//   deleteContentsOfModule: init?.deleteContentsOfModule ?? [],
// });

// export const createNewCourseChanges = (
//   init?: Partial<NewCourseChanges>
// ): NewCourseChanges => ({
//   modules: init?.modules ?? [],
//   settings: init?.settings,
// });
