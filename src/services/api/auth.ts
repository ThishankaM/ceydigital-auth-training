import { USE_MOCKS_API } from "../../lib/config";
import { apiClient } from "./client";
import { mockLogin, mockLogout, mockMe, mockSignup } from "./mock";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "../../types/api";

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  if (USE_MOCKS_API) {
    return mockSignup(data);
  }
  return apiClient<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// The mock backend keeps its users in memory, so the signed in user is
// remembered here until the page is refreshed.
let currentUser: User | null = null;

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = USE_MOCKS_API
    ? await mockLogin(data)
    : await apiClient<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

  currentUser = response.user;
  return response;
}

export async function me(): Promise<User> {
  if (USE_MOCKS_API) {
    return mockMe(currentUser?.id ?? null);
  }
  return apiClient<User>("/auth/me");
}

export async function logout(): Promise<void> {
  if (USE_MOCKS_API) {
    await mockLogout();
  } else {
    await apiClient<{ message: string }>("/auth/logout", { method: "POST" });
  }

  currentUser = null;
}
