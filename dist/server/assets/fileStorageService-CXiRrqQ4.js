import { t as __exportAll } from "./rolldown-runtime-rSIU-vHC.js";
import { a as zodGlobalSettings, n as globalSettingsToYaml, r as parseGlobalSettingsYaml } from "./globalSettingsUtils-gIgphMXr.js";
import { t as AssignmentSubmissionType } from "./assignmentSubmissionType-CBVSV8hE.js";
import { r as localCourseYamlUtils } from "./localCourseSettings-ROLFk4Xg.js";
import { promises } from "fs";
import path from "path";
//#region src/features/local/globalSettings/globalSettingsFileStorageService.ts
var SETTINGS_FILE_PATH = process.env.SETTINGS_FILE_PATH || "./globalSettings.yml";
var getGlobalSettings = async () => {
	try {
		await promises.access(SETTINGS_FILE_PATH);
	} catch (err) {
		console.log(err);
		throw new Error(`Global Settings file does not exist at path: ${SETTINGS_FILE_PATH}`);
	}
	return parseGlobalSettingsYaml(process.env.GLOBAL_SETTINGS ? process.env.GLOBAL_SETTINGS : await promises.readFile(SETTINGS_FILE_PATH, "utf-8"));
};
var getCoursePathByName = async (courseName) => {
	const course = (await getGlobalSettings()).courses.find((c) => c.name === courseName);
	if (!course) throw new Error(`Course with name ${courseName} not found in global settings`);
	return path.join(basePath, course.path);
};
var updateGlobalSettings = async (globalSettings) => {
	const globalSettingsString = globalSettingsToYaml(zodGlobalSettings.parse(globalSettings));
	await promises.writeFile(SETTINGS_FILE_PATH, globalSettingsString, "utf-8");
};
//#endregion
//#region src/features/local/utils/fileSystemUtils.ts
var directoryOrFileExists = async (directoryPath) => {
	try {
		await promises.access(directoryPath);
		return true;
	} catch {
		return false;
	}
};
var basePath = process.env.STORAGE_DIRECTORY ?? "./storage";
console.log("base path", basePath);
//#endregion
//#region src/features/local/course/settingsFileStorageService.ts
var getCourseSettings = async (course) => {
	const courseDirectory = path.join(basePath, course.path);
	const settingsPath = path.join(courseDirectory, "settings.yml");
	if (!await directoryOrFileExists(settingsPath)) {
		const errorMessage = `could not find settings for ${course.name}, settings file ${settingsPath}`;
		console.log(errorMessage);
		throw new Error(errorMessage);
	}
	const settingsString = await promises.readFile(settingsPath, "utf-8");
	return {
		...populateDefaultValues(localCourseYamlUtils.parseSettingYaml(settingsString)),
		name: course.name
	};
};
var populateDefaultValues = (settingsFromFile) => {
	const defaultSubmissionType = [AssignmentSubmissionType.ONLINE_TEXT_ENTRY, AssignmentSubmissionType.ONLINE_UPLOAD];
	const defaultFileUploadTypes = [
		"pdf",
		"jpg",
		"jpeg"
	];
	return {
		...settingsFromFile,
		defaultAssignmentSubmissionTypes: settingsFromFile.defaultAssignmentSubmissionTypes || defaultSubmissionType,
		defaultFileUploadTypes: settingsFromFile.defaultFileUploadTypes || defaultFileUploadTypes,
		holidays: Array.isArray(settingsFromFile.holidays) ? settingsFromFile.holidays : [],
		assets: Array.isArray(settingsFromFile.assets) ? settingsFromFile.assets : []
	};
};
var settingsFileStorageService = {
	getCourseSettings,
	async getAllCoursesSettings() {
		const courses = (await getGlobalSettings()).courses;
		return await Promise.all(courses.map(async (c) => await getCourseSettings(c)));
	},
	async updateCourseSettings(courseName, settings) {
		const courseDirectory = await getCoursePathByName(courseName);
		const settingsPath = path.join(courseDirectory, "settings.yml");
		const { name: _, ...settingsWithoutName } = settings;
		const settingsMarkdown = localCourseYamlUtils.settingsToYaml(settingsWithoutName);
		console.log(`Saving settings ${settingsPath}`);
		await promises.writeFile(settingsPath, settingsMarkdown);
	},
	async createCourseSettings(settings, directory) {
		const courseDirectory = path.join(basePath, directory);
		if (await directoryOrFileExists(courseDirectory)) throw new Error(`Course path "${courseDirectory}" already exists. Create course in a new folder.`);
		await promises.mkdir(courseDirectory, { recursive: true });
		const settingsPath = path.join(courseDirectory, "settings.yml");
		const { name: _, ...settingsWithoutName } = settings;
		const settingsMarkdown = localCourseYamlUtils.settingsToYaml(settingsWithoutName);
		console.log(`Saving settings ${settingsPath}`);
		await promises.writeFile(settingsPath, settingsMarkdown);
	},
	async folderIsCourse(folderPath) {
		if (!await directoryOrFileExists(path.join(basePath, folderPath, "settings.yml"))) return false;
		return true;
	}
};
//#endregion
//#region src/features/local/utils/fileStorageService.ts
var fileStorageService_exports = /* @__PURE__ */ __exportAll({ fileStorageService: () => fileStorageService });
var fileStorageService = {
	settings: settingsFileStorageService,
	async getEmptyDirectories() {
		if (!await directoryOrFileExists(basePath)) throw new Error(`Cannot get empty directories, ${basePath} does not exist`);
		const directories = await promises.readdir(basePath, { withFileTypes: true });
		return (await Promise.all(directories.filter((dirent) => dirent.isDirectory()).map((dirent) => path.join(dirent.name)).map(async (directory) => {
			return {
				directory,
				files: await promises.readdir(path.join(basePath, directory))
			};
		}))).filter(({ files }) => files.length === 0).map(({ directory }) => directory);
	},
	async createCourseFolderForTesting(courseName) {
		const courseDirectory = await getCoursePathByName(courseName);
		await promises.mkdir(courseDirectory, { recursive: true });
	},
	async createModuleFolderForTesting(courseName, moduleName) {
		const courseDirectory = path.join(basePath, courseName, moduleName);
		await promises.mkdir(courseDirectory, { recursive: true });
	},
	async getDirectoryContents(relativePath) {
		const fullPath = path.join(basePath, relativePath);
		const resolvedBase = path.resolve(basePath);
		if (!path.resolve(fullPath).startsWith(resolvedBase)) return {
			files: [],
			folders: []
		};
		if (!await directoryOrFileExists(fullPath)) throw new Error(`Directory ${fullPath} does not exist`);
		const contents = await promises.readdir(fullPath, { withFileTypes: true });
		const files = [];
		const folders = [];
		for (const dirent of contents) if (dirent.isDirectory()) folders.push(dirent.name);
		else if (dirent.isFile()) files.push(dirent.name);
		return {
			files,
			folders
		};
	},
	async directoryExists(relativePath) {
		const fullPath = path.join(basePath, relativePath);
		const resolvedBase = path.resolve(basePath);
		if (!path.resolve(fullPath).startsWith(resolvedBase)) return false;
		return await directoryOrFileExists(fullPath);
	}
};
//#endregion
export { getGlobalSettings as a, getCoursePathByName as i, fileStorageService_exports as n, updateGlobalSettings as o, directoryOrFileExists as r, fileStorageService as t };
