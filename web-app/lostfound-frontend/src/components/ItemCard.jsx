import { MapPin, ImageOff } from "lucide-react";
import CategoryTag from "./CategoryTag";
import StatusBadge from "./StatusBadge";

function timeAgo(ms) {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}

export default function ItemCard({ item, onClick, footer }) {
  return (
    <div
      onClick={onClick}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-ink-soft/50">
            <ImageOff size={26} />
            <span className="text-[11px] font-medium uppercase tracking-wide">
              No photo
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <CategoryTag category={item.category} />
        </div>
        <div className="absolute right-3 top-3">
          <StatusBadge status={item.status} />
        </div>
      </div>

      <div className="ticket-notch relative flex flex-1 flex-col gap-2 border-t border-dashed border-line px-4 py-4">
        <h3 className="line-clamp-1 font-display text-[15px] font-bold text-ink">
          {item.name}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
          {item.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-ink-soft">
          <span className="flex min-w-0 items-center gap-1 truncate">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{item.location}</span>
          </span>
          <span className="font-mono shrink-0">{timeAgo(item.createdAt)}</span>
        </div>
        {footer}
      </div>
    </div>
  );
}
