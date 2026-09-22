import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login_page";
import { SignUpPage } from "./pages/signup_page";
import { DashboardPage } from "./pages/dashboard_page";
import { RequireAuth } from "./features/auth/components/require_auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
