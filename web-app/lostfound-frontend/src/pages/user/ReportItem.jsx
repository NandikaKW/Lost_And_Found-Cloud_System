import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X, Send, MapPin } from "lucide-react";
import { createItem } from "../../api/items";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { PageHeader } from "../../components/PageHeader";
import { Field, Input, Textarea, Select } from "../../components/Field";
import Button from "../../components/Button";
import { ErrorState } from "../../components/States";

const initial = {
  name: "",
  description: "",
  category: "LOST",
  location: "",
  contactEmail: "",
  contactPhone: "",
};

export default function ReportItem() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({ ...initial, contactEmail: user.email });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearFile() {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createItem({ ...form, reportedByUserId: user.id }, image);
      toast.success(
        form.category === "LOST"
          ? "Lost item reported — we'll surface matches as they come in."
          : "Found item reported — thanks for helping reunite it with its owner!"
      );
      navigate("/app/my-items");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="New report"
        title="Report an item"
        description="A clear description and a photo make it much easier for someone to recognize their belongings."
      />

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-line bg-white p-6">
        {/* Category toggle */}
        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            What are you reporting?
          </span>
          <div className="grid grid-cols-2 gap-3">
            {["LOST", "FOUND"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => update("category", c)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  form.category === c
                    ? c === "LOST"
                      ? "border-[var(--color-bad)] bg-[var(--color-bad-soft)]"
                      : "border-brand-500 bg-brand-50"
                    : "border-line bg-white hover:bg-paper"
                }`}
              >
                <p className={`font-display text-sm font-bold ${form.category === c ? (c === "LOST" ? "text-[#9a1f1f]" : "text-brand-700") : "text-ink"}`}>
                  {c === "LOST" ? "I lost something" : "I found something"}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {c === "LOST" ? "Help others recognize it" : "Help it get back home"}
                </p>
              </button>
            ))}
          </div>
        </div>

        <Field label="Item name">
          <Input
            required
            placeholder="e.g. Black Ray-Ban sunglasses"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>

        <Field label="Description" hint="Colour, brand, distinguishing marks — the more specific, the better.">
          <Textarea
            required
            rows={4}
            placeholder="Describe the item in detail…"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>

        <Field label="Location">
          <div className="relative">
            <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <Input
              required
              placeholder="e.g. Library, 2nd floor reading room"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="pl-10"
            />
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Contact email">
            <Input
              type="email"
              placeholder="you@campus.edu"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
            />
          </Field>
          <Field label="Contact phone" hint="Optional">
            <Input
              placeholder="07X XXX XXXX"
              value={form.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Photo" hint="Optional, but photos get claimed faster.">
          {preview ? (
            <div className="relative w-full max-w-xs overflow-hidden rounded-xl border border-line">
              <img src={preview} alt="Preview" className="aspect-[4/3] w-full object-cover" />
              <button
                type="button"
                onClick={clearFile}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm hover:bg-white"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-paper/60 px-4 py-8 text-center transition hover:bg-paper">
              <ImagePlus size={22} className="text-ink-soft" />
              <span className="text-sm font-semibold text-ink">Click to upload a photo</span>
              <span className="text-xs text-ink-soft">PNG or JPG, up to 10MB</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          )}
        </Field>

        {error && <ErrorState message={error} />}

        <Button type="submit" loading={submitting} icon={Send} size="lg" className="w-full">
          Submit report
        </Button>
      </form>
    </div>
  );
}
