import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Input, Typography } from "antd";
import { AuthLayout } from "../components/layout/auth_layout";
import { PasswordInput } from "../components/common/password_input";
import { validateSignup } from "../features/auth/validation";
import { signup } from "../services/api/auth";
import type { ApiError } from "../types/api";

const { Text } = Typography;

type FormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export function SignupPage() {
    const navigate = useNavigate();
    const [form] = Form.useForm<FormValues>();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // Field rules reuse the shared validator so the form and the API layer
    // always agree on what a valid signup looks like.
    const ruleFor = (field: keyof FormValues) => ({
        validator: async (_rule: unknown, value: string) => {
            const values = { ...form.getFieldsValue(), [field]: value ?? "" };
            const errors = validateSignup(values as FormValues);
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

        const errors = validateSignup(values);
        if (Object.keys(errors).length > 0) {
            showFieldErrors(errors);
            return;
        }

        setSubmitting(true);
        try {
            await signup({
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
            });

            navigate("/login", {
                replace: true,
                state: { registered: true, email: values.email.trim() },
            });
        } catch (error) {
            const apiError = error as ApiError;
            setServerError(apiError.message);
            if (apiError.fieldErrors) {
                showFieldErrors(apiError.fieldErrors);
            }
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Sign up with your name, email and password."
            footer={
                <Text>
                    Already have an account? <Link to="/login">Log in</Link>
                </Text>
            }
        >
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
                onFinish={handleSubmit}
            >
                <Form.Item label="Name" name="name" rules={[ruleFor("name")]}>
                    <Input placeholder="Jane Doe" autoComplete="name" />
                </Form.Item>

                <Form.Item label="Email" name="email" rules={[ruleFor("email")]}>
                    <Input placeholder="jane@example.com" autoComplete="email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[ruleFor("password")]}
                >
                    <PasswordInput
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                    />
                </Form.Item>

                <Form.Item
                    label="Confirm password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[ruleFor("confirmPassword")]}
                >
                    <PasswordInput
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                    />
                </Form.Item>

                <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
                    <Button type="primary" htmlType="submit" block loading={submitting}>
                        Sign up
                    </Button>
                </Form.Item>
            </Form>
        </AuthLayout>
    );
}
