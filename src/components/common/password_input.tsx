import type { ComponentProps } from "react";
import { Input } from "antd";

export type PasswordInputProps = ComponentProps<typeof Input.Password>;

/**
 * Thin wrapper around antd's password input so both auth forms get the same
 * show/hide behaviour without repeating the props.
 */
export function PasswordInput({ autoComplete = "current-password", ...rest }: PasswordInputProps) {
    return <Input.Password autoComplete={autoComplete} {...rest} />;
}
