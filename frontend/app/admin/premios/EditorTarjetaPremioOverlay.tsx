"use client";
import { useState } from "react";
import { X, Save } from "lucide-react";

type Props = {
  id: number;
  initial: { nombre: string; descripcion: string; costoPuntos: number };
  onSave?: (id: number, data: { nombre: string; descripcion: string; costoPuntos: number }) => void;
  onDelete?: (id: number) => void;
};

export function EditorTarjetaPremioOverlay({ id, initial, onSave, onDelete }: Props) {
  const [form, setForm] = useState(initial);

  return (
    <div className="absolute inset-0 z-20 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-[92%] max-w-md rounded-xl bg-white/95 border border-gray-200 shadow-xl p-4 space-y-3">
        <button
          className="absolute top-2 right-2 rounded-full p-1 bg-red-100 text-red-700 hover:bg-red-200"
          title="Eliminar premio"
          onClick={() => onDelete?.(id)}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid gap-3">
          <label className="text-xs font-medium text-gray-600">Nombre</label>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <label className="text-xs font-medium text-gray-600">Descripción</label>
          <textarea
            className="w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <label className="text-xs font-medium text-gray-600">Costo (pts)</label>
          <input
            type="number"
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={form.costoPuntos}
            onChange={(e) => setForm({ ...form, costoPuntos: Number(e.target.value) })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button className="rounded-md px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200">Cerrar</button>
          <button
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm bg-primary text-white hover:bg-primary-hover"
            onClick={() => onSave?.(id, form)}
          >
            <Save className="w-4 h-4" /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}