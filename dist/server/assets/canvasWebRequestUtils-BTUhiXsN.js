import { isServer } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
//#region src/services/axiosUtils.ts
var canvasBaseUrl = "https://snow.instructure.com/api/v1/";
var axiosClient = axios.create();
if (!isServer) axiosClient.interceptors.request.use((config) => {
	if (config.url && config.url.startsWith(canvasBaseUrl)) config.url = config.url.replace(canvasBaseUrl, "/api/canvas/");
	return config;
});
else {
	const token = process.env.CANVAS_TOKEN;
	if (!token) console.error("CANVAS_TOKEN not in environment");
	else axiosClient.interceptors.request.use((config) => {
		if (config.url && config.url.startsWith(canvasBaseUrl)) config.headers.set("Authorization", `Bearer ${token}`);
		return config;
	});
}
axiosClient.interceptors.response.use((response) => response, (error) => {
	const errorMessage = getAxiosErrorMessage(error);
	if (errorMessage) toast.error(errorMessage);
	return Promise.reject(error);
});
function getAxiosErrorMessage(error) {
	if (error.response) {
		console.log("response error", error.response);
		const responseErrorText = typeof error.response.data === "object" ? error.response.data.error : error.response.data;
		if (!isServer && error.config?.method?.toUpperCase() !== "GET" && error.response.status !== 403 && !error.config?.url?.includes("https://snow.instructure.com")) return `Error: ${error.response.status} - ${responseErrorText}, ${decodeURI(error.response.config.url ?? "")}`;
	} else if (error.request) {
		if (!isServer) return "Error: No response from server";
	} else if (!isServer) return `Error: ${error.message}`;
	return "";
}
//#endregion
//#region src/features/canvas/services/canvasServiceUtils.ts
var baseCanvasUrl = "https://snow.instructure.com";
var canvasApi = baseCanvasUrl + "/api/v1";
var getNextUrl = (headers) => {
	const linkHeader = typeof headers.get === "function" ? headers.get("link") : headers["link"];
	if (!linkHeader) {
		console.log("could not find link header in the response");
		return;
	}
	const nextLink = linkHeader.split(",").map((link) => link.trim()).find((link) => link.includes("rel=\"next\""));
	if (!nextLink) return;
	return nextLink.split(";")[0].trim().slice(1, -1);
};
async function paginatedRequest(request) {
	let requestCount = 1;
	const url = new URL(request.url);
	url.searchParams.set("per_page", "100");
	const { data: firstData, headers: firstHeaders } = await axiosClient.get(url.toString());
	let returnData = Array.isArray(firstData) ? [...firstData] : [firstData];
	let nextUrl = getNextUrl(firstHeaders);
	while (nextUrl) {
		requestCount += 1;
		const { data, headers } = await axiosClient.get(nextUrl);
		if (data) returnData = returnData.concat(Array.isArray(data) ? [...data] : [data]);
		nextUrl = getNextUrl(headers);
	}
	if (requestCount > 1) console.log(`Requesting ${typeof returnData} took ${requestCount} requests`);
	return returnData;
}
//#endregion
//#region src/features/canvas/services/canvasWebRequestUtils.ts
var rateLimitRetryCount = 6;
var rateLimitSleepInterval = 1e3;
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var isRateLimited = async (response) => {
	const content = await response.data;
	return response.status === 403 && content.includes("403 Forbidden (Rate Limit Exceeded)");
};
var rateLimitAwarePost = async (url, body, config, retryCount = 0) => {
	const response = await axiosClient.post(url, body, config);
	if (await isRateLimited(response)) {
		if (retryCount < rateLimitRetryCount) {
			console.info(`Hit rate limit on post, retry count is ${retryCount} / ${rateLimitRetryCount}, retrying`);
			await sleep(rateLimitSleepInterval);
			return await rateLimitAwarePost(url, body, config, retryCount + 1);
		}
	}
	return response;
};
var rateLimitAwareDelete = async (url, retryCount = 0) => {
	try {
		if (await isRateLimited(await axiosClient.delete(url))) {
			console.info("After delete response in rate limited");
			await sleep(rateLimitSleepInterval);
			return await rateLimitAwareDelete(url, retryCount + 1);
		}
	} catch (e) {
		if (e.response?.status === 403) if (retryCount < rateLimitRetryCount) {
			console.info(`Hit rate limit in delete, retry count is ${retryCount} / ${rateLimitRetryCount}, retrying`);
			await sleep(rateLimitSleepInterval);
			return await rateLimitAwareDelete(url, retryCount + 1);
		} else console.info(`Hit rate limit in delete, ${rateLimitRetryCount} retries did not fix it`);
		throw e;
	}
};
//#endregion
export { paginatedRequest as a, canvasApi as i, rateLimitAwarePost as n, axiosClient as o, baseCanvasUrl as r, rateLimitAwareDelete as t };
