import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Boxes, ClipboardCheck, Hourglass, ArrowUpRight } from "lucide-react";
import { getAllUsers } from "../../api/users";
import { getAllItems } from "../../api/items";
import { getAllClaims } from "../../api/claims";
import { PageHeader, StatCard } from "../../components/PageHeader";
import ItemCard from "../../components/ItemCard";
import StatusBadge from "../../components/StatusBadge";
import { Loader, ErrorState, EmptyState } from "../../components/States";

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [users, items, claims] = await Promise.all([
          getAllUsers(),
          getAllItems(),
          getAllClaims(),
        ]);
        setData({ users, items, claims });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader label="Loading dashboard…" />;
  if (error) return <ErrorState message={error} />;

  const { users, items, claims } = data;
  const openItems = items.filter((i) => i.status === "OPEN").length;
  const pendingClaims = claims.filter((c) => c.status === "PENDING");
  const recentItems = [...items].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 4);

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Overview"
        description="A snapshot of everything moving through FindBack right now."
      />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={users.length} tone="brand" />
        <StatCard icon={Boxes} label="Open items" value={openItems} tone="ok" />
        <StatCard icon={Hourglass} label="Pending claims" value={pendingClaims.length} tone="warn" />
        <StatCard icon={ClipboardCheck} label="Total claims" value={claims.length} tone="brand" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink">Latest reports</h2>
            <Link to="/admin/items" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          {recentItems.length === 0 ? (
            <EmptyState title="No items reported yet" />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {recentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink">Needs review</h2>
            <Link to="/admin/claims" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          {pendingClaims.length === 0 ? (
            <EmptyState title="No pending claims" description="All caught up — nothing waiting on your review." />
          ) : (
            <div className="space-y-2.5">
              {pendingClaims.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">Claim #{c.id} · Item {c.itemId}</p>
                    <p className="truncate text-xs text-ink-soft">{c.claimantEmail}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
