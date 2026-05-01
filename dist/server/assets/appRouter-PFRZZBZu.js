import { t as __exportAll } from "./rolldown-runtime-rSIU-vHC.js";
import { a as zodGlobalSettings, t as getFeedbackDelimitersFromSettings } from "./globalSettingsUtils-gIgphMXr.js";
import { a as getGlobalSettings, i as getCoursePathByName, o as updateGlobalSettings, r as directoryOrFileExists, t as fileStorageService } from "./fileStorageService-CXiRrqQ4.js";
import { i as zodLocalCourseSettings, n as getDayOfWeek } from "./localCourseSettings-ROLFk4Xg.js";
import { n as zodLocalAssignment, r as assignmentMarkdownSerializer, t as localAssignmentMarkdown } from "./localAssignment-Cd9FVMF2.js";
import { r as getDateFromStringOrThrow, t as dateToMarkdownString } from "./timeUtils-DjiIXWRA.js";
import { n as zodLocalCoursePage, t as localPageMarkdownUtils } from "./localCoursePageModels-CSM7BJDo.js";
import { n as zodLocalQuizQuestion } from "./localQuizQuestion-DBCpCJHX.js";
import { t as quizMarkdownUtils } from "./quizMarkdownUtils-Ci_0iymX.js";
import { t as assertValidFileName } from "./fileNameValidation-Budh13ot.js";
import { i as parseLecture, n as lectureFolderName, r as lectureToString, t as getLectureWeekName } from "./lectureUtils-Bv-HaWlG.js";
import { i as canvasApi, n as rateLimitAwarePost, o as axiosClient } from "./canvasWebRequestUtils-BTUhiXsN.js";
import { promises } from "fs";
import path from "path";
import z$1, { z } from "zod";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import fs from "fs/promises";
import axios from "axios";
import FormData from "form-data";
//#region src/services/serverFunctions/trpcSetup.ts
var t = initTRPC.create({ transformer: superjson });
t.middleware;
var createCallerFactory = t.createCallerFactory;
t.mergeRouters;
var router = t.router;
//#endregion
//#region src/services/serverFunctions/publicProcedure.ts
var publicProcedure = t.procedure;
//#endregion
//#region src/features/local/course/courseItemTypes.ts
var typeToFolder = {
	Assignment: "assignments",
	Quiz: "quizzes",
	Page: "pages"
};
//#endregion
//#region src/features/local/course/courseItemFileStorageService.ts
var getItemFileNames = async ({ courseName, moduleName, type }) => {
	const courseDirectory = await getCoursePathByName(courseName);
	const folder = typeToFolder[type];
	const filePath = path.join(courseDirectory, moduleName, folder);
	if (!await directoryOrFileExists(filePath)) {
		console.log(`Error loading ${type}, ${folder} folder does not exist in ${filePath}`);
		await fs.mkdir(filePath);
	}
	return (await fs.readdir(filePath)).map((f) => f.replace(/\.md$/, ""));
};
var getItem = async ({ courseName, moduleName, name, type }) => {
	const courseDirectory = await getCoursePathByName(courseName);
	const folder = typeToFolder[type];
	const filePath = path.join(courseDirectory, moduleName, folder, name + ".md");
	if (!await directoryOrFileExists(filePath)) throw new Error(`${type} file not found: ${filePath}`);
	const rawFile = (await fs.readFile(filePath, "utf-8")).replace(/\r\n/g, "\n");
	if (type === "Assignment") return localAssignmentMarkdown.parseMarkdown(rawFile, name);
	else if (type === "Quiz") {
		const delimiters = getFeedbackDelimitersFromSettings(await getGlobalSettings());
		return quizMarkdownUtils.parseMarkdown(rawFile, name, delimiters);
	} else if (type === "Page") return localPageMarkdownUtils.parseMarkdown(rawFile, name);
	throw Error(`cannot read item, invalid type: ${type} in ${filePath}`);
};
var courseItemFileStorageService = {
	getItem,
	getItems: async ({ courseName, moduleName, type }) => {
		const fileNames = await getItemFileNames({
			courseName,
			moduleName,
			type
		});
		return (await Promise.all(fileNames.map(async (name) => {
			try {
				return await getItem({
					courseName,
					moduleName,
					name,
					type
				});
			} catch (e) {
				console.log(`Error loading ${type} ${name} in module ${moduleName}:`, e);
				return null;
			}
		}))).filter((a) => a !== null);
	}
};
//#endregion
//#region src/features/local/assignments/assignmentRouter.ts
var assignmentRouter = router({
	getAssignment: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		assignmentName: z.string()
	})).query(async ({ input: { courseName, moduleName, assignmentName } }) => {
		return await courseItemFileStorageService.getItem({
			courseName,
			moduleName,
			name: assignmentName,
			type: "Assignment"
		});
	}),
	getAllAssignments: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string()
	})).query(async ({ input: { courseName, moduleName } }) => {
		return await courseItemFileStorageService.getItems({
			courseName,
			moduleName,
			type: "Assignment"
		});
	}),
	createAssignment: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		assignmentName: z.string(),
		assignment: zodLocalAssignment
	})).mutation(async ({ input: { courseName, moduleName, assignmentName, assignment } }) => {
		await updateOrCreateAssignmentFile({
			courseName,
			moduleName,
			assignmentName,
			assignment
		});
	}),
	updateAssignment: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		previousModuleName: z.string(),
		previousAssignmentName: z.string(),
		assignmentName: z.string(),
		assignment: zodLocalAssignment
	})).mutation(async ({ input: { courseName, moduleName, assignmentName, assignment, previousModuleName, previousAssignmentName } }) => {
		await updateOrCreateAssignmentFile({
			courseName,
			moduleName,
			assignmentName,
			assignment
		});
		if (assignmentName !== previousAssignmentName || moduleName !== previousModuleName) await deleteAssignment({
			courseName,
			moduleName: previousModuleName,
			assignmentName: previousAssignmentName
		});
	}),
	deleteAssignment: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		assignmentName: z.string()
	})).mutation(async ({ input: { courseName, moduleName, assignmentName } }) => {
		await deleteAssignment({
			courseName,
			moduleName,
			assignmentName
		});
	})
});
async function updateOrCreateAssignmentFile({ courseName, moduleName, assignmentName, assignment }) {
	assertValidFileName(assignmentName);
	const courseDirectory = await getCoursePathByName(courseName);
	const folder = path.join(courseDirectory, moduleName, "assignments");
	await promises.mkdir(folder, { recursive: true });
	const filePath = path.join(courseDirectory, moduleName, "assignments", assignmentName + ".md");
	const assignmentMarkdown = assignmentMarkdownSerializer.toMarkdown(assignment);
	console.log(`Saving assignment ${filePath}`);
	await promises.writeFile(filePath, assignmentMarkdown);
}
async function deleteAssignment({ courseName, moduleName, assignmentName }) {
	const courseDirectory = await getCoursePathByName(courseName);
	const filePath = path.join(courseDirectory, moduleName, "assignments", assignmentName + ".md");
	console.log("removing assignment", filePath);
	await promises.unlink(filePath);
}
//#endregion
//#region src/features/local/utils/directoriesRouter.ts
var directoriesRouter = router({
	getEmptyDirectories: publicProcedure.query(async () => {
		return await fileStorageService.getEmptyDirectories();
	}),
	getDirectoryContents: publicProcedure.input(z$1.object({ relativePath: z$1.string() })).query(async ({ input: { relativePath } }) => {
		return await fileStorageService.getDirectoryContents(relativePath);
	}),
	directoryIsCourse: publicProcedure.input(z$1.object({ folderPath: z$1.string() })).query(async ({ input: { folderPath } }) => {
		return await fileStorageService.settings.folderIsCourse(folderPath);
	}),
	directoryExists: publicProcedure.input(z$1.object({ relativePath: z$1.string() })).query(async ({ input: { relativePath } }) => {
		return await fileStorageService.directoryExists(relativePath);
	})
});
//#endregion
//#region src/features/local/globalSettings/globalSettingsRouter.ts
var globalSettingsRouter = router({
	getGlobalSettings: publicProcedure.query(async () => {
		return await getGlobalSettings();
	}),
	updateGlobalSettings: publicProcedure.input(z$1.object({ globalSettings: zodGlobalSettings })).mutation(async ({ input: { globalSettings } }) => {
		return await updateGlobalSettings(globalSettings);
	})
});
//#endregion
//#region src/features/local/lectures/lectureModel.ts
var zodLecture = z.object({
	name: z.string(),
	date: z.string(),
	content: z.string()
});
//#endregion
//#region src/features/local/lectures/lectureRouter.ts
var lectureRouter = router({
	getLectures: publicProcedure.input(z.object({ courseName: z.string() })).query(async ({ input: { courseName } }) => {
		return await getLectures(courseName);
	}),
	updateLecture: publicProcedure.input(z.object({
		courseName: z.string(),
		lecture: zodLecture,
		previousDay: z.string().optional(),
		settings: zodLocalCourseSettings
	})).mutation(async ({ input: { courseName, settings, lecture, previousDay } }) => {
		await updateLecture(courseName, settings, lecture);
		if (previousDay && previousDay !== lecture.date) await deleteLecture(courseName, settings, previousDay);
	}),
	deleteLecture: publicProcedure.input(z.object({
		courseName: z.string(),
		lectureDay: z.string(),
		settings: zodLocalCourseSettings
	})).mutation(async ({ input: { courseName, settings, lectureDay } }) => {
		await deleteLecture(courseName, settings, lectureDay);
	})
});
async function getLectures(courseName) {
	const courseDirectory = await getCoursePathByName(courseName);
	const courseLectureRoot = path.join(courseDirectory, lectureFolderName);
	if (!await directoryExists(courseLectureRoot)) return [];
	const lectureWeekFolders = (await fs.readdir(courseLectureRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
	return await Promise.all(lectureWeekFolders.map(async (weekName) => {
		const weekBasePath = path.join(courseLectureRoot, weekName);
		const fileNames = await fs.readdir(weekBasePath);
		return {
			weekName,
			lectures: await Promise.all(fileNames.map(async (fileName) => {
				const filePath = path.join(weekBasePath, fileName);
				return parseLecture(await fs.readFile(filePath, "utf-8"));
			}))
		};
	}));
}
async function updateLecture(courseName, courseSettings, lecture) {
	const courseDirectory = await getCoursePathByName(courseName);
	const courseLectureRoot = path.join(courseDirectory, lectureFolderName);
	const lectureDate = getDateFromStringOrThrow(lecture.date, "lecture start date in update lecture");
	const weekFolderName = getLectureWeekName(courseSettings.startDate, lecture.date);
	const weekPath = path.join(courseLectureRoot, weekFolderName);
	if (!await directoryExists(weekPath)) await fs.mkdir(weekPath, { recursive: true });
	const lecturePath = path.join(weekPath, `${lectureDate.getDay()}-${getDayOfWeek(lectureDate)}.md`);
	const lectureContents = lectureToString(lecture);
	await fs.writeFile(lecturePath, lectureContents);
}
async function deleteLecture(courseName, courseSettings, dayAsString) {
	console.log("deleting lecture", courseName, dayAsString);
	const lectureDate = getDateFromStringOrThrow(dayAsString, "lecture start date in update lecture");
	const weekFolderName = getLectureWeekName(courseSettings.startDate, dayAsString);
	const courseDirectory = await getCoursePathByName(courseName);
	const courseLectureRoot = path.join(courseDirectory, lectureFolderName);
	const weekPath = path.join(courseLectureRoot, weekFolderName);
	const lecturePath = path.join(weekPath, `${lectureDate.getDay()}-${getDayOfWeek(lectureDate)}.md`);
	try {
		await fs.access(lecturePath);
		await fs.unlink(lecturePath);
		console.log(`File deleted: ${lecturePath}`);
	} catch (error) {
		if (error?.code === "ENOENT") console.log(`Cannot delete lecture, file does not exist: ${lecturePath}`);
		else throw error;
	}
}
var directoryExists = async (path) => {
	try {
		return (await fs.stat(path)).isDirectory();
	} catch {
		return false;
	}
};
//#endregion
//#region src/features/local/pages/pageRouter.ts
var pageRouter = router({
	getPage: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		pageName: z.string()
	})).query(async ({ input: { courseName, moduleName, pageName } }) => {
		return await courseItemFileStorageService.getItem({
			courseName,
			moduleName,
			name: pageName,
			type: "Page"
		});
	}),
	getAllPages: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string()
	})).query(async ({ input: { courseName, moduleName } }) => {
		return await courseItemFileStorageService.getItems({
			courseName,
			moduleName,
			type: "Page"
		});
	}),
	createPage: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		pageName: z.string(),
		page: zodLocalCoursePage
	})).mutation(async ({ input: { courseName, moduleName, pageName, page } }) => {
		await updatePageFile({
			courseName,
			moduleName,
			pageName,
			page
		});
	}),
	updatePage: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		previousModuleName: z.string(),
		previousPageName: z.string(),
		pageName: z.string(),
		page: zodLocalCoursePage
	})).mutation(async ({ input: { courseName, moduleName, pageName, page, previousModuleName, previousPageName } }) => {
		await updatePageFile({
			courseName,
			moduleName,
			pageName,
			page
		});
		if (pageName !== previousPageName || moduleName !== previousModuleName) await deletePageFile({
			courseName,
			moduleName: previousModuleName,
			pageName: previousPageName
		});
	}),
	deletePage: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		pageName: z.string()
	})).mutation(async ({ input: { courseName, moduleName, pageName } }) => {
		await deletePageFile({
			courseName,
			moduleName,
			pageName
		});
	})
});
async function updatePageFile({ courseName, moduleName, pageName, page }) {
	assertValidFileName(pageName);
	const courseDirectory = await getCoursePathByName(courseName);
	const folder = path.join(courseDirectory, moduleName, "pages");
	await promises.mkdir(folder, { recursive: true });
	const filePath = path.join(courseDirectory, moduleName, "pages", pageName + ".md");
	const pageMarkdown = localPageMarkdownUtils.toMarkdown(page);
	console.log(`Saving page ${filePath}`);
	await promises.writeFile(filePath, pageMarkdown);
}
async function deletePageFile({ courseName, moduleName, pageName }) {
	const courseDirectory = await getCoursePathByName(courseName);
	const filePath = path.join(courseDirectory, moduleName, "pages", pageName + ".md");
	console.log("removing page", filePath);
	await promises.unlink(filePath);
}
//#endregion
//#region src/features/local/quizzes/models/localQuiz.ts
var zodLocalQuiz = z.object({
	name: z.string(),
	description: z.string(),
	password: z.string().optional(),
	lockAt: z.string().optional(),
	dueAt: z.string(),
	shuffleAnswers: z.boolean(),
	showCorrectAnswers: z.boolean(),
	oneQuestionAtATime: z.boolean(),
	localAssignmentGroupName: z.string().optional(),
	allowedAttempts: z.number(),
	questions: zodLocalQuizQuestion.array()
});
//#endregion
//#region src/features/local/quizzes/quizRouter.ts
var quizRouter = router({
	getQuiz: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		quizName: z.string()
	})).query(async ({ input: { courseName, moduleName, quizName } }) => {
		return await courseItemFileStorageService.getItem({
			courseName,
			moduleName,
			name: quizName,
			type: "Quiz"
		});
	}),
	getAllQuizzes: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string()
	})).query(async ({ input: { courseName, moduleName } }) => {
		return await courseItemFileStorageService.getItems({
			courseName,
			moduleName,
			type: "Quiz"
		});
	}),
	createQuiz: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		quizName: z.string(),
		quiz: zodLocalQuiz
	})).mutation(async ({ input: { courseName, moduleName, quizName, quiz } }) => {
		await updateQuizFile({
			courseName,
			moduleName,
			quizName,
			quiz
		});
	}),
	updateQuiz: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		previousModuleName: z.string(),
		previousQuizName: z.string(),
		quizName: z.string(),
		quiz: zodLocalQuiz
	})).mutation(async ({ input: { courseName, moduleName, quizName, quiz, previousModuleName, previousQuizName } }) => {
		await updateQuizFile({
			courseName,
			moduleName,
			quizName,
			quiz
		});
		if (quizName !== previousQuizName || moduleName !== previousModuleName) await deleteQuizFile({
			courseName,
			moduleName: previousModuleName,
			quizName: previousQuizName
		});
	}),
	deleteQuiz: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string(),
		quizName: z.string()
	})).mutation(async ({ input: { courseName, moduleName, quizName } }) => {
		await deleteQuizFile({
			courseName,
			moduleName,
			quizName
		});
	})
});
async function deleteQuizFile({ courseName, moduleName, quizName }) {
	const courseDirectory = await getCoursePathByName(courseName);
	const filePath = path.join(courseDirectory, moduleName, "quizzes", quizName + ".md");
	console.log("removing quiz", filePath);
	await promises.unlink(filePath);
}
async function updateQuizFile({ courseName, moduleName, quizName, quiz }) {
	assertValidFileName(quizName);
	const courseDirectory = await getCoursePathByName(courseName);
	const folder = path.join(courseDirectory, moduleName, "quizzes");
	await promises.mkdir(folder, { recursive: true });
	const filePath = path.join(courseDirectory, moduleName, "quizzes", quizName + ".md");
	const delimiters = getFeedbackDelimitersFromSettings(await getGlobalSettings());
	const quizMarkdown = quizMarkdownUtils.toMarkdown(quiz, delimiters);
	console.log(`Saving quiz ${filePath}`);
	await promises.writeFile(filePath, quizMarkdown);
}
//#endregion
//#region src/features/local/utils/semesterTransferUtils.ts
var prepAssignmentForNewSemester = (assignment, oldSemesterStartDate, newSemesterStartDate) => {
	const descriptionWithoutGithubClassroom = replaceClassroomUrl(assignment.description);
	return {
		...assignment,
		description: descriptionWithoutGithubClassroom,
		dueAt: newDateOffset(assignment.dueAt, oldSemesterStartDate, newSemesterStartDate) ?? assignment.dueAt,
		lockAt: newDateOffset(assignment.lockAt, oldSemesterStartDate, newSemesterStartDate),
		githubClassroomAssignmentLink: void 0,
		githubClassroomAssignmentShareLink: void 0
	};
};
var prepQuizForNewSemester = (quiz, oldSemesterStartDate, newSemesterStartDate) => {
	const descriptionWithoutGithubClassroom = replaceClassroomUrl(quiz.description);
	return {
		...quiz,
		description: descriptionWithoutGithubClassroom,
		dueAt: newDateOffset(quiz.dueAt, oldSemesterStartDate, newSemesterStartDate) ?? quiz.dueAt,
		lockAt: newDateOffset(quiz.lockAt, oldSemesterStartDate, newSemesterStartDate)
	};
};
var prepPageForNewSemester = (page, oldSemesterStartDate, newSemesterStartDate) => {
	const updatedText = replaceClassroomUrl(page.text);
	return {
		...page,
		text: updatedText,
		dueAt: newDateOffset(page.dueAt, oldSemesterStartDate, newSemesterStartDate) ?? page.dueAt
	};
};
var prepLectureForNewSemester = (lecture, oldSemesterStartDate, newSemesterStartDate) => {
	const updatedText = replaceClassroomUrl(lecture.content);
	const newDateOnly = newDateOffset(lecture.date, oldSemesterStartDate, newSemesterStartDate)?.split(" ")[0];
	return {
		...lecture,
		content: updatedText,
		date: newDateOnly ?? lecture.date
	};
};
var replaceClassroomUrl = (value) => {
	return value.replace(/https:\/\/classroom\.github\.com\/[a-zA-Z0-9\/._-]+/g, "insert_github_classroom_url");
};
var newDateOffset = (dateString, oldSemesterStartDate, newSemesterStartDate) => {
	if (!dateString) return dateString;
	const oldStart = getDateFromStringOrThrow(oldSemesterStartDate, "semester start date in new semester offset");
	const newStart = getDateFromStringOrThrow(newSemesterStartDate, "new semester start date in new semester offset");
	const newUnixTime = getDateFromStringOrThrow(dateString, "date in new semester offset").getTime() - oldStart.getTime() + newStart.getTime();
	return dateToMarkdownString(new Date(newUnixTime));
};
//#endregion
//#region src/features/local/modules/moduleRouter.ts
var moduleRouter = router({
	getModuleNames: publicProcedure.input(z.object({ courseName: z.string() })).query(async ({ input: { courseName } }) => {
		return await getModuleNamesFromFiles(courseName);
	}),
	createModule: publicProcedure.input(z.object({
		courseName: z.string(),
		moduleName: z.string()
	})).mutation(async ({ input: { courseName, moduleName } }) => {
		await createModuleFile(courseName, moduleName);
	})
});
async function createModuleFile(courseName, moduleName) {
	const courseDirectory = await getCoursePathByName(courseName);
	await promises.mkdir(courseDirectory + "/" + moduleName, { recursive: true });
}
async function getModuleNamesFromFiles(courseName) {
	const courseDirectory = await getCoursePathByName(courseName);
	const modulePromises = (await promises.readdir(courseDirectory, { withFileTypes: true })).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
	return (await Promise.all(modulePromises)).filter((m) => m !== "00 - lectures" && !m.startsWith(".")).sort((a, b) => a.localeCompare(b));
}
//#endregion
//#region src/features/local/course/settingsRouter.ts
var settingsRouter = router({
	allCoursesSettings: publicProcedure.query(async () => {
		return await fileStorageService.settings.getAllCoursesSettings();
	}),
	courseSettings: publicProcedure.input(z.object({ courseName: z.string() })).query(async ({ input: { courseName } }) => {
		const settingsList = await fileStorageService.settings.getAllCoursesSettings();
		const s = settingsList.find((s) => s.name === courseName);
		if (!s) {
			console.log(courseName, settingsList);
			throw Error("Could not find settings for course " + courseName);
		}
		return s;
	}),
	createCourse: publicProcedure.input(z.object({
		name: z.string(),
		directory: z.string(),
		settings: zodLocalCourseSettings,
		settingsFromCourseToImport: zodLocalCourseSettings.optional()
	})).mutation(async ({ input: { settings, settingsFromCourseToImport, name, directory } }) => {
		console.log("creating in directory", directory);
		await fileStorageService.settings.createCourseSettings(settings, directory);
		const globalSettings = await getGlobalSettings();
		await updateGlobalSettings({
			...globalSettings,
			courses: [...globalSettings.courses, {
				name,
				path: directory
			}]
		});
		if (settingsFromCourseToImport) await migrateCourseContent(settingsFromCourseToImport, settings);
	}),
	updateSettings: publicProcedure.input(z.object({ settings: zodLocalCourseSettings })).mutation(async ({ input: { settings } }) => {
		await fileStorageService.settings.updateCourseSettings(settings.name, settings);
	})
});
async function migrateCourseContent(settingsFromCourseToImport, settings) {
	const oldCourseName = settingsFromCourseToImport.name;
	const newCourseName = settings.name;
	console.log("migrating content from ", oldCourseName, "to ", newCourseName);
	const oldModules = await getModuleNamesFromFiles(oldCourseName);
	await Promise.all(oldModules.map(async (moduleName) => {
		await createModuleFile(newCourseName, moduleName);
		const [oldAssignments, oldQuizzes, oldPages, oldLecturesByWeek] = await Promise.all([
			await courseItemFileStorageService.getItems({
				courseName: oldCourseName,
				moduleName,
				type: "Assignment"
			}),
			await courseItemFileStorageService.getItems({
				courseName: oldCourseName,
				moduleName,
				type: "Quiz"
			}),
			await courseItemFileStorageService.getItems({
				courseName: oldCourseName,
				moduleName,
				type: "Page"
			}),
			await getLectures(oldCourseName)
		]);
		const updateAssignmentPromises = oldAssignments.map(async (oldAssignment) => {
			const newAssignment = prepAssignmentForNewSemester(oldAssignment, settingsFromCourseToImport.startDate, settings.startDate);
			await updateOrCreateAssignmentFile({
				courseName: newCourseName,
				moduleName,
				assignmentName: newAssignment.name,
				assignment: newAssignment
			});
		});
		const updateQuizzesPromises = oldQuizzes.map(async (oldQuiz) => {
			const newQuiz = prepQuizForNewSemester(oldQuiz, settingsFromCourseToImport.startDate, settings.startDate);
			await updateQuizFile({
				courseName: newCourseName,
				moduleName,
				quizName: newQuiz.name,
				quiz: newQuiz
			});
		});
		const updatePagesPromises = oldPages.map(async (oldPage) => {
			const newPage = prepPageForNewSemester(oldPage, settingsFromCourseToImport.startDate, settings.startDate);
			await updatePageFile({
				courseName: newCourseName,
				moduleName,
				pageName: newPage.name,
				page: newPage
			});
		});
		const updateLecturePromises = oldLecturesByWeek.flatMap(async (oldLectureByWeek) => oldLectureByWeek.lectures.map(async (oldLecture) => {
			await updateLecture(newCourseName, settings, prepLectureForNewSemester(oldLecture, settingsFromCourseToImport.startDate, settings.startDate));
		}));
		await Promise.all([
			...updateAssignmentPromises,
			...updateQuizzesPromises,
			...updatePagesPromises,
			...updateLecturePromises
		]);
	}));
}
//#endregion
//#region src/features/canvas/services/files/canvasFileService.ts
var downloadUrlToTempDirectory = async (sourceUrl) => {
	try {
		const fileName = path.basename(new URL(sourceUrl).pathname) || `tempfile-${Date.now()}`;
		const tempFilePath = path.join("/tmp", fileName);
		const response = await axios.get(sourceUrl, { responseType: "arraybuffer" });
		await fs.writeFile(tempFilePath, response.data);
		return {
			fileName: tempFilePath,
			success: true
		};
	} catch (error) {
		console.log("Error downloading or saving the file:", sourceUrl, error);
		return {
			fileName: sourceUrl,
			success: false
		};
	}
};
var getFileSize = async (pathToFile) => {
	try {
		return (await fs.stat(pathToFile)).size;
	} catch (error) {
		console.error("Error reading file size:", error);
		throw error;
	}
};
var uploadToCanvasPart1 = async (pathToUpload, canvasCourseId) => {
	try {
		const url = `${canvasApi}/courses/${canvasCourseId}/files`;
		const formData = new FormData();
		formData.append("name", path.basename(pathToUpload));
		formData.append("size", (await getFileSize(pathToUpload)).toString());
		const response = await rateLimitAwarePost(url, formData);
		return {
			upload_url: response.data.upload_url,
			upload_params: response.data.upload_params
		};
	} catch (error) {
		console.error("Error uploading file to Canvas part 1:", error);
		throw error;
	}
};
var uploadToCanvasPart2 = async ({ pathToUpload, upload_url, upload_params }) => {
	try {
		const formData = new FormData();
		Object.keys(upload_params).forEach((key) => {
			formData.append(key, upload_params[key]);
		});
		const fileBuffer = await fs.readFile(pathToUpload);
		const fileName = path.basename(pathToUpload);
		formData.append("file", fileBuffer, fileName);
		const response = await rateLimitAwarePost(upload_url, formData, {
			headers: formData.getHeaders(),
			validateStatus: (status) => status < 500
		});
		if (response.status === 301) {
			const redirectUrl = response.headers.location;
			if (!redirectUrl) throw new Error("Redirect URL not provided in the Location header on redirect from second part of canvas file upload");
			const redirectResponse = await axiosClient.get(redirectUrl);
			console.log("redirect response", redirectResponse.data);
		}
		return response.data.url;
	} catch (error) {
		console.error("Error uploading file to Canvas part 2:", error);
		throw error;
	}
};
//#endregion
//#region src/features/canvas/services/canvasFileRouter.ts
var fileStorageLocation = process.env.FILE_STORAGE_LOCATION ?? "/app/public";
var canvasFileRouter = router({ getCanvasFileUrl: publicProcedure.input(z.object({
	sourceUrl: z.string(),
	canvasCourseId: z.number()
})).mutation(async ({ input: { sourceUrl, canvasCourseId } }) => {
	const { fileName: localFile, success } = sourceUrl.startsWith("/") ? {
		fileName: fileStorageLocation + sourceUrl,
		success: true
	} : await downloadUrlToTempDirectory(sourceUrl);
	if (!success) {
		console.log("could not download file, returning sourceUrl", sourceUrl);
		return sourceUrl;
	}
	console.log("local temp file", localFile);
	const { upload_url, upload_params } = await uploadToCanvasPart1(localFile, canvasCourseId);
	console.log("part 1 done", upload_url, upload_params);
	const canvasUrl = await uploadToCanvasPart2({
		pathToUpload: localFile,
		upload_url,
		upload_params
	});
	console.log("canvas url done", canvasUrl);
	return canvasUrl;
}) });
//#endregion
//#region src/services/serverFunctions/appRouter.ts
var appRouter_exports = /* @__PURE__ */ __exportAll({ trpcAppRouter: () => trpcAppRouter });
var trpcAppRouter = router({
	assignment: assignmentRouter,
	lectures: lectureRouter,
	settings: settingsRouter,
	quiz: quizRouter,
	page: pageRouter,
	module: moduleRouter,
	directories: directoriesRouter,
	canvasFile: canvasFileRouter,
	globalSettings: globalSettingsRouter
});
createCallerFactory(trpcAppRouter);
//#endregion
export { trpcAppRouter as n, appRouter_exports as t };
