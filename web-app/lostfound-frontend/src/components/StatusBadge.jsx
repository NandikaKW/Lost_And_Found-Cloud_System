const STYLES = {
  OPEN: "bg-[var(--color-ok-soft)] text-[#1c6b2c]",
  CLAIMED: "bg-[var(--color-warn-soft)] text-[#8a5c09]",
  CLOSED: "bg-[#EEEEF0] text-[#5B6072]",
  PENDING: "bg-[var(--color-warn-soft)] text-[#8a5c09]",
  APPROVED: "bg-[var(--color-ok-soft)] text-[#1c6b2c]",
  REJECTED: "bg-[var(--color-bad-soft)] text-[#9a1f1f]",
};

const DOT = {
  OPEN: "bg-[var(--color-ok)]",
  CLAIMED: "bg-[var(--color-warn)]",
  CLOSED: "bg-[#9096A3]",
  PENDING: "bg-[var(--color-warn)]",
  APPROVED: "bg-[var(--color-ok)]",
  REJECTED: "bg-[var(--color-bad)]",
};

export default function StatusBadge({ status }) {
  const key = (status || "").toUpperCase();
  const style = STYLES[key] || "bg-[#EEEEF0] text-[#5B6072]";
  const dot = DOT[key] || "bg-[#9096A3]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {key || "UNKNOWN"}
    </span>
  );
}
