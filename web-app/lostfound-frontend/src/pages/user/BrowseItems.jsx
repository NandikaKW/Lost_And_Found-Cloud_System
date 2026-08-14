import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, PackageSearch } from "lucide-react";
import { getAllItems } from "../../api/items";
import { createClaim } from "../../api/claims";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { PageHeader } from "../../components/PageHeader";
import ItemCard from "../../components/ItemCard";
import ItemDetailModal from "../../components/ItemDetailModal";
import { Loader, EmptyState, ErrorState } from "../../components/States";
import { Input, Select } from "../../components/Field";

export default function BrowseItems() {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("OPEN");
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllItems();
      setItems(data);
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
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          i.name?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [items, category, status, query]);

  async function handleSubmitClaim(description) {
    if (!selected) return;
    setSubmitting(true);
    try {
      await createClaim({
        itemId: selected.id,
        claimantUserId: user.id,
        claimantEmail: user.email,
        description,
      });
      toast.success("Claim submitted — track it from My Claims.");
      setSelected(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const isOwnItem = selected?.reportedByUserId != null && String(selected.reportedByUserId) === String(user.id);

  return (
    <div>
      <PageHeader
        eyebrow="Community board"
        title="Browse lost & found items"
        description="Search everything the campus has reported. Filter by type or status to narrow things down."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <Input
            placeholder="Search by name, description, or location…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <SlidersHorizontal size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-36 pl-8">
              <option value="ALL">All types</option>
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </Select>
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-36">
            <option value="ALL">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLAIMED">Claimed</option>
            <option value="CLOSED">Closed</option>
          </Select>
        </div>
      </div>

      {loading && <Loader label="Loading the board…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon={PackageSearch}
          title="No items match your filters"
          description="Try widening your search, or check back later — new reports come in all the time."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => setSelected(item)} />
          ))}
        </div>
      )}

      {selected && (
        <ItemDetailModal
          item={selected}
          onClose={() => setSelected(null)}
          showClaimForm={!isOwnItem && selected.status === "OPEN"}
          claimSubmitting={submitting}
          onSubmitClaim={handleSubmitClaim}
          extraActions={
            isOwnItem ? (
              <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">
                You reported this item — manage it from My Items.
              </p>
            ) : selected.status !== "OPEN" ? (
              <p className="mt-4 rounded-lg bg-paper px-3 py-2 text-xs font-semibold text-ink-soft">
                This item is {selected.status.toLowerCase()} and can't be claimed right now.
              </p>
            ) : null
          }
        />
      )}
    </div>
  );
}
