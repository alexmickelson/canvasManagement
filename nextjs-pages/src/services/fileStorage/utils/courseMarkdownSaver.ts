import { localAssignmentMarkdown } from "@/models/local/assignment/localAssignment";
import { LocalCourse, localCourseYamlUtils } from "@/models/local/localCourse";
import { LocalModule } from "@/models/local/localModules";
import { localPageMarkdownUtils } from "@/models/local/page/localCoursePage";
import { quizMarkdownUtils } from "@/models/local/quiz/utils/quizMarkdownUtils";
import { promises as fs } from "fs";
import path from "path";

const basePath = process.env.STORAGE_DIRECTORY ?? "./storage";

const directoryExists = async (directoryPath: string): Promise<boolean> => {
  try {
    await fs.access(directoryPath);
    return true;
  } catch {
    return false;
  }
};

const saveSettings = async (course: LocalCourse, courseDirectory: string) => {
  const settingsFilePath = path.join(courseDirectory, "settings.yml");
  const settingsYaml = localCourseYamlUtils.settingsToYaml(course.settings);
  await fs.writeFile(settingsFilePath, settingsYaml);
};

// const saveModules = async (
//   course: LocalCourse,
//   courseDirectory: string,
//   previouslyStoredCourse?: LocalCourse
// ) => {
//   for (const localModule of course.modules) {
//     const moduleDirectory = path.join(courseDirectory, localModule.name);
//     if (!(await directoryExists(moduleDirectory))) {
//       await fs.mkdir(moduleDirectory, { recursive: true });
//     }

//     await saveQuizzes(course, localModule, previouslyStoredCourse);
//     await saveAssignments(course, localModule, previouslyStoredCourse);
//     await savePages(course, localModule, previouslyStoredCourse);
//   }

//   const moduleNames = course.modules.map((m) => m.name);
//   const moduleDirectories = await fs.readdir(courseDirectory, {
//     withFileTypes: true,
//   });

//   for (const dirent of moduleDirectories) {
//     if (dirent.isDirectory() && !moduleNames.includes(dirent.name)) {
//       const moduleDirPath = path.join(courseDirectory, dirent.name);
//       console.log(
//         `Deleting extra module directory, it was probably renamed ${moduleDirPath}`
//       );
//       await fs.rmdir(moduleDirPath, { recursive: true });
//     }
//   }
// };

// const saveQuizzes = async (
//   course: LocalCourse,
//   module: LocalModule,
//   previouslyStoredCourse?: LocalCourse
// ) => {
//   const quizzesDirectory = path.join(
//     basePath,
//     course.settings.name,
//     module.name,
//     "quizzes"
//   );
//   if (!(await directoryExists(quizzesDirectory))) {
//     await fs.mkdir(quizzesDirectory, { recursive: true });
//   }

//   for (const quiz of module.quizzes) {
//     const previousModule = previouslyStoredCourse?.modules.find(
//       (m) => m.name === module.name
//     );
//     const previousQuiz = previousModule?.quizzes.find((q) => q === quiz);

//     if (!previousQuiz) {
//       const markdownPath = path.join(quizzesDirectory, `${quiz.name}.md`);
//       const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz);
//       console.log(`Saving quiz ${markdownPath}`);
//       await fs.writeFile(markdownPath, quizMarkdown);
//     }
//   }

//   await removeOldQuizzes(quizzesDirectory, module);
// };

const saveAssignments = async (
  course: LocalCourse,
  module: LocalModule,
  previouslyStoredCourse?: LocalCourse
) => {
  const assignmentsDirectory = path.join(
    basePath,
    course.settings.name,
    module.name,
    "assignments"
  );
  if (!(await directoryExists(assignmentsDirectory))) {
    await fs.mkdir(assignmentsDirectory, { recursive: true });
  }

  for (const assignment of module.assignments) {
    const previousModule = previouslyStoredCourse?.modules.find(
      (m) => m.name === module.name
    );
    const previousAssignment = previousModule?.assignments.find(
      (a) => a === assignment
    );

    if (!previousAssignment) {
      const assignmentMarkdown = localAssignmentMarkdown.toMarkdown(assignment);
      const filePath = path.join(assignmentsDirectory, `${assignment.name}.md`);
      console.log(`Saving assignment ${filePath}`);
      await fs.writeFile(filePath, assignmentMarkdown);
    }
  }

  await removeOldAssignments(assignmentsDirectory, module);
};

const savePages = async (
  course: LocalCourse,
  module: LocalModule,
  previouslyStoredCourse?: LocalCourse
) => {
  const pagesDirectory = path.join(
    basePath,
    course.settings.name,
    module.name,
    "pages"
  );
  if (!(await directoryExists(pagesDirectory))) {
    await fs.mkdir(pagesDirectory, { recursive: true });
  }

  for (const page of module.pages) {
    const previousModule = previouslyStoredCourse?.modules.find(
      (m) => m.name === module.name
    );
    const previousPage = previousModule?.pages.find((p) => p === page);

    if (!previousPage) {
      const pageMarkdown = localPageMarkdownUtils.toMarkdown(page);
      const filePath = path.join(pagesDirectory, `${page.name}.md`);
      console.log(`Saving page ${filePath}`);
      await fs.writeFile(filePath, pageMarkdown);
    }
  }

  await removeOldPages(pagesDirectory, module);
};

const removeOldQuizzes = async (
  quizzesDirectory: string,
  module: LocalModule
) => {
  const existingFiles = await fs.readdir(quizzesDirectory);
  const quizFilesToDelete = existingFiles.filter((file) => {
    const quizMarkdownPath = path.join(
      quizzesDirectory,
      `${file.replace(".md", "")}.md`
    );
    return !module.quizzes.some(
      (quiz) =>
        path.join(quizzesDirectory, `${quiz.name}.md`) === quizMarkdownPath
    );
  });

  for (const file of quizFilesToDelete) {
    console.log(
      `Removing old quiz, it has probably been renamed ${path.join(
        quizzesDirectory,
        file
      )}`
    );
    await fs.unlink(path.join(quizzesDirectory, file));
  }
};

const removeOldAssignments = async (
  assignmentsDirectory: string,
  module: LocalModule
) => {
  const existingFiles = await fs.readdir(assignmentsDirectory);
  const assignmentFilesToDelete = existingFiles.filter((file) => {
    const assignmentMarkdownPath = path.join(
      assignmentsDirectory,
      `${file.replace(".md", "")}.md`
    );
    return !module.assignments.some(
      (assignment) =>
        path.join(assignmentsDirectory, `${assignment.name}.md`) ===
        assignmentMarkdownPath
    );
  });

  for (const file of assignmentFilesToDelete) {
    console.log(
      `Removing old assignment, it has probably been renamed ${path.join(
        assignmentsDirectory,
        file
      )}`
    );
    await fs.unlink(path.join(assignmentsDirectory, file));
  }
};

const removeOldPages = async (pagesDirectory: string, module: LocalModule) => {
  const existingFiles = await fs.readdir(pagesDirectory);
  const pageFilesToDelete = existingFiles.filter((file) => {
    const pageMarkdownPath = path.join(
      pagesDirectory,
      `${file.replace(".md", "")}.md`
    );
    return !module.pages.some(
      (page) =>
        path.join(pagesDirectory, `${page.name}.md`) === pageMarkdownPath
    );
  });

  for (const file of pageFilesToDelete) {
    console.log(
      `Removing old page, it has probably been renamed ${path.join(
        pagesDirectory,
        file
      )}`
    );
    await fs.unlink(path.join(pagesDirectory, file));
  }
};

// export const courseMarkdownSaver = {
//   async save(course: LocalCourse, previouslyStoredCourse?: LocalCourse) {
//     const courseDirectory = path.join(basePath, course.settings.name);
//     if (!(await directoryExists(courseDirectory))) {
//       await fs.mkdir(courseDirectory, { recursive: true });
//     }

//     await saveSettings(course, courseDirectory);
//     await saveModules(course, courseDirectory, previouslyStoredCourse);
//   },
// };
