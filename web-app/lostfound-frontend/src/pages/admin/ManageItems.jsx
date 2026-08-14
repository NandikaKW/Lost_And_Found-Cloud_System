import { useEffect, useMemo, useState } from "react";
import { Boxes, Search, Trash2 } from "lucide-react";
import { getAllItems, updateItemStatus, deleteItem } from "../../api/items";
import { useToast } from "../../context/ToastContext";
import { PageHeader } from "../../components/PageHeader";
import { Input, Select } from "../../components/Field";
import ItemCard from "../../components/ItemCard";
import ItemDetailModal from "../../components/ItemDetailModal";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Loader, EmptyState, ErrorState } from "../../components/States";

const STATUSES = ["OPEN", "CLAIMED", "CLOSED"];

export default function ManageItems() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await getAllItems());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return items
      .filter((i) => category === "ALL" || i.category === category)
      .filter((i) => status === "ALL" || i.status === status)
      .filter((i) => {
        const q = query.toLowerCase();
        return !q || i.name?.toLowerCase().includes(q) || i.location?.toLowerCase().includes(q);
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [items, category, status, query]);

  async function handleStatusChange(item, next) {
    setBusyId(item.id);
    try {
      await updateItemStatus(item.id, next);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: next } : i)));
      setSelected((s) => (s && s.id === item.id ? { ...s, status: next } : s));
      toast.success(`"${item.name}" is now ${next.toLowerCase()}.`);
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
      await deleteItem(pendingDelete.id);
      setItems((prev) => prev.filter((i) => i.id !== pendingDelete.id));
      toast.success(`"${pendingDelete.name}" deleted.`);
      setSelected(null);
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
        eyebrow="Admin"
        title="Items"
        description="Every lost & found report on the board. Update statuses or remove reports that break the rules."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <Input
            placeholder="Search by name or location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-32">
            <option value="ALL">All types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-36">
            <option value="ALL">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {loading && <Loader label="Loading items…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon={Boxes} title="No items match your filters" />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => setSelected(item)}
              footer={
                <div className="mt-3 border-t border-line pt-3" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={Trash2}
                    className="w-full"
                    onClick={() => setPendingDelete(item)}
                  >
                    Delete
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}

      {selected && (
        <ItemDetailModal
          item={selected}
          onClose={() => setSelected(null)}
          extraActions={
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-paper/60 p-3">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">Set status:</span>
              {STATUSES.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={selected.status === s ? "primary" : "secondary"}
                  loading={busyId === selected.id}
                  disabled={selected.status === s}
                  onClick={() => handleStatusChange(selected, s)}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          }
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This permanently removes the report and its photo. This can't be undone."
        confirmLabel="Delete item"
        loading={busyId === pendingDelete?.id}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
