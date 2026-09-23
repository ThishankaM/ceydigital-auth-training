import { Form, Input } from "antd";
import type { ComponentProps } from "react";

export type PasswordInputProps = {
  name: string;
  label: string;
  error?: string;
} & Omit<ComponentProps<typeof Input.Password>, "name" | "autoComplete">;

/**
 * Password field with its own label and error slot. Extra props such as
 * `placeholder`, `value` and `onChange` are forwarded to antd, so the field can
 * also be used as a `Form.Item` child.
 */
export function PasswordInput({
  name,
  label,
  error,
  ...inputProps
}: PasswordInputProps) {
  return (
    <Form.Item
      label={label}
      validateStatus={error ? "error" : ""}
      help={error}
    >
      <Input.Password name={name} autoComplete="new-password" {...inputProps} />
    </Form.Item>
  );
}
