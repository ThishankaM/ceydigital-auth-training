import { Typography } from "antd";
import type { ReactNode } from "react";

const { Title, Paragraph } = Typography;

export function AuthLayout({
  brandTitle,
  brandText,
  children,
}: {
  brandTitle: string;
  brandText: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", flexWrap: "wrap" }}>
      <div
        style={{
          flex: "1 1 320px",
          background: "#001529",
          color: "#fff",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Title style={{ color: "#fff" }}>{brandTitle}</Title>
        <Paragraph style={{ color: "rgba(255,255,255,0.75)" }}>
          {brandText}
        </Paragraph>
      </div>
      <div
        style={{
          flex: "1 1 320px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>{children}</div>
      </div>
    </div>
  );
}
