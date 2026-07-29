"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, setToken, AdminApiError } from "./admin-api-client";
import type { AdminRole } from "./permissions";

interface AdminAuthState {
  role: AdminRole | null;
  email: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthState | undefined>(undefined);

// Sprint 6B — client-side session state. The token itself lives in
// localStorage (admin-api-client.ts) so it survives a page refresh;
// this context re-derives `role`/`email` from what's stored at mount
// so a refresh doesn't bounce the admin back to /admin/login. This is
// UI convenience state only — every actual authorization decision is
// re-verified server-side on each request (Sprint 6A's PermissionsGuard),
// per this sprint's "enforce RBAC through both UI visibility and
// backend authorization" constraint.
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AdminRole | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedRole = window.localStorage.getItem("hmb_admin_role") as AdminRole | null;
    const storedEmail = window.localStorage.getItem("hmb_admin_email");
    if (storedRole) setRole(storedRole);
    if (storedEmail) setEmail(storedEmail);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (loginEmail: string, password: string) => {
    const result = await adminApi.login(loginEmail, password);
    setToken(result.sessionToken);
    window.localStorage.setItem("hmb_admin_role", result.role);
    window.localStorage.setItem("hmb_admin_email", loginEmail);
    setRole(result.role as AdminRole);
    setEmail(loginEmail);
    router.push("/admin/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    setToken(null);
    window.localStorage.removeItem("hmb_admin_role");
    window.localStorage.removeItem("hmb_admin_email");
    setRole(null);
    setEmail(null);
    router.push("/admin/login");
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ role, email, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export { AdminApiError };
