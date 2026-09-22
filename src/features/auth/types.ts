// The auth types have a single home in src/types/api.ts, re-exported here so
// existing imports from the auth feature keep working.
export type {
  ApiError,
  ApiErrorKind,
  FieldErrors,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "../../types/api";
