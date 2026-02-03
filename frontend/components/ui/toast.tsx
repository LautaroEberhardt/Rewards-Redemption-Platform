"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = {
  id: number;
  type: "success" | "error" | "info";
  message: string;
};

type ToastContextValue = {
  toasts: Toast[];
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  showInfo: (msg: string) => void;
  remove: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const enqueue = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const showSuccess = useCallback(
    (msg: string) => enqueue("success", msg),
    [enqueue],
  );
  const showError = useCallback(
    (msg: string) => enqueue("error", msg),
    [enqueue],
  );
  const showInfo = useCallback(
    (msg: string) => enqueue("info", msg),
    [enqueue],
  );
  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts, showSuccess, showError, showInfo, remove }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}

export function ToastViewport() {
  const ctx = useToast();
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {ctx.toasts.map((t) => (
        <div
          key={t.id}
          className={
            "px-4 py-2 rounded-lg shadow text-white " +
            (t.type === "success"
              ? "bg-green-600"
              : t.type === "error"
                ? "bg-red-600"
                : "bg-gray-800")
          }
          onClick={() => ctx.remove(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
