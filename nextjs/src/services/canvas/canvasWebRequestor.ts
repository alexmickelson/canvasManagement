import { AxiosResponse } from "axios";
import { axiosClient } from "../axiosUtils";

type FetchOptions = Omit<RequestInit, "method">;

const rateLimitRetryCount = 6;
const rateLimitSleepInterval = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isRateLimited = async (
  response: AxiosResponse
): Promise<boolean> => {
  const content = await response.data;
  return (
    response.status === 403 &&
    content.includes("403 Forbidden (Rate Limit Exceeded)")
  );
};

const rateLimitAwarePost = async (url: string, body: any, retryCount = 0) => {
  const response = await axiosClient.post(url, body);

  if (await isRateLimited(response)) {
    if (retryCount < rateLimitRetryCount) {
      console.info(
        `Hit rate limit on post, retry count is ${retryCount} / ${rateLimitRetryCount}, retrying`
      );
      await sleep(rateLimitSleepInterval);
      return await rateLimitAwarePost(url, body, retryCount + 1);
    }
  }

  return response;
};

export const rateLimitAwareDelete = async (
  url: string,
  retryCount = 0
): Promise<void> => {
  try {
    const response = await axiosClient.delete(url);

    if (await isRateLimited(response)) {
      console.info("After delete response in rate limited");
      await sleep(rateLimitSleepInterval);
      return await rateLimitAwareDelete(url, retryCount + 1);
    }
  } catch (e) {
    const error = e as Error & { response?: Response };
    if (error.response?.status === 403) {
      if (retryCount < rateLimitRetryCount) {
        console.info(
          `Hit rate limit in delete, retry count is ${retryCount} / ${rateLimitRetryCount}, retrying`
        );
        await sleep(rateLimitSleepInterval);
        return await rateLimitAwareDelete(url, retryCount + 1);
      } else {
        console.info(
          `Hit rate limit in delete, ${rateLimitRetryCount} retries did not fix it`
        );
      }
    }
    throw e;
  }
};
