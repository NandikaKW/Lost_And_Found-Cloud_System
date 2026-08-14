import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, variant = "info") => {
      const id = ++idCounter;
      setToasts((t) => [...t, { id, message, variant }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const toast = {
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex w-[min(360px,90vw)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-[toast-in_0.25s_ease-out] ${
              t.variant === "success"
                ? "border-[var(--color-ok)]/20 bg-[var(--color-ok-soft)] text-[#1c6b2c]"
                : t.variant === "error"
                ? "border-[var(--color-bad)]/20 bg-[var(--color-bad-soft)] text-[#9a1f1f]"
                : "border-brand-100 bg-brand-50 text-brand-700"
            }`}
          >
            {t.variant === "success" && <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            {t.variant === "error" && <XCircle size={18} className="mt-0.5 shrink-0" />}
            {t.variant === "info" && <Info size={18} className="mt-0.5 shrink-0" />}
            <p className="flex-1 text-sm font-medium leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-60 transition hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
