import { Link } from "react-router-dom";
import { Button, Space, Typography } from "antd";

const { Title } = Typography;

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <Title>Ceydigital Auth Training</Title>
      <Space>
        <Link to="/login">
          <Button type="primary">Login</Button>
        </Link>
        <Link to="/signup">
          <Button>Sign Up</Button>
        </Link>
      </Space>
    </div>
  );
}
