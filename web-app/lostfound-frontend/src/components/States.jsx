import { Loader2, Inbox, AlertTriangle } from "lucide-react";

export function Loader({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-soft">
      <Loader2 size={26} className="animate-spin text-brand-500" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink-soft">
        <Icon size={22} />
      </div>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-ink-soft">{description}</p>
      )}
      {action}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--color-bad)]/20 bg-[var(--color-bad-soft)] px-4 py-3 text-sm text-[#9a1f1f]">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
}
