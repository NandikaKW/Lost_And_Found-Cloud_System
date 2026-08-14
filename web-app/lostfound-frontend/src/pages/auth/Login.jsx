import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tag, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Field, Input } from "../../components/Field";
import Button from "../../components/Button";
import { ErrorState } from "../../components/States";

export default function Login() {
  const { login, loading, error, setError } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const session = await login(email, password);
      toast.success(`Welcome back, ${session.email}`);
      navigate(session.role?.toLowerCase() === "admin" ? "/admin" : "/app");
    } catch {
      // error already captured in context
    }
  }

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Sign in to report items, browse the lost & found board, or manage claims."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Input
              type="email"
              required
              placeholder="you@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </Field>
        <Field label="Password">
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
            />
          </div>
        </Field>

        {error && <ErrorState message={error} />}

        <Button type="submit" loading={loading} className="w-full" icon={ArrowRight} size="lg">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left / brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-700 p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Tag size={19} strokeWidth={2.4} />
          </div>
          <span className="font-display text-lg font-bold">FindBack</span>
        </div>

        <div className="relative max-w-sm">
          <p className="font-display text-[34px] font-bold leading-[1.15]">
            Every lost item has a story that isn't over yet.
          </p>
          <p className="mt-4 text-sm text-brand-100/80">
            One shared board for the whole campus — report what you've lost,
            log what you've found, and let the claims desk close the loop.
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-xs font-medium text-brand-100/70">
          <span>USER-SERVICE</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>ITEM-SERVICE</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>CLAIM-SERVICE</span>
        </div>
      </div>

      {/* Right / form panel */}
      <div className="flex items-center justify-center bg-paper px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
                <Tag size={16} />
              </div>
              <span className="font-display text-base font-bold text-ink">FindBack</span>
            </div>
          </div>
          <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-brand-500">
            {eyebrow}
          </p>
          <h1 className="font-display text-[26px] font-bold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
          <div className="mt-7 rounded-2xl border border-line bg-white p-6 shadow-sm shadow-ink/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
