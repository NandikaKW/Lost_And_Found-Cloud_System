import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Field, Input } from "../../components/Field";
import Button from "../../components/Button";
import { ErrorState } from "../../components/States";
import { AuthLayout } from "./Login";

export default function Register() {
  const { register, loading, error, setError } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      toast.success("Account created — sign in to continue");
      navigate("/login");
    } catch {
      // error captured in context
    }
  }

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Join FindBack"
      subtitle="New accounts start as a standard user — an admin can promote you later."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name">
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Input
              required
              placeholder="Nishan Perera"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="pl-10"
            />
          </div>
        </Field>
        <Field label="Email">
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Input
              type="email"
              required
              placeholder="you@campus.edu"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
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
              minLength={4}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="pl-10"
            />
          </div>
        </Field>

        {error && <ErrorState message={error} />}

        <Button type="submit" loading={loading} className="w-full" icon={ArrowRight} size="lg">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
