import { createContext, useContext } from "react";
import type { User } from "../../types/api";

export type AuthContextValue = {
  /** Signed in user, or null when the visitor is not authenticated. */
  user: User | null;
  /** True while the provider restores an existing session on first render. */
  loading: boolean;
  /** Store the user returned by a successful login. */
  signIn: (user: User) => void;
  /** Clear the session locally and on the server. */
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

/** Read the auth session. Throws when used outside of `AuthProvider`. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
