import type { ReactNode } from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

type AuthLayoutProps = {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
};

/**
 * Centered card used by the login and signup pages so both screens stay
 * visually consistent.
 */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                minHeight: "100vh",
                padding: "48px 16px",
                boxSizing: "border-box",
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 420,
                    margin: "0 auto",
                    textAlign: "left",
                }}
            >
                {title ? (
                    <header style={{ marginBottom: 24 }}>
                        <Title level={3} style={{ margin: 0 }}>
                            {title}
                        </Title>
                        {subtitle ? <Text type="secondary">{subtitle}</Text> : null}
                    </header>
                ) : null}

                {children}

                {footer ? <footer style={{ marginTop: 24 }}>{footer}</footer> : null}
            </Card>
        </div>
    );
}
