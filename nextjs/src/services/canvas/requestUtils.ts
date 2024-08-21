
type FetchOptions = Omit<RequestInit, "method">;

const token = process.env.CANVAS_TOKEN;
if (!token) {
  throw new Error("CANVAS_TOKEN not in environment");
}

const baseUrl = `${process.env.CANVAS_URL}/api/v1/`;
const rateLimitRetryCount = 6;
const rateLimitSleepInterval = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimited = async (response: Response): Promise<boolean> => {
  const content = await response.text();
  return (
    response.status === 403 &&
    content.includes("403 Forbidden (Rate Limit Exceeded)")
  );
};

const deserialize = async <T>(response: Response): Promise<T | null> => {
  if (!response.ok) {
    console.error(`Error with response to ${response.url} ${response.status}`);
    throw new Error(
      `Error with response to ${response.url} ${response.status}`
    );
  }
  try {
    return (await response.json()) as T;
  } catch (e) {
    console.error(`An error occurred during deserialization: ${e}`);
    throw e;
  }
};

const rateLimitAwarePostAsync = async (
  url: string,
  options: FetchOptions,
  retryCount = 0
): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    method: "POST",
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (await isRateLimited(response)) {
    if (retryCount < rateLimitRetryCount) {
      console.info(
        `Hit rate limit on post, retry count is ${retryCount} / ${rateLimitRetryCount}, retrying`
      );
      await sleep(rateLimitSleepInterval);
      return await rateLimitAwarePostAsync(url, options, retryCount + 1);
    }
  }

  if (!response.ok) {
    const content = await response.text();
    console.error(`Error with response, response content: ${content}`);
    throw new Error(
      `Error post response, retrycount: ${retryCount}, ratelimited: ${await isRateLimited(
        response
      )}, code: ${response.status}, response content: ${content}`
    );
  }
  return response;
};

const recursiveDeleteAsync = async (
  url: string,
  options: FetchOptions,
  retryCount = 0
): Promise<Response> => {
  try {
    const response = await fetch(url, {
      ...options,
      method: "DELETE",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (await isRateLimited(response)) {
      console.info("After delete response in rate limited");
      await sleep(rateLimitSleepInterval);
      return await recursiveDeleteAsync(url, options, retryCount + 1);
    }

    return response;
  } catch (e) {
    const error = e as Error & { response?: Response };
    if (error.response?.status === 403) {
      if (retryCount < rateLimitRetryCount) {
        console.info(
          `Hit rate limit in delete, retry count is ${retryCount} / ${rateLimitRetryCount}, retrying`
        );
        await sleep(rateLimitSleepInterval);
        return await recursiveDeleteAsync(url, options, retryCount + 1);
      } else {
        console.info(
          `Hit rate limit in delete, ${rateLimitRetryCount} retries did not fix it`
        );
      }
    }
    throw e;
  }
};
export const WebRequestor = {
  getManyAsync: async <T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<[T[] | null, Response]> => {
    const response = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return [await deserialize<T[]>(response), response];
  },

  getAsync: async <T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<[T | null, Response]> => {
    const response = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return [await deserialize<T>(response), response];
  },

  postAsync: async (
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> => {
    return await rateLimitAwarePostAsync(url, options);
  },

  postAsyncWithDeserialize: async <T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<[T | null, Response]> => {
    const response = await rateLimitAwarePostAsync(url, options);
    return [await deserialize<T>(response), response];
  },

  putAsync: async (
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> => {
    const response = await fetch(url, {
      ...options,
      method: "PUT",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  },

  putAsyncWithDeserialize: async <T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<[T | null, Response]> => {
    const response = await fetch(url, {
      ...options,
      method: "PUT",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return [await deserialize<T>(response), response];
  },

  deleteAsync: async (
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> => {
    return await recursiveDeleteAsync(url, options);
  },
};
