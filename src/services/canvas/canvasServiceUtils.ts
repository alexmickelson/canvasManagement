// services/canvasServiceUtils.ts

import { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";
import { axiosClient } from "../axiosUtils";

export const baseCanvasUrl = "https://snow.instructure.com";
export const canvasApi = baseCanvasUrl + "/api/v1";

const getNextUrl = (
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders
): string | undefined => {
  const linkHeader: string | undefined =
    typeof headers.get === "function"
      ? (headers.get("link") as string)
      : ((headers as RawAxiosResponseHeaders)["link"] as string);

  if (!linkHeader) {
    console.log("could not find link header in the response");
    return undefined;
  }

  const links = linkHeader.split(",").map((link) => link.trim());
  const nextLink = links.find((link) => link.includes('rel="next"'));

  if (!nextLink) {
    // console.log(
    //   "could not find next url in link header, reached end of pagination"
    // );
    return undefined;
  }

  const nextUrl = nextLink.split(";")[0].trim().slice(1, -1);
  return nextUrl;
};

export async function paginatedRequest<T extends any[]>(request: {
  url: string;
}): Promise<T> {
  var requestCount = 1;
  const url = new URL(request.url);
  url.searchParams.set("per_page", "100");

  const { data: firstData, headers: firstHeaders } = await axiosClient.get<T>(
    url.toString()
  );

  var returnData = Array.isArray(firstData) ? [...firstData] : [firstData]; // terms come across as nested objects {enrolmentTerms: terms[]}
  var nextUrl = getNextUrl(firstHeaders);

  while (nextUrl) {
    requestCount += 1;
    const { data, headers } = await axiosClient.get<T>(nextUrl);
    if (data) {
      returnData = returnData.concat(Array.isArray(data) ? [...data] : [data]);
    }
    nextUrl = getNextUrl(headers);
  }

  if (requestCount > 1) {
    console.log(
      `Requesting ${typeof returnData} took ${requestCount} requests`
    );
  }

  return returnData as T;
}


