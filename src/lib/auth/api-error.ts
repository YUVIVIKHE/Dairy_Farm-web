import type { ApiErrorBody } from "@/types/auth";

function firstFieldError(body: Record<string, unknown> | undefined): string | undefined {
  if (!body) return undefined;
  for (const value of Object.values(body)) {
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
  }
  return undefined;
}

export class ApiError extends Error {
  status: number;
  body?: ApiErrorBody;

  constructor(message: string, status: number, body?: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let body: Record<string, unknown> | undefined;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }

    const message =
      (typeof body?.detail === "string" ? body.detail : undefined) ??
      (typeof body?.message === "string" ? body.message : undefined) ??
      firstFieldError(body) ??
      (response.status === 401
        ? "Invalid username/mobile number or password."
        : response.status >= 500
          ? "The server is currently unavailable. Please try again shortly."
          : "Something went wrong. Please try again.");

    return new ApiError(message, response.status, body as ApiErrorBody);
  }

  static networkError(): ApiError {
    return new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0,
    );
  }
}
