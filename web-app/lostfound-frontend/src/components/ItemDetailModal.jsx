import { useState } from "react";
import { X, MapPin, Mail, Phone, ImageOff, Send } from "lucide-react";
import CategoryTag from "./CategoryTag";
import StatusBadge from "./StatusBadge";
import Button from "./Button";
import { Field, Textarea } from "./Field";

export default function ItemDetailModal({
  item,
  onClose,
  showClaimForm = false,
  claimSubmitting = false,
  onSubmitClaim,
  extraActions,
}) {
  const [description, setDescription] = useState("");

  if (!item) return null;

  function handleClaim(e) {
    e.preventDefault();
    onSubmitClaim?.(description);
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-white shadow-2xl scrollbar-thin">
        <div className="relative aspect-[16/9] w-full bg-paper">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-ink-soft/50">
              <ImageOff size={30} />
              <span className="text-xs font-medium uppercase tracking-wide">No photo provided</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white"
          >
            <X size={16} />
          </button>
          <div className="absolute left-3 top-3 flex gap-2">
            <CategoryTag category={item.category} />
            <StatusBadge status={item.status} />
          </div>
        </div>

        <div className="p-6">
          <h2 className="font-display text-xl font-bold text-ink">{item.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>

          <div className="mt-4 grid grid-cols-1 gap-2.5 rounded-xl border border-line bg-paper/60 p-4 text-sm sm:grid-cols-2">
            <InfoRow icon={MapPin} label="Location" value={item.location} />
            <InfoRow icon={Mail} label="Contact email" value={item.contactEmail || "—"} />
            <InfoRow icon={Phone} label="Contact phone" value={item.contactPhone || "—"} />
            <InfoRow
              icon={MapPin}
              label="Reported"
              value={item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
              mono
            />
          </div>

          {extraActions}

          {showClaimForm && (
            <form onSubmit={handleClaim} className="mt-6 border-t border-dashed border-line pt-5">
              <Field
                label="This is mine because…"
                hint="Describe an identifying detail the finder can verify before you meet up."
              >
                <Textarea
                  required
                  rows={3}
                  placeholder="e.g. It has a small scratch on the back cover and a blue keychain attached."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
              <Button type="submit" loading={claimSubmitting} icon={Send} className="mt-3 w-full">
                Submit claim
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="mt-0.5 shrink-0 text-ink-soft" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">{label}</p>
        <p className={`truncate text-ink ${mono ? "font-mono text-xs" : "font-medium"}`}>{value}</p>
      </div>
    </div>
  );
}
