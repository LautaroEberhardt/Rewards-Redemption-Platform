"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  obtenerHistorialAdmin,
  type TransaccionPuntos,
  type TipoTransaccion,
} from "@/servicios/historial.servicio";
import {
  History,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  AlertCircle,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const REGISTROS_POR_PAGINA = 20;

const FILTROS_TIPO = [
  { valor: "", etiqueta: "Todos" },
  { valor: "INGRESO", etiqueta: "Ingresos" },
  { valor: "EGRESO", etiqueta: "Egresos" },
] as const;

function formatearFecha(fechaISO: string) {
  return new Date(fechaISO).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PaginaAdminHistorial() {
  const { data: sesion, status } = useSession();
  const token = sesion?.user?.accessToken;

  const [transacciones, setTransacciones] = useState<TransaccionPuntos[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState<TipoTransaccion | "">("");

  const totalPaginas = Math.max(
    1,
    Math.ceil(totalRegistros / REGISTROS_POR_PAGINA),
  );

  const cargarPagina = useCallback(
    (pagina: number, tipo: TipoTransaccion | "" = filtroTipo) => {
      if (!token) return;

      setCargando(true);
      setError(null);

      obtenerHistorialAdmin(
        token,
        pagina,
        REGISTROS_POR_PAGINA,
        tipo || undefined,
      )
        .then((res) => {
          setTransacciones(res.datos);
          setTotalRegistros(res.total);
          setPaginaActual(pagina);
        })
        .catch((err: unknown) => {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar el historial.",
          );
        })
        .finally(() => setCargando(false));
    },
    [token, filtroTipo],
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    cargarPagina(1, filtroTipo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token, filtroTipo]);

  const cambiarFiltro = (nuevoTipo: TipoTransaccion | "") => {
    setFiltroTipo(nuevoTipo);
    setPaginaActual(1);
  };

  const totalIngresado = transacciones
    .filter((t) => t.tipo === "INGRESO")
    .reduce((acc, t) => acc + Math.abs(t.cantidad), 0);

  const totalEgresado = transacciones
    .filter((t) => t.tipo === "EGRESO")
    .reduce((acc, t) => acc + Math.abs(t.cantidad), 0);

  return (
    <section className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
          <History className="w-6 h-6 text-primary" />
          Historial de Movimientos
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Últimos movimientos de puntos y canjes de todos los usuarios.
        </p>
      </div>

      {/* Resumen de la página actual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="bg-green-100 p-2.5 rounded-full">
            <ArrowUpCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-green-700 uppercase tracking-wider">
              Ingresos (esta página)
            </p>
            <p className="text-2xl font-bold text-green-800">
              +{totalIngresado.toLocaleString("es-AR")}{" "}
              <span className="text-sm font-normal">pts</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="bg-red-100 p-2.5 rounded-full">
            <ArrowDownCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-red-700 uppercase tracking-wider">
              Egresos (esta página)
            </p>
            <p className="text-2xl font-bold text-red-800">
              -{totalEgresado.toLocaleString("es-AR")}{" "}
              <span className="text-sm font-normal">pts</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {FILTROS_TIPO.map((f) => (
          <button
            key={f.valor}
            onClick={() => cambiarFiltro(f.valor as TipoTransaccion | "")}
            className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
              filtroTipo === f.valor
                ? "bg-neutral-800 text-white border-neutral-800"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {f.etiqueta}
          </button>
        ))}
        <span className="text-xs text-neutral-400 self-center ml-2">
          {totalRegistros} registro{totalRegistros !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Lista */}
      {cargando ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-neutral-500">Cargando historial...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : transacciones.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle className="w-10 h-10 text-neutral-300" />
          <p className="text-neutral-500 font-medium">
            No hay movimientos
            {filtroTipo ? ` de tipo "${filtroTipo}"` : ""}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transacciones.map((t) => {
            const esIngreso = t.tipo === "INGRESO";
            return (
              <div
                key={t.id}
                className="bg-white border border-neutral-200/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Ícono tipo */}
                <div
                  className={`shrink-0 p-2 rounded-full ${
                    esIngreso ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {esIngreso ? (
                    <ArrowUpCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>

                {/* Info usuario */}
                <div className="flex items-center gap-3 sm:w-48 shrink-0">
                  <div className="bg-neutral-100 p-2 rounded-full shrink-0">
                    <User className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-800 text-sm truncate">
                      {t.usuario?.nombreCompleto ?? "Usuario"}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {t.usuario?.correo ?? ""}
                    </p>
                  </div>
                </div>

                {/* Concepto y fecha */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-700 text-sm truncate">
                    {t.concepto}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {formatearFecha(t.fecha)} — Saldo: {t.saldoAnterior} →{" "}
                    {t.saldoNuevo}
                  </p>
                </div>

                {/* Cantidad */}
                <div className="shrink-0 sm:ml-auto text-right">
                  <span
                    className={`text-lg font-bold ${
                      esIngreso ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {esIngreso ? "+" : ""}
                    {t.cantidad.toLocaleString("es-AR")}
                  </span>
                  <p className="text-xs text-neutral-400">pts</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {!cargando && totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => cargarPagina(paginaActual - 1)}
            disabled={paginaActual <= 1}
            className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-neutral-600">
            Página{" "}
            <strong>
              {paginaActual} / {totalPaginas}
            </strong>
          </span>
          <button
            onClick={() => cargarPagina(paginaActual + 1)}
            disabled={paginaActual >= totalPaginas}
            className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
