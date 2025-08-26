import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastContextValue = {
  show: (message: string, kind?: ToastKind, timeoutMs?: number) => void;
  success: (message: string, timeoutMs?: number) => void;
  error: (message: string, timeoutMs?: number) => void;
  info: (message: string, timeoutMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(1);

  const remove = useCallback((id: number) => {
    setItems(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message: string, kind: ToastKind = "info", timeoutMs = 3000) => {
    const id = idRef.current++;
    setItems(prev => [...prev, { id, kind, message }]);
    window.setTimeout(() => remove(id), timeoutMs);
  }, [remove]);

  const value = useMemo<ToastContextValue>(() => ({
    show,
    success: (m, t) => show(m, "success", t),
    error: (m, t) => show(m, "error", t),
    info: (m, t) => show(m, "info", t),
  }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-3 items-center">
        {items.map(t => (
          <div
            key={t.id}
            className={
              `px-4 py-3 rounded-lg shadow-md text-sm transition-all ` +
              (t.kind === "success" ? "bg-green-600 text-white" : t.kind === "error" ? "bg-red-600 text-white" : "bg-gray-900 text-white")
            }
          >
            {t.message}
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


