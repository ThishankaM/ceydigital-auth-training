import type { FormRule } from "antd";
import type { FieldErrors } from "../../types/api";

export type { FieldErrors };

export const PASSWORD_MIN_LENGTH = 8;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginValues = {
  email: string;
  password: string;
};

export type SignupValues = LoginValues & {
  name: string;
  confirmPassword: string;
};

/**
 * Login form rules. They mirror `validateLogin` so the field level feedback and
 * the submit time check can never drift apart.
 */
export const EMAIL_RULES: FormRule[] = [
  { required: true, message: "Email is required" },
  { type: "email", message: "Invalid email format" },
];

export const LOGIN_PASSWORD_RULES: FormRule[] = [
  { required: true, message: "Password is required" },
];

export const NAME_RULES: FormRule[] = [
  { required: true, message: "Name is required" },
  { min: 3, message: "Name must be at least 3 characters long" },
];

export const SIGNUP_PASSWORD_RULES: FormRule[] = [
  { required: true, message: "Password is required" },
  {
    min: PASSWORD_MIN_LENGTH,
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
  },
];

export const CONFIRM_PASSWORD_RULES: FormRule[] = [
  { required: true, message: "Confirm password is required" },
  ({ getFieldValue }) => ({
    validator: async (_rule, value: string) => {
      if (!value || value === getFieldValue("password")) {
        return;
      }
      throw new Error("Passwords do not match");
    },
  }),
];

export function validateSignup(values: Partial<SignupValues>): FieldErrors {
  const errors: FieldErrors = {};
  const name = (values.name ?? "").trim();
  const email = (values.email ?? "").trim();
  const password = values.password ?? "";
  const confirmPassword = values.confirmPassword ?? "";

  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 3) {
    errors.name = "Name must be at least 3 characters long";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Confirm password is required";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validateLogin(values: Partial<LoginValues>): FieldErrors {
  const errors: FieldErrors = {};
  const email = (values.email ?? "").trim();
  const password = values.password ?? "";

  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  }

  return errors;
}
