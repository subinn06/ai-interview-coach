import axios from "axios";

export class AppError extends Error {
  public status: number;
  public code?: string;
  public detail?: unknown;

  constructor(message: string, status: number = 500, code?: string, detail?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

export function normalizeApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const responseData = error.response?.data;

    let rawDetail = responseData?.detail || responseData?.message;

    // handle fastapi pydantic validation errors (array of error objects)
    if (Array.isArray(rawDetail)) {
      const messages = rawDetail
        .map((item) => (typeof item === "object" && item.msg ? item.msg : String(item)))
        .filter(Boolean);
      rawDetail = messages.length > 0 ? `Validation error: ${messages.join(", ")}` : "Invalid input parameters.";
    }

    if (typeof rawDetail === "string" && rawDetail.trim()) {
      return new AppError(rawDetail, status, error.code, responseData);
    }

    // default status message fallbacks
    switch (status) {
      case 400:
        return new AppError("Invalid request parameters.", status, error.code);
      case 401:
        return new AppError("Session expired. Please log in again.", status, error.code);
      case 403:
        return new AppError("Access denied. You do not have permission.", status, error.code);
      case 404:
        return new AppError("The requested resource was not found.", status, error.code);
      case 409:
        return new AppError("Conflict. Resource already exists or state is invalid.", status, error.code);
      case 422:
        return new AppError("Validation error. Please check form inputs.", status, error.code);
      case 429:
        return new AppError("Too many requests. Please slow down and try again.", status, error.code);
      case 500:
      case 502:
      case 503:
        return new AppError("Server error. Please try again later.", status, error.code);
      default:
        if (error.code === "ERR_NETWORK" || !error.response) {
          return new AppError("Network error. Unable to connect to backend server.", 0, "ERR_NETWORK");
        }
        return new AppError(error.message || "An unexpected error occurred.", status, error.code);
    }
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500);
  }

  return new AppError("An unexpected error occurred.", 500);
}

export function getErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}
