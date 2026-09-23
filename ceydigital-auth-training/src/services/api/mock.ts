import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "../../types/api";
import type { ApiError } from "../../types/api";
 
const MOCK_DELAY_MS = 600;
 
// In-memory "database" — resets on every page refresh.
type MockUser = { user: User; password: string };

const mockUsers: MockUser[] = [
  {
    user: { id: "u_1", name: "Test User", email: "test@example.com" },
    password: "Password123",
  },
];

/** Emails are stored and compared in a normalised form. */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
 
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}
 
function apiError(kind: ApiError["kind"], message: string): ApiError {
  return { kind, message };
}
 
export async function mockSignup(data: SignupRequest): Promise<SignupResponse> {
  await delay(null);

  const email = normalizeEmail(data.email);
  const exists = mockUsers.some((u) => u.user.email === email);
  if (exists) {
    throw apiError("validation", "An account with this email already exists.");
  }
 
  mockUsers.push({
    user: { id: `u_${mockUsers.length + 1}`, name: data.name.trim(), email },
    password: data.password,
  });
 
  return { message: "Account created successfully" };
}
 
export async function mockLogin(data: LoginRequest): Promise<LoginResponse> {
  await delay(null);

  const email = normalizeEmail(data.email);
  const record = mockUsers.find((u) => u.user.email === email);
  if (!record || record.password !== data.password) {
    throw apiError("authentication", "Invalid email or password.");
  }
 
  return { user: record.user, message: "Welcome back!" };
}
 
export async function mockMe(currentUserId: string | null): Promise<User> {
  await delay(null);
 
  const record = mockUsers.find((u) => u.user.id === currentUserId);
  if (!record) {
    throw apiError("authentication", "Not authenticated.");
  }
 
  return record.user;
}
 
export async function mockLogout(): Promise<{ message: string }> {
  await delay(null);
  return { message: "Logged out" };
}
 
