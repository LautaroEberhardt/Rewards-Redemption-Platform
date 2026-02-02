"use client";
import { useState } from "react";
import { X, Save, Trash2, Gift, Coins, AlignLeft } from "lucide-react";
import { Boton } from "@/components/ui/boton";

type Props = {
  id: number;
  initial: { nombre: string; descripcion: string; costoPuntos: number };
  onSave?: (
    id: number,
    data: { nombre: string; descripcion: string; costoPuntos: number },
  ) => void;
  onDelete?: (id: number) => void;
  onClose: () => void;
};

export function EditorTarjetaPremioOverlay({
  id,
  initial,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const [formulario, setFormulario] = useState(initial);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);

  const manejarGuardado = () => {
    onSave?.(id, formulario);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 transition-all duration-300 animate-in fade-in">
      <div className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="relative bg-linear-to-r from-(--primary)/10 to-transparent p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background-secondary rounded-lg shadow-sm text-(--primary)">
              <Gift className="w-6 h-6"/>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Editar Premio</h3>
              <p className="text-xs text-gray-500">
                Modifica los detalles visibles para el cliente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              Nombre del Premio
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-background-secondary bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-(--primary) focus:bg-white focus:ring-2 focus:ring-(--primary)/20 transition-all outline-none placeholder:text-gray-400"
              placeholder="Ej: Auriculares Bluetooth"
              value={formulario.nombre}
              onChange={(e) =>
                setFormulario({ ...formulario, nombre: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <Coins className="w-3 h-3" /> Costo (Puntos)
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full rounded-xl border border-background-secondary bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-(--primary) focus:bg-white focus:ring-2 focus:ring-(--primary)/20 transition-all outline-none"
                  value={formulario.costoPuntos}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      costoPuntos: Number(e.target.value),
                    })
                  }
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-gray-400 pointer-events-none">
                  PTS
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <AlignLeft className="w-3 h-3" /> Descripción
            </label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-xl border border-background-secondary bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-(--primary) focus:bg-white focus:ring-2 focus:ring-(--primary)/20 transition-all outline-none"
              placeholder="Describe los detalles del premio..."
              value={formulario.descripcion}
              onChange={(e) =>
                setFormulario({ ...formulario, descripcion: e.target.value })
              }
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center">
            {!confirmarEliminacion ? (
              <Boton
                onClick={() => setConfirmarEliminacion(true)}
                className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                title="Eliminar este premio"
                variante="peligro"
              >
                <Trash2 className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                <span className="hidden sm:inline">Eliminar</span>
              </Boton>
            ) : (
              <div className="flex items-center gap-2 animate-in slide-in-from-left-2 fade-in">
                <span className="text-xs font-bold text-red-600">¿Seguro?</span>
                <button
                  onClick={() => onDelete?.(id)}
                  className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700"
                >
                  Sí, borrar
                </button>
                <button
                  onClick={() => setConfirmarEliminacion(false)}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1.5 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <Boton
              onClick={manejarGuardado}
              className="flex items-center gap-2 px-3 py-2 text-sm"
              variante="secundario"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
}
