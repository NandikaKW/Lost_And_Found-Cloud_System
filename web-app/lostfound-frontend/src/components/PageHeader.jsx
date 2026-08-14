export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-500">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-bold text-ink sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-xl text-sm text-ink-soft">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    ok: "bg-[var(--color-ok-soft)] text-[var(--color-ok)]",
    warn: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
    bad: "bg-[var(--color-bad-soft)] text-[var(--color-bad)]",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-display text-2xl font-bold leading-none text-ink">{value}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {label}
        </p>
      </div>
    </div>
  );
}
