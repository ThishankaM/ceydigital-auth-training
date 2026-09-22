import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Skeleton, Typography } from "antd";
import { logout } from "../services/api/auth";
import { useAuth } from "../features/auth/components/AuthProvider";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    // Mock "check authentication" — tomorrow this becomes a real
    // GET /auth/me call on mount instead of reading context state.
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  async function handleLogout() {
    await logout();
    setUser(null);
    navigate("/login");
  }

  // Covers the frame before the redirect above takes effect.
  if (!user) {
    return (
      <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 16px" }}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 16px" }}>
      <Title level={2}>Welcome, {user.name}</Title>

      <Card title="Account" style={{ marginTop: 24 }}>
        <Text>Email: {user.email}</Text>
      </Card>

      <Button danger style={{ marginTop: 24 }} onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
