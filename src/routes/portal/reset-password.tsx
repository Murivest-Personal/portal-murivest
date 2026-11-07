import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AuthFrame } from "@/components/portal/AuthScreen";
import { supabase } from "@/integrations/supabase/client";
import { portalHead } from "@/lib/portal-head";

export const Route = createFileRoute("/portal/reset-password")({
  head: () => portalHead("Set a New Password | Murivest", "Choose a new password for your Murivest investor account."),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The email link signs the investor in with a short recovery session.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data: s }) => {
      if (s.session || window.location.hash.includes("type=recovery")) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setSaving(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (err) return setError(err.message);
    setDone(true);
    await queryClient.invalidateQueries({ queryKey: ["portal"] });
    setTimeout(() => navigate({ to: "/portal" }), 1200);
  }

  return (
    <AuthFrame>
      <p className="lux-eyebrow text-center">Private Investor Portal</p>
      <h1 className="mt-6 text-center font-display text-3xl text-foreground">New password</h1>
      <p className="mx-auto mt-4 max-w-xs text-center text-sm font-light leading-relaxed text-muted-foreground">
        Your email is verified. Choose a password to enter the portal.
      </p>
      {!ready ? (
        <p className="mt-14 text-center text-sm font-light text-muted-foreground">
          Please open this page from the link in your email. If the link has expired, request a new one from the sign-in page.
        </p>
      ) : done ? (
        <p role="status" className="mt-14 text-center text-sm font-light text-forest">
          Password saved. Taking you to the portal.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-14 space-y-9">
          <label className="block">
            <span className="lux-label">New password</span>
            <input type="password" autoComplete="new-password" className="lux-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="block">
            <span className="lux-label">Confirm password</span>
            <input type="password" autoComplete="new-password" className="lux-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          {error && <p role="alert" className="text-sm font-light text-destructive">{error}</p>}
          <button type="submit" disabled={saving} className="lux-button w-full">
            {saving ? "One moment" : "Save password"}
          </button>
        </form>
      )}
    </AuthFrame>
  );
}
