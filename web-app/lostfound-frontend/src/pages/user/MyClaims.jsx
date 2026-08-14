import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, MapPin, Trash2 } from "lucide-react";
import { getAllClaims, deleteClaim } from "../../api/claims";
import { getItemById } from "../../api/items";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { PageHeader } from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import CategoryTag from "../../components/CategoryTag";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Loader, EmptyState, ErrorState } from "../../components/States";

export default function MyClaims() {
  const { user } = useAuth();
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const claims = await getAllClaims();
      const mine = claims.filter((c) => String(c.claimantUserId) === String(user.id));

      const uniqueItemIds = [...new Set(mine.map((c) => c.itemId))];
      const itemEntries = await Promise.all(
        uniqueItemIds.map(async (id) => {
          try {
            return [id, await getItemById(id)];
          } catch {
            return [id, null];
          }
        })
      );
      const itemMap = Object.fromEntries(itemEntries);

      const merged = mine
        .map((c) => ({ ...c, item: itemMap[c.itemId] }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setRows(merged);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    try {
      await deleteClaim(pendingDelete.id);
      toast.success("Claim withdrawn.");
      setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Track your claims"
        title="My claims"
        description="Every claim you've submitted, and where it stands with the moderation team."
      />

      {loading && <Loader label="Loading your claims…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && rows.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No claims yet"
          description="When you find an item that's yours on the board, submit a claim and track its progress here."
          action={
            <Button as={Link} to="/app" size="sm" className="mt-1">
              Browse the board
            </Button>
          }
        />
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="space-y-3">
          {rows.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-paper">
                {c.item?.imageUrl ? (
                  <img src={c.item.imageUrl} alt={c.item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-soft/50">
                    <ClipboardList size={20} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-[15px] font-bold text-ink">
                    {c.item?.name || `Item ${c.itemId}`}
                  </h3>
                  {c.item && <CategoryTag category={c.item.category} />}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-ink-soft">{c.description}</p>
                {c.item?.location && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
                    <MapPin size={11} /> {c.item.location}
                  </p>
                )}
                <p className="mt-1 font-mono text-[11px] text-ink-soft">
                  Claim #{c.id} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                <StatusBadge status={c.status} />
                {c.status === "PENDING" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => setPendingDelete(c)}
                    className="!text-[var(--color-bad)]"
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Withdraw this claim?"
        description="You can always submit a new claim for this item later."
        confirmLabel="Withdraw claim"
        loading={busyId === pendingDelete?.id}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
