import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { AuthLayout } from "../components/layout/AuthLayout";
import { validateLogin } from "../features/auth/validation";
import { login } from "../services/api/auth";
import { useAuth } from "../features/auth/components/AuthProvider";
import type { ApiError } from "../types/api";

const { Title, Text } = Typography;

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleFinish(values: FormValues) {
    const fieldErrors = validateLogin(values);
    if (Object.keys(fieldErrors).length > 0) {
      form.setFields(
        (Object.entries(fieldErrors) as Array<[keyof FormValues, string]>).map(
          ([name, error]) => ({ name, errors: [error] })
        )
      );
      return;
    }

    setServerError(null);
    setSubmitting(true);
    try {
      const result = await login(values);
      setUser(result.user);
      navigate("/dashboard");
    } catch (err) {
      const apiError = err as ApiError;
      setServerError(
        apiError.message ?? "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      brandTitle="Ceydigital Auth Training"
      brandText="Log in to view your dashboard."
    >
      <Card>
        <Title level={3}>Login</Title>

        {serverError && (
          <Alert style={{ marginBottom: 16 }} type="error" message={serverError} />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          disabled={submitting}
        >
          <Form.Item label="Email" name="email">
            <Input placeholder="test@example.com" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input.Password placeholder="Password123" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <Text style={{ display: "block", marginTop: 16 }}>
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </Text>

        <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
          Mock credentials: test@example.com / Password123
        </Text>
      </Card>
    </AuthLayout>
  );
}
