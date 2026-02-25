"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/toast";
import {
  listarCanjesAdmin,
  cambiarEstadoCanje,
  type CanjeAdmin,
} from "@/servicios/canjes.servicio";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  User,
  Gift,
} from "lucide-react";

const FILTROS_ESTADO = [
  { valor: "", etiqueta: "Todos" },
  { valor: "PENDIENTE", etiqueta: "Pendientes" },
  { valor: "ENTREGADO", etiqueta: "Entregados" },
  { valor: "CANCELADO", etiqueta: "Cancelados" },
] as const;

function BadgeEstado({ estado }: { estado: string }) {
  const estilos: Record<string, string> = {
    PENDIENTE: "bg-amber-100 text-amber-800 border-amber-200",
    ENTREGADO: "bg-green-100 text-green-800 border-green-200",
    CANCELADO: "bg-red-100 text-red-800 border-red-200",
  };

  const iconos: Record<string, React.ReactNode> = {
    PENDIENTE: <Clock className="w-3.5 h-3.5" />,
    ENTREGADO: <CheckCircle className="w-3.5 h-3.5" />,
    CANCELADO: <XCircle className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${estilos[estado] ?? "bg-neutral-100 text-neutral-600 border-neutral-200"}`}
    >
      {iconos[estado]}
      {estado}
    </span>
  );
}

function formatearFecha(fechaISO: string) {
  return new Date(fechaISO).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PaginaAdminCanjes() {
  const { data: sesion } = useSession();
  const token = sesion?.user?.accessToken;
  const { showSuccess, showError } = useToast();

  const [canjes, setCanjes] = useState<CanjeAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [procesandoId, setProcesandoId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setCargando(true);
    listarCanjesAdmin(token, filtro || undefined)
      .then(setCanjes)
      .catch(() => setCanjes([]))
      .finally(() => setCargando(false));
  }, [token, filtro]);

  const manejarCambioEstado = async (canjeId: string, nuevoEstado: string) => {
    if (!token) return;
    setProcesandoId(canjeId);
    try {
      await cambiarEstadoCanje(canjeId, nuevoEstado, token);
      // Recargar la lista
      const actualizados = await listarCanjesAdmin(token, filtro || undefined);
      setCanjes(actualizados);
      showSuccess(
        nuevoEstado === "ENTREGADO"
          ? "Canje marcado como entregado"
          : "Canje cancelado, puntos devueltos",
      );
    } catch (e: unknown) {
      showError(e instanceof Error ? e.message : "Error al cambiar estado");
    } finally {
      setProcesandoId(null);
    }
  };

  const canjesPendientes = canjes.filter(
    (c) => c.estado === "PENDIENTE",
  ).length;

  return (
    <section className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          Gestión de Canjes
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Administrá las solicitudes de canje de premios de los clientes.
        </p>
      </div>

      {/* Resumen rápido */}
      {canjesPendientes > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            Tenés{" "}
            <strong>
              {canjesPendientes} canje{canjesPendientes > 1 ? "s" : ""}{" "}
              pendiente{canjesPendientes > 1 ? "s" : ""}
            </strong>{" "}
            de entrega.
          </p>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {FILTROS_ESTADO.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
              filtro === f.valor
                ? "bg-neutral-800 text-white border-neutral-800"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {/* Lista */}
      {cargando ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-neutral-500">Cargando canjes...</p>
        </div>
      ) : canjes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle className="w-10 h-10 text-neutral-300" />
          <p className="text-neutral-500 font-medium">
            No hay canjes{filtro ? ` con estado "${filtro}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {canjes.map((canje) => (
            <div
              key={canje.id}
              className="bg-white border border-neutral-200/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow"
            >
              {/* Info usuario */}
              <div className="flex items-center gap-3 sm:w-48 shrink-0">
                <div className="bg-neutral-100 p-2 rounded-full shrink-0">
                  <User className="w-4 h-4 text-neutral-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-800 text-sm truncate">
                    {canje.usuario?.nombre ?? "Usuario"}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {canje.usuario?.correo ?? ""}
                  </p>
                </div>
              </div>

              {/* Info premio */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="bg-primary/10 p-2 rounded-full shrink-0">
                  <Gift className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-neutral-700 text-sm truncate">
                    {canje.premio?.nombre ?? "Premio eliminado"}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {canje.puntosGastados} pts —{" "}
                    {formatearFecha(canje.fechaSolicitud)}
                  </p>
                </div>
              </div>

              {/* Estado + acciones */}
              <div className="flex items-center gap-3 shrink-0 sm:ml-auto">
                <BadgeEstado estado={canje.estado} />

                {canje.estado === "PENDIENTE" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => manejarCambioEstado(canje.id, "ENTREGADO")}
                      disabled={procesandoId === canje.id}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {procesandoId === canje.id ? "..." : "Marcar Entregado"}
                    </button>
                    <button
                      onClick={() => manejarCambioEstado(canje.id, "CANCELADO")}
                      disabled={procesandoId === canje.id}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {canje.estado === "ENTREGADO" && canje.fechaEntrega && (
                  <span className="text-xs text-neutral-400">
                    {formatearFecha(canje.fechaEntrega)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
