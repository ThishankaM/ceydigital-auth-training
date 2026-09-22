import { Form, Input } from "antd";
 
export function PasswordInput({
  name,
  label,
  error,
}: {
  name: string;
  label: string;
  error?: string;
}) {
  return (
    <Form.Item
      label={label}
      validateStatus={error ? "error" : ""}
      help={error}
    >
      <Input.Password name={name} autoComplete="new-password" />
    </Form.Item>
  );
}