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

const deserialize = async <T>(response: Response): Promise<T | undefined> => {
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

const rateLimitAwarePost = async (
  url: string,
  body: any,
  retryCount = 0
): Promise<Response> => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
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
      return await rateLimitAwarePost(url, body, retryCount + 1);
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

const recursiveDelete = async (
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
      return await recursiveDelete(url, options, retryCount + 1);
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
        return await recursiveDelete(url, options, retryCount + 1);
      } else {
        console.info(
          `Hit rate limit in delete, ${rateLimitRetryCount} retries did not fix it`
        );
      }
    }
    throw e;
  }
};
export const webRequestor = {
  getMany: async <T>(url: string, options: FetchOptions = {}) => {
    const response = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: await deserialize<T[]>(response), response };
  },

  get: async <T>(url: string, options: FetchOptions = {}) => {
    const response = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: await deserialize<T>(response), response };
  },

  post: async (url: string, body: any) => {
    return await rateLimitAwarePost(url, body);
  },

  postWithDeserialize: async <T>(url: string, body: any) => {
    const response = await rateLimitAwarePost(url, body);
    return { data: await deserialize<T[]>(response), response };
  },

  put: async (url: string, body: any = {}) => {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  },

  putWithDeserialize: async <T>(url: string, body: any = {}) => {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return { data: await deserialize<T[]>(response), response };
  },

  delete: async (
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> => {
    return await recursiveDelete(url, options);
  },
};
