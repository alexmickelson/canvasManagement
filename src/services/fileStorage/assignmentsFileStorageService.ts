import {
  localAssignmentMarkdown,
  LocalAssignment,
} from "@/features/local/assignments/models/localAssignment";
import { assignmentMarkdownSerializer } from "@/features/local/assignments/models/utils/assignmentMarkdownSerializer";
import path from "path";
import { directoryOrFileExists } from "./utils/fileSystemUtils";
import { promises as fs } from "fs";
import { courseItemFileStorageService } from "./courseItemFileStorageService";
import { getCoursePathByName } from "./globalSettingsFileStorageService";

const getAssignmentNames = async (courseName: string, moduleName: string) => {
  const courseDirectory = await getCoursePathByName(courseName);
  const filePath = path.join(courseDirectory, moduleName, "assignments");
  if (!(await directoryOrFileExists(filePath))) {
    console.log(
      `Error loading course by name, assignments folder does not exist in ${filePath}`
    );
    // await fs.mkdir(filePath);
    return [];
  }

  const assignmentFiles = await fs.readdir(filePath);
  return assignmentFiles.map((f) => f.replace(/\.md$/, ""));
};
const getAssignment = async (
  courseName: string,
  moduleName: string,
  assignmentName: string
) => {
  const courseDirectory = await getCoursePathByName(courseName);
  const filePath = path.join(
    courseDirectory,
    moduleName,
    "assignments",
    assignmentName + ".md"
  );
  const rawFile = (await fs.readFile(filePath, "utf-8")).replace(/\r\n/g, "\n");
  return localAssignmentMarkdown.parseMarkdown(rawFile, assignmentName);
};

export const assignmentsFileStorageService = {
  getAssignmentNames,
  getAssignment,
  async getAssignments(courseName: string, moduleName: string) {
    return await courseItemFileStorageService.getItems(
      courseName,
      moduleName,
      "Assignment"
    );
  },
  async updateOrCreateAssignment({
    courseName,
    moduleName,
    assignmentName,
    assignment,
  }: {
    courseName: string;
    moduleName: string;
    assignmentName: string;
    assignment: LocalAssignment;
  }) {
    const courseDirectory = await getCoursePathByName(courseName);
    const folder = path.join(courseDirectory, moduleName, "assignments");
    await fs.mkdir(folder, { recursive: true });

    const filePath = path.join(
      courseDirectory,
      moduleName,
      "assignments",
      assignmentName + ".md"
    );

    const assignmentMarkdown =
      assignmentMarkdownSerializer.toMarkdown(assignment);
    console.log(`Saving assignment ${filePath}`);

    await fs.writeFile(filePath, assignmentMarkdown);
  },

  async delete({
    courseName,
    moduleName,
    assignmentName,
  }: {
    courseName: string;
    moduleName: string;
    assignmentName: string;
  }) {
    const courseDirectory = await getCoursePathByName(courseName);
    const filePath = path.join(
      courseDirectory,
      moduleName,
      "assignments",
      assignmentName + ".md"
    );
    console.log("removing assignment", filePath);
    await fs.unlink(filePath);
  },
};
