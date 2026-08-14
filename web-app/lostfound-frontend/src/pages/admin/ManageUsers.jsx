import { useEffect, useState } from "react";
import { Users, Trash2, ShieldCheck, Search } from "lucide-react";
import { getAllUsers, editUserRole, deleteUser } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { PageHeader } from "../../components/PageHeader";
import { Input } from "../../components/Field";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Loader, EmptyState, ErrorState } from "../../components/States";

export default function ManageUsers() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setUsers(await getAllUsers());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleRole(u) {
    const nextRole = u.role?.toLowerCase() === "admin" ? "user" : "admin";
    setBusyId(u.id);
    try {
      await editUserRole(u.id, nextRole);
      setUsers((prev) => prev.map((p) => (p.id === u.id ? { ...p, role: nextRole } : p)));
      toast.success(`${u.name || u.email} is now ${nextRole}.`);
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
      await deleteUser(pendingDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== pendingDelete.id));
      toast.success(`${pendingDelete.name || pendingDelete.email} removed.`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  }

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Everyone with a FindBack account. Promote trusted users to admin, or remove accounts."
      />

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
        <Input
          placeholder="Search by name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading && <Loader label="Loading users…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon={Users} title="No users found" />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-xs font-bold uppercase tracking-wide text-ink-soft">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isAdmin = u.role?.toLowerCase() === "admin";
                const isSelf = String(u.id) === String(me.id);
                return (
                  <tr key={u.id} className="border-b border-line last:border-0 hover:bg-paper/40">
                    <td className="px-5 py-3.5 font-semibold text-ink">
                      {u.name || "—"}
                      {isSelf && (
                        <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-600">
                          YOU
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          isAdmin
                            ? "bg-brand-50 text-brand-700"
                            : "bg-[#EEEEF0] text-ink-soft"
                        }`}
                      >
                        {isAdmin && <ShieldCheck size={12} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={busyId === u.id}
                          disabled={isSelf}
                          onClick={() => toggleRole(u)}
                        >
                          {isAdmin ? "Make user" : "Make admin"}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={Trash2}
                          disabled={isSelf}
                          onClick={() => setPendingDelete(u)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Remove ${pendingDelete?.name || pendingDelete?.email}?`}
        description="This permanently deletes the account. This can't be undone."
        confirmLabel="Delete user"
        loading={busyId === pendingDelete?.id}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
