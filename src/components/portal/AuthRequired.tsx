import { Link } from "@tanstack/react-router";

export function AuthRequired({ message }: { message?: string; icon?: "shield" | "lock" }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="max-w-sm text-center">
        <h1 className="font-display text-2xl text-foreground">Sign in required</h1>
        {message && <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">{message}</p>}
        <Link to="/portal/login" className="lux-button mt-10">
          Sign in
        </Link>
      </div>
    </div>
  );
}
