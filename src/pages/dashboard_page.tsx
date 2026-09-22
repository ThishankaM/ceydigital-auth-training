import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Space, Typography } from "antd";
import { useAuth } from "../features/auth/auth_context";
import { USE_MOCKS_API } from "../lib/config";

const { Title, Text } = Typography;

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  // RequireAuth already redirects visitors that have no session.
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "48px 16px",
        boxSizing: "border-box",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 520,
          height: "fit-content",
          textAlign: "left",
        }}
      >
        <Title level={3} style={{ marginTop: 0 }}>
          Welcome back, {user.name}
        </Title>
        <Text type="secondary">
          You are signed in against the{" "}
          {USE_MOCKS_API ? "in-memory mock API" : "configured API"}.
        </Text>

        <Space
          direction="vertical"
          size={4}
          style={{ display: "flex", marginTop: 24 }}
        >
          <Text>
            <Text strong>Name: </Text>
            {user.name}
          </Text>
          <Text>
            <Text strong>Email: </Text>
            {user.email}
          </Text>
          <Text>
            <Text strong>User ID: </Text>
            {user.id}
          </Text>
        </Space>

        <Button
          style={{ marginTop: 24 }}
          loading={signingOut}
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </Card>
    </div>
  );
}
