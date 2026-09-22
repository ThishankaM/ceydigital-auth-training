import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input, Typography } from "antd";
import { AuthLayout } from "../components/layout/auth_layout";
import { PasswordInput } from "../components/common/password_input";
import { useAuth } from "../features/auth/auth_context";
import {
  EMAIL_RULES,
  LOGIN_PASSWORD_RULES,
  validateLogin,
} from "../features/auth/validation";
import { login } from "../services/api/auth";
import type { ApiError, FieldErrors } from "../types/api";

const { Text } = Typography;

type FormValues = {
  email: string;
  password: string;
};

type LocationState = {
  registered?: boolean;
  email?: string;
  from?: string;
} | null;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { user, signIn } = useAuth();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const showFieldErrors = (fieldErrors: FieldErrors) => {
    form.setFields(
      Object.entries(fieldErrors).map(([name, error]) => ({
        // Field names are validated by the API contract, so trust them here.
        name: name as keyof FormValues,
        errors: [error],
      })),
    );
  };

  // Signing in again while a session is active makes no sense.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (values: FormValues) => {
    setServerError(null);

    const fieldErrors = validateLogin(values);
    if (Object.keys(fieldErrors).length > 0) {
      showFieldErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await login({
        email: values.email.trim(),
        password: values.password,
      });
      signIn(response.user);
      navigate(state?.from ?? "/dashboard", { replace: true });
    } catch (error) {
      const apiError = error as ApiError;
      setServerError(apiError.message);
      if (apiError.fieldErrors) {
        showFieldErrors(apiError.fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Welcome back, please enter your details."
      footer={
        <Text>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Text>
      }
    >
      {state?.registered ? (
        <Alert
          type="success"
          showIcon
          message="Account created. You can log in now."
          style={{ marginBottom: 16 }}
        />
      ) : null}

      {serverError ? (
        <Alert
          type="error"
          showIcon
          message={serverError}
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        disabled={submitting}
        initialValues={{ email: state?.email ?? "" }}
        onFinish={handleSubmit}
      >
        <Form.Item label="Email" name="email" rules={EMAIL_RULES}>
          <Input placeholder="you@example.com" autoComplete="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={LOGIN_PASSWORD_RULES}
        >
          <PasswordInput
            placeholder="Your password"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            Log in
          </Button>
        </Form.Item>
      </Form>

      <Text type="secondary" style={{ display: "block", marginTop: 16 }}>
        Demo account: test@example.com / Password123
      </Text>
    </AuthLayout>
  );
}
