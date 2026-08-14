import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackagePlus, Trash2, CheckCircle2 } from "lucide-react";
import { getItemsByUser, updateItemStatus, deleteItem } from "../../api/items";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { PageHeader } from "../../components/PageHeader";
import ItemCard from "../../components/ItemCard";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Loader, EmptyState, ErrorState } from "../../components/States";

export default function MyItems() {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
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
      const data = await getItemsByUser(String(user.id));
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClose(item) {
    setBusyId(item.id);
    try {
      await updateItemStatus(item.id, "CLOSED");
      toast.success(`"${item.name}" marked as closed.`);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "CLOSED" } : i)));
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
      toast.success(`"${pendingDelete.name}" deleted.`);
      setItems((prev) => prev.filter((i) => i.id !== pendingDelete.id));
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
        eyebrow="Your reports"
        title="My items"
        description="Everything you've reported as lost or found, in one place."
        action={
          <Button as={Link} to="/app/report" icon={PackagePlus}>
            Report an item
          </Button>
        }
      />

      {loading && <Loader label="Loading your items…" />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={PackagePlus}
          title="You haven't reported anything yet"
          description="Lost something on campus, or found someone else's item? Report it so it can find its way back."
          action={
            <Button as={Link} to="/app/report" size="sm" className="mt-1">
              Report an item
            </Button>
          }
        />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            .map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                footer={
                  <div className="mt-3 flex gap-2 border-t border-line pt-3">
                    {item.status !== "CLOSED" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={CheckCircle2}
                        loading={busyId === item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClose(item);
                        }}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDelete(item);
                      }}
                      className={item.status !== "CLOSED" ? "" : "flex-1"}
                    >
                      Delete
                    </Button>
                  </div>
                }
              />
            ))}
        </div>
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
