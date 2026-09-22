import type { ComponentProps } from "react";
import { Input } from "antd";

export type PasswordInputProps = ComponentProps<typeof Input.Password>;

/**
 * Thin wrapper around antd's password input so both auth forms get the same
 * show/hide behaviour. Every prop is forwarded, including the `value` and
 * `onChange` that `Form.Item` injects, so it can be used directly as a
 * `Form.Item` child.
 */
export function PasswordInput({
  autoComplete = "current-password",
  ...rest
}: PasswordInputProps) {
  return <Input.Password autoComplete={autoComplete} {...rest} />;
}
