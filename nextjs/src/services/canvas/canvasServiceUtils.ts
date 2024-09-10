// services/canvasServiceUtils.ts

import { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";
import { webRequestor } from "./webRequestor";

const getNextUrl = (
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders
): string | undefined => {
  const linkHeader: string | undefined =
    typeof headers.get === "function"
      ? (headers.get("link") as string)
      : ((headers as RawAxiosResponseHeaders)["link"] as string);

  if (!linkHeader) return undefined;

  const links = linkHeader.split(",").map((link) => link.trim());
  const nextLink = links.find((link) => link.includes('rel="next"'));

  if (!nextLink) return undefined;

  const nextUrl = nextLink.split(";")[0].trim().slice(1, -1);
  return nextUrl;
};

export const canvasServiceUtils = {
  async paginatedRequest<T>(request: { url: string }): Promise<T[]> {
    var requestCount = 1;
    const url = new URL(request.url);
    url.searchParams.set("per_page", "100");

    const { data: firstData, response: firstResponse } =
      await webRequestor.get<T>(url.toString());

    var returnData: T[] = firstData ? [firstData] : [];
    var nextUrl = getNextUrl(firstResponse.headers);

    while (nextUrl) {
      requestCount += 1;
      const { data, response } = await webRequestor.get<T>(nextUrl);
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
