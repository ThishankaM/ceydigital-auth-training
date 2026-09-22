import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alert, Button, Form, Input, Result, Typography } from "antd";
import { AuthLayout } from "../components/layout/auth_layout";
import { PasswordInput } from "../components/common/password_input";
import { validateLogin } from "../features/auth/validation";
import { login, logout } from "../services/api/auth";
import type { ApiError, User } from "../types/api";

const { Text } = Typography;

type FormValues = {
    email: string;
    password: string;
};

type LocationState = {
    registered?: boolean;
    email?: string;
} | null;

export function LoginPage() {
    const location = useLocation();
    const state = location.state as LocationState;
    const [form] = Form.useForm<FormValues>();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [signedInUser, setSignedInUser] = useState<User | null>(null);

    // Field rules reuse the shared validator so the form and the API layer
    // always agree on what a valid login looks like.
    const ruleFor = (field: keyof FormValues) => ({
        validator: async (_rule: unknown, value: string) => {
            const values = { ...form.getFieldsValue(), [field]: value ?? "" };
            const errors = validateLogin(values as FormValues);
            if (errors[field]) {
                throw new Error(errors[field]);
            }
        },
    });

    const showFieldErrors = (fieldErrors: Record<string, string>) => {
        form.setFields(
            Object.entries(fieldErrors).map(([name, error]) => ({
                name: name as keyof FormValues,
                errors: [error],
            })),
        );
    };

    const handleSubmit = async (values: FormValues) => {
        setServerError(null);

        const errors = validateLogin(values);
        if (Object.keys(errors).length > 0) {
            showFieldErrors(errors);
            return;
        }

        setSubmitting(true);
        try {
            const response = await login({
                email: values.email.trim(),
                password: values.password,
            });
            setSignedInUser(response.user);
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

    const handleSignOut = async () => {
        setSubmitting(true);
        try {
            await logout();
            form.resetFields();
            setSignedInUser(null);
        } finally {
            setSubmitting(false);
        }
    };

    if (signedInUser) {
        return (
            <AuthLayout>
                <Result
                    status="success"
                    title={`Welcome back, ${signedInUser.name}!`}
                    subTitle={`Signed in as ${signedInUser.email}`}
                    extra={
                        <Button loading={submitting} onClick={handleSignOut}>
                            Sign out
                        </Button>
                    }
                />
            </AuthLayout>
        );
    }

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
                <Form.Item label="Email" name="email" rules={[ruleFor("email")]}>
                    <Input placeholder="you@example.com" autoComplete="email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[ruleFor("password")]}
                >
                    <PasswordInput placeholder="Your password" />
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
