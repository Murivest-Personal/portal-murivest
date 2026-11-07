import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Wordmark } from "@/components/portal/Wordmark";
import { SiteLink } from "@/components/portal/SiteLink";

export type AuthMode = "signin" | "register" | "forgot";

const AUM_RANGES = [
  { value: "<$10M", label: "Under $10M" },
  { value: "$10M-$50M", label: "$10M – $50M" },
  { value: "$50M-$100M", label: "$50M – $100M" },
  { value: "$100M-$250M", label: "$100M – $250M" },
  { value: ">$250M", label: "Over $250M" },
];

const COPY: Record<AuthMode, { title: string; sub: string; cta: string }> = {
  signin: {
    title: "Welcome",
    sub: "Sign in to your private investor workspace.",
    cta: "Sign in",
  },
  register: {
    title: "Request access",
    sub: "Membership is reviewed personally by our advisory team.",
    cta: "Submit request",
  },
  forgot: {
    title: "Set a new password",
    sub: "Returning investors: we will email you a secure link to verify your address and choose a new password.",
    cta: "Send link",
  },
};

const EMPTY = { fullName: "", title: "", organisation: "", aum: "", email: "", password: "" };

export default function AuthScreen({
  initialMode = "signin",
  notice,
  redirectTo,
}: {
  initialMode?: AuthMode;
  notice?: string | undefined;
  /** Where to go after signing in; omit to stay on the current page. */
  redirectTo?: "/portal";
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState(EMPTY);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(
    notice ? { type: "error", message: notice } : null,
  );

  useEffect(() => setMode(initialMode), [initialMode]);

  function switchMode(next: AuthMode) {
    setMode(next);
    setAlert(null);
    setShowPassword(false);
    setForm((f) => ({ ...EMPTY, email: f.email }));
  }

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAlert(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) return setAlert({ type: "error", message: error.message });
        await queryClient.invalidateQueries({ queryKey: ["portal"] });
        if (redirectTo) navigate({ to: redirectTo });
        return;
      }
      if (mode === "register") {
        if (form.password.length < 8) return setAlert({ type: "error", message: "Please choose a password of at least 8 characters." });
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal`,
            data: {
              full_name: form.fullName,
              title: form.title,
              organisation: form.organisation,
              aum: form.aum,
            },
          },
        });
        if (error) return setAlert({ type: "error", message: error.message });
        setForm(EMPTY);
        return setAlert({
          type: "success",
          message: "Thank you. Please confirm your email address using the link we have just sent you.",
        });
      }
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/portal/reset-password`,
      });
      if (error) return setAlert({ type: "error", message: error.message });
      setAlert({ type: "success", message: "If an account exists for this address, a secure link is on its way." });
    } finally {
      setLoading(false);
    }
  }

  const copy = COPY[mode];

  return (
    <AuthFrame>
      <p className="lux-eyebrow text-center">Private Investor Portal</p>
      <h1 className="mt-6 text-center font-display text-3xl text-foreground">{copy.title}</h1>
      <p className="mx-auto mt-4 max-w-xs text-center text-sm font-light leading-relaxed text-muted-foreground">
        {copy.sub}
      </p>

      <form onSubmit={handleSubmit} className="mt-14 space-y-9" noValidate={false}>
        {mode === "register" && (
          <>
            <Field label="Full name">
              <input className="lux-input" value={form.fullName} onChange={set("fullName")} autoComplete="name" required />
            </Field>
            <div className="grid gap-9 sm:grid-cols-2 sm:gap-6">
              <Field label="Title">
                <input className="lux-input" value={form.title} onChange={set("title")} autoComplete="organization-title" />
              </Field>
              <Field label="Organisation">
                <input className="lux-input" value={form.organisation} onChange={set("organisation")} autoComplete="organization" />
              </Field>
            </div>
            <Field label="Investable assets">
              <select className="lux-input appearance-none" value={form.aum} onChange={set("aum")}>
                <option value="">Prefer not to say</option>
                {AUM_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        <Field label="Email">
          <input
            type="email"
            className="lux-input"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
            required
          />
        </Field>

        {mode !== "forgot" && (
          <Field label="Password">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="lux-input pr-14"
                value={form.password}
                onChange={set("password")}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                minLength={mode === "register" ? 8 : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="lux-link absolute right-0 top-1/2 -translate-y-1/2 text-[9px]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </Field>
        )}

        {alert && (
          <p
            role={alert.type === "error" ? "alert" : "status"}
            className={
              alert.type === "error"
                ? "text-sm font-light text-destructive"
                : "text-sm font-light text-forest"
            }
          >
            {alert.message}
          </p>
        )}

        <button type="submit" disabled={loading} className="lux-button w-full">
          {loading ? "One moment" : copy.cta}
        </button>
      </form>

      <div className="mt-12 flex flex-col items-center gap-4">
        {mode === "signin" && (
          <>
            <button type="button" onClick={() => switchMode("forgot")} className="lux-link">
              Forgotten or first visit? Set a password
            </button>
            <button type="button" onClick={() => switchMode("register")} className="lux-link">
              Request access
            </button>
          </>
        )}
        {mode !== "signin" && (
          <button type="button" onClick={() => switchMode("signin")} className="lux-link">
            Return to sign in
          </button>
        )}
      </div>
    </AuthFrame>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="lux-label">{label}</span>
      {children}
    </label>
  );
}

/** White, centred frame shared by the sign-in and password pages. */
export function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          <div className="mb-16 flex justify-center">
            <SiteLink href="/" aria-label="Murivest Group website">
              <Wordmark size="lg" />
            </SiteLink>
          </div>
          {children}
        </div>
      </main>
      <footer className="px-6 pb-10 text-center">
        <p className="lux-meta">
          Strictly confidential ·{" "}
          <a href="mailto:info@murivest.co.ke" className="hover:text-foreground">
            info@murivest.co.ke
          </a>
        </p>
      </footer>
    </div>
  );
}
