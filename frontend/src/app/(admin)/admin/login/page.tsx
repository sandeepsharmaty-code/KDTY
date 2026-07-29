"use client";
import { useState } from "react";
import { Button } from "@/components/basic/Button";
import { Input } from "@/components/basic/Input";
import { Alert } from "@/components/composite/Alert";
import { useAdminAuth, AdminApiError } from "@/admin/lib/admin-auth-context";

// Sprint 6B — Secure Admin Login UI. Reuses Sprint 2's Input/Button/
// Alert components exactly; the only new markup is the page shell.
export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-md bg-white p-8 shadow-rest">
        <h1 className="font-display text-[24px] font-semibold text-primary-plum">Hue Muse Admin</h1>
        <p className="mt-1 text-[13px] text-stone">Sign in with your administrator account.</p>

        {error && (
          <div className="mt-4">
            <Alert tone="error">{error}</Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
