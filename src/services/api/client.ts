import { API_BASE_URL } from "../../lib/config";
import type { ApiError } from "../../types/api";

export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch {
    const error: ApiError = {
      kind: "network",
      message: "Network error. Please check your internet connection.",
    };
    throw error;
  }

  if (!response.ok) {
    const error: ApiError = await response
      .json()
      .then((body) => ({
        kind: mapStatusToKind(response.status),
        message: body?.message ?? "Something went wrong.",
        fieldErrors: body?.fieldErrors,
      }))
      .catch(() => ({
        kind: mapStatusToKind(response.status),
        message: "Something went wrong.",
      }));

    throw error;
  }

  return response.json() as Promise<T>;
}

function mapStatusToKind(status: number): ApiError["kind"] {
  if (status === 422 || (status >= 400 && status < 500)) return "validation";
  if (status === 401) return "authentication";
  if (status === 403) return "authorization";
  if (status === 404) return "not_found";
  if (status >= 500) return "server";
  return "unknown";
}
