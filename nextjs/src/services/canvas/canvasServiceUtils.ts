// services/canvasServiceUtils.ts

import { webRequestor } from "./webRequestor";

const BASE_URL = "https://snow.instructure.com/api/v1/";

const getNextUrl = (headers: Headers): string | undefined => {
  const linkHeader = headers.get("Link");
  if (!linkHeader) return undefined;

  const links = linkHeader.split(",").map((link) => link.trim());
  const nextLink = links.find((link) => link.includes('rel="next"'));

  if (!nextLink) return undefined;

  const nextUrl = nextLink.split(";")[0].trim().slice(1, -1);
  return nextUrl.replace(BASE_URL, "").trim();
};

export const canvasServiceUtils = {
  async paginatedRequest<T>(request: { url: string }): Promise<T[]> {
    var requestCount = 1;
    const url = new URL(request.url!, BASE_URL);
    url.searchParams.set("per_page", "100");

    const { data: firstData, response: firstResponse } =
      await webRequestor.get<T>(url.toString());

    if (!firstResponse.ok) {
      console.error(
        "error in response",
        firstResponse.statusText,
        firstResponse.body
      );
      throw new Error("error in response");
    }

    var returnData: T[] = firstData ? [firstData] : [];
    var nextUrl = getNextUrl(firstResponse.headers);

    while (nextUrl) {
      requestCount += 1;
      const {data, response} = await webRequestor.get<T>(nextUrl);
      if (data) {
        returnData = [...returnData, data];
      }
      nextUrl = getNextUrl(response.headers);
    }

    if (requestCount > 1) {
      console.log(
        `Requesting ${typeof returnData} took ${requestCount} requests`
      );
    }

    return returnData;
  },
};
