import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Check, X, Trash2, MapPin } from "lucide-react";
import { getAllClaims, updateClaimStatus, deleteClaim } from "../../api/claims";
import { getItemById } from "../../api/items";
import { useToast } from "../../context/ToastContext";
import { PageHeader } from "../../components/PageHeader";
import { Select } from "../../components/Field";
import StatusBadge from "../../components/StatusBadge";
import CategoryTag from "../../components/CategoryTag";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Loader, EmptyState, ErrorState } from "../../components/States";

export default function ManageClaims() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("ALL");
  const [busyId, setBusyId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const claims = await getAllClaims();
      const uniqueItemIds = [...new Set(claims.map((c) => c.itemId))];
      const entries = await Promise.all(
        uniqueItemIds.map(async (id) => {
          try {
            return [id, await getItemById(id)];
          } catch {
            return [id, null];
          }
        })
      );
      const itemMap = Object.fromEntries(entries);
      const merged = claims
        .map((c) => ({ ...c, item: itemMap[c.itemId] }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setRows(merged);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecision(claim, decision) {
    setBusyId(claim.id);
    try {
      await updateClaimStatus(claim.id, decision, "admin");
      setRows((prev) => prev.map((r) => (r.id === claim.id ? { ...r, status: decision } : r)));
      toast.success(`Claim #${claim.id} ${decision.toLowerCase()}.`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setBusyId(pendingDelete.id);
    try {
      await deleteClaim(pendingDelete.id);
      setRows((prev) => prev.filter((r) => r.id !== pendingDelete.id));
      toast.success(`Claim #${pendingDelete.id} deleted.`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  }

  const filtered = useMemo(
    () => rows.filter((r) => status === "ALL" || r.status === status),
    [rows, status]
  );

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Claims"
        description="Review claims against the reported item and approve or reject them."
        action={
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Select>
        }
      />

      {loading && <Loader label="Loading claims…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon={ClipboardCheck} title="No claims here" />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-2xl border border-line bg-white p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper">
                  {c.item?.imageUrl ? (
                    <img src={c.item.imageUrl} alt={c.item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-soft/50">
                      <ClipboardCheck size={18} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-sm font-bold text-ink">
                      {c.item?.name || `Item ${c.itemId}`}
                    </h3>
                    {c.item && <CategoryTag category={c.item.category} />}
                    <span className="font-mono text-[11px] text-ink-soft">#{c.id}</span>
                  </div>
                  {c.item?.location && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-soft">
                      <MapPin size={11} /> {c.item.location}
                    </p>
                  )}
                  <p className="mt-1 text-xs font-semibold text-ink-soft">
                    Claimant: <span className="text-ink">{c.claimantEmail}</span>
                  </p>
                </div>

                <StatusBadge status={c.status} />
              </div>

              <div className="mt-3 rounded-lg bg-paper/60 px-3 py-2.5 text-sm text-ink-soft">
                “{c.description}”
              </div>

              <div className="mt-3 flex flex-wrap justify-end gap-2">
                {c.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Check}
                      loading={busyId === c.id}
                      onClick={() => handleDecision(c, "APPROVED")}
                      className="!border-[var(--color-ok)]/30 !text-[var(--color-ok)] hover:!bg-[var(--color-ok-soft)]"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={X}
                      loading={busyId === c.id}
                      onClick={() => handleDecision(c, "REJECTED")}
                      className="!border-[var(--color-bad)]/30 !text-[var(--color-bad)] hover:!bg-[var(--color-bad-soft)]"
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setPendingDelete(c)} className="!text-[var(--color-bad)]">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete claim #${pendingDelete?.id}?`}
        description="This permanently removes the claim record. This can't be undone."
        confirmLabel="Delete claim"
        loading={busyId === pendingDelete?.id}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
