// A small luggage-tag shaped label used to mark an item as LOST or FOUND.
// The notch mimics a real tag's string hole -- the one deliberate signature
// motif carried across the item cards.
export default function CategoryTag({ category }) {
  const isLost = (category || "").toUpperCase() === "LOST";
  return (
    <span
      className={`relative inline-flex items-center gap-1.5 py-1 pl-4 pr-2.5 text-[11px] font-bold uppercase tracking-wider ${
        isLost
          ? "bg-[var(--color-bad-soft)] text-[#9a1f1f]"
          : "bg-brand-50 text-brand-700"
      }`}
      style={{
        clipPath:
          "polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)",
      }}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isLost ? "bg-[var(--color-bad)]" : "bg-brand-500"
        }`}
      />
      {isLost ? "Lost" : "Found"}
    </span>
  );
}
