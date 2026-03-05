class SiteStewardApiClient {
  constructor({
    baseUrl,
    defaultHeaders = {},
    credentials = "include",
  }) {
    if (!baseUrl || typeof baseUrl !== "string") {
      throw new TypeError("SiteStewardApiClient requires a string baseUrl");
    }

    this.baseUrl = trimTrailingSlash(baseUrl);
    this.defaultHeaders = defaultHeaders;
    this.credentials = credentials;
  }

  async request(path, { method = "GET", body, headers = {}, redirect } = {}) {
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    let serializedBody;

    if (body !== undefined && body !== null) {
      if (
        typeof body === "string" ||
        body instanceof ArrayBuffer ||
        ArrayBuffer.isView(body) ||
        body instanceof Blob ||
        body instanceof FormData
      ) {
        serializedBody = body;
      } else {
        serializedBody = JSON.stringify(body);
        if (!requestHeaders["Content-Type"]) {
          requestHeaders["Content-Type"] = "application/json";
        }
      }
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: requestHeaders,
      body: serializedBody,
      credentials: this.credentials,
      redirect,
    });

    const contentType = response.headers.get("content-type");
    let parsedBody = null;

    if (response.status !== 204) {
      parsedBody = isJsonContentType(contentType)
        ? await response.json()
        : await response.text();
    }

    if (!response.ok) {
      const message =
        (parsedBody && typeof parsedBody === "object" && parsedBody.error) ||
        `Request failed: ${method} ${path}`;
      throw new SiteStewardApiError(message, {
        status: response.status,
        statusText: response.statusText,
        body: parsedBody,
        method,
        path,
      });
    }

    return parsedBody;
  }

  getHealth() {
    return this.request("/health");
  }

  // AUTH

  requestPasswordReset(args) {
    return this.request("/auth/password/reset-request", {
      method: "POST",
      body: args,
    });
  }

  setPassword(args) {
    return this.request("/auth/password/set", {
      method: "POST",
      body: args,
    });
  }

  loginWithPassword(args) {
    return this.request("/auth/password/login", {
      method: "POST",
      body: args,
    });
  }

  logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  getMe() {
    return this.request("/v1/me");
  }

  // TASK

  createTask(initialPrompt) {
    return this.request("/v1/tasks", {
      method: "POST",
      body: { initialPrompt },
    });
  }

  listTasks() {
    return this.request("/v1/tasks");
  }

  getTask(taskId) {
    return this.request(`/v1/tasks/${encodeURIComponent(taskId)}`);
  }

  getTaskPrompt(taskId, promptNumber) {
    return this.request(
      `/v1/tasks/${encodeURIComponent(taskId)}/prompts/${encodeURIComponent(promptNumber)}`,
    );
  }

  acceptTask(taskId) {
    return this.request(`/v1/tasks/${encodeURIComponent(taskId)}/accept`, {
      method: "POST",
    });
  }

  replyToTask(taskId, nextPrompt) {
    return this.request(`/v1/tasks/${encodeURIComponent(taskId)}/reply`, {
      method: "POST",
      body: { nextPrompt },
    });
  }

  // ASSET

  createAsset({ filename, mime, size, sha256 }) {
    return this.request("/v1/assets", {
      method: "POST",
      body: {
        filename,
        mime,
        size,
        sha256,
      },
    });
  }

  completeAsset(assetId) {
    return this.request(`/v1/assets/${encodeURIComponent(assetId)}/complete`, {
      method: "POST",
    });
  }

  listAssets() {
    return this.request("/v1/assets");
  }

  getReplayScript(replayId) {
    return this.request(`/v1/replay/${encodeURIComponent(replayId)}`);
  }
}

export { SiteStewardApiError };

class SiteStewardApiError extends Error {
  constructor(message, { status, statusText, body, method, path } = {}) {
    super(message);
    this.name = "SiteStewardApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    this.method = method;
    this.path = path;
  }
}

function trimTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function isJsonContentType(contentType) {
  return (
    typeof contentType === "string" && contentType.includes("application/json")
  );
}

export default new SiteStewardApiClient({
  baseUrl: import.meta.env.VITE_SITE_STEWARD_API_BASE_URL,
});
