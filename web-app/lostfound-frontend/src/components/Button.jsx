import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20 disabled:hover:bg-brand-500",
  secondary:
    "bg-white text-ink border border-line hover:bg-paper disabled:hover:bg-white",
  danger:
    "bg-white text-[var(--color-bad)] border border-[var(--color-bad)]/25 hover:bg-[var(--color-bad-soft)]",
  ghost: "text-ink-soft hover:bg-black/5",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-sm",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  className = "",
  children,
  disabled,
  ...props
}) {
  return (
    <Comp
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </Comp>
  );
}
