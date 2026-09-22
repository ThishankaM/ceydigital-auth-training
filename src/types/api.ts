export type FieldErrors = Record<string, string>;

export type ApiErrorKind =
  | "network"
  | "validation"
  | "authentication"
  | "authorization"
  | "not_found"
  | "server"
  | "unknown";

export type ApiError = {
  kind: ApiErrorKind;
  message: string;
  fieldErrors?: FieldErrors;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  message: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  message: string;
};
