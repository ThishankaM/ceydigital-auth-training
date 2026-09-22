import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input, Typography } from "antd";
import { AuthLayout } from "../components/layout/auth_layout";
import { PasswordInput } from "../components/common/password_input";
import {
  CONFIRM_PASSWORD_RULES,
  EMAIL_RULES,
  NAME_RULES,
  PASSWORD_MIN_LENGTH,
  SIGNUP_PASSWORD_RULES,
  validateSignup,
} from "../features/auth/validation";
import { signup } from "../services/api/auth";
import type { ApiError, FieldErrors } from "../types/api";

const { Text } = Typography;

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUpPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const redirectTimer = useRef<number | null>(null);

  // The redirect is a courtesy, so make sure the timer cannot outlive the page.
  useEffect(() => {
    return () => {
      if (redirectTimer.current !== null) {
        window.clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  const showFieldErrors = (fieldErrors: FieldErrors) => {
    form.setFields(
      Object.entries(fieldErrors).map(([name, error]) => ({
        // Field names are validated by the API contract, so trust them here.
        name: name as keyof FormValues,
        errors: [error],
      })),
    );
  };

  async function handleFinish(values: FormValues) {
    const fieldErrors = validateSignup(values);
    if (Object.keys(fieldErrors).length > 0) {
      showFieldErrors(fieldErrors);
      return;
    }

    setServerError(null);
    setSubmitting(true);
    const email = values.email.trim();

    try {
      await signup({
        name: values.name.trim(),
        email,
        password: values.password,
      });
      setSuccess(true);
      // Hand the new account over to the login page so it can greet the user.
      redirectTimer.current = window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { registered: true, email },
        });
      }, 1200);
    } catch (err) {
      const apiError = err as ApiError;
      setServerError(
        apiError.message ?? "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to explore the login and dashboard flow."
      footer={
        <Text>
          Already have an account? <Link to="/login">Log in</Link>
        </Text>
      }
    >
      {success ? (
        <Alert
          style={{ marginBottom: 16 }}
          type="success"
          showIcon
          message="Account created successfully. Redirecting to login…"
        />
      ) : null}

      {serverError ? (
        <Alert
          style={{ marginBottom: 16 }}
          type="error"
          showIcon
          message={serverError}
        />
      ) : null}

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        disabled={submitting}
      >
        <Form.Item label="Full name" name="name" rules={NAME_RULES}>
          <Input placeholder="Jane Doe" autoComplete="name" />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={EMAIL_RULES}>
          <Input placeholder="jane@example.com" autoComplete="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={SIGNUP_PASSWORD_RULES}
        >
          <PasswordInput
            placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={CONFIRM_PASSWORD_RULES}
        >
          <PasswordInput
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            Create account
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}
