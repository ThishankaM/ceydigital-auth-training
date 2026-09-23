import { API_BASE_URL } from "../../lib/config";
import type { ApiError, ApiErrorKind, FieldErrors } from "../../types/api";

type ErrorBody = {
  message?: string;
  fieldErrors?: FieldErrors;
};

/**
 * Minimal JSON client for the auth API. Every failure is normalised into an
 * `ApiError` so callers never have to inspect a `Response` themselves.
 */
export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  if (!API_BASE_URL) {
    throw {
      kind: "unknown",
      message:
        "No API base URL is configured. Set VITE_API_URL or run against the mock API.",
    } satisfies ApiError;
  }

  const hasBody = options?.body != null;
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        // Only announce a JSON body when there is one, otherwise simple GET
        // requests turn into CORS preflights for no reason.
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...options?.headers,
      },
    });
  } catch {
    throw {
      kind: "network",
      message: "Network error. Please check your internet connection.",
    } satisfies ApiError;
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  return parseBody<T>(response);
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = (await response
    .json()
    .catch(() => null)) as ErrorBody | null;

  return {
    kind: mapStatusToKind(response.status),
    message: body?.message ?? defaultMessageFor(response.status),
    fieldErrors: body?.fieldErrors,
  };
}

async function parseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function mapStatusToKind(status: number): ApiErrorKind {
  if (status === 401) return "authentication";
  if (status === 403) return "authorization";
  if (status === 404) return "not_found";
  if (status >= 500) return "server";
  if (status === 400 || status === 422) return "validation";
  return "unknown";
}

function defaultMessageFor(status: number): string {
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status >= 500) return "The server ran into a problem. Please try again.";
  return "Something went wrong.";
}
