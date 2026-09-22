import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthContext, type AuthContextValue } from "../auth_context";
import { logout as logoutRequest, me } from "../../../services/api/auth";
import type { User } from "../../../types/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to restore an existing session once on start up. The mock API keeps
  // users in memory only, so a page refresh clears the session.
  useEffect(() => {
    let active = true;

    me()
      .then((restored) => {
        if (active) setUser(restored);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback((nextUser: User) => setUser(nextUser), []);

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
