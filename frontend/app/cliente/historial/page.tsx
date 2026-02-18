"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  AlertCircle,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  obtenerHistorialPuntos,
  type TransaccionPuntos,
} from "@/servicios/historial.servicio";

const REGISTROS_POR_PAGINA = 15;

export default function PageHistorial() {
  const { data: sesion, status } = useSession();
  const [transacciones, setTransacciones] = useState<TransaccionPuntos[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const totalPaginas = Math.max(
    1,
    Math.ceil(totalRegistros / REGISTROS_POR_PAGINA),
  );

  const cargarPagina = useCallback(
    (pagina: number) => {
      const token = sesion?.user?.accessToken;
      if (!token) return;

      setCargando(true);
      setError(null);

      obtenerHistorialPuntos(token, pagina, REGISTROS_POR_PAGINA)
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
        .finally(() => {
          setCargando(false);
        });
    },
    [sesion],
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    cargarPagina(1);
  }, [status, cargarPagina]);

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalIngresado = transacciones
    .filter((t) => t.tipo === "INGRESO")
    .reduce((acc, t) => acc + Math.abs(t.cantidad), 0);

  const totalGastado = transacciones
    .filter((t) => t.tipo === "EGRESO")
    .reduce((acc, t) => acc + Math.abs(t.cantidad), 0);

  if (cargando) {
    return (
      <section className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-text-secondary">Cargando historial...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-red-600 font-medium">{error}</p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
          <History className="w-6 h-6 text-secondary" />
          Historial de Puntos
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Todos tus movimientos de puntos: ingresos por compras y egresos por
          canjes.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="bg-green-100 p-2.5 rounded-full">
            <ArrowUpCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-green-700 uppercase tracking-wider">
              Total Ingresado
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
              Total Gastado
            </p>
            <p className="text-2xl font-bold text-red-800">
              -{totalGastado.toLocaleString("es-AR")}{" "}
              <span className="text-sm font-normal">pts</span>
            </p>
          </div>
        </div>
      </div>

      {/* Lista de transacciones */}
      {transacciones.length === 0 ? (
        <div className="text-center py-16">
          <History className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500 font-medium">
            Todavía no tenés movimientos.
          </p>
          <p className="text-sm text-neutral-400 mt-1">
            Tus puntos asignados y canjes aparecerán acá.
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden"
          animate="show"
          key={paginaActual}
        >
          {transacciones.map((t) => {
            const esIngreso = t.tipo === "INGRESO";
            return (
              <motion.div
                key={t.id}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                }}
                className="flex items-center gap-4 bg-white border border-neutral-200/60 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                {/* Ícono */}
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

                {/* Info principal */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-800 truncate">
                    {t.concepto}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {formatearFecha(t.fecha)}
                  </p>
                </div>

                {/* Puntos y saldo */}
                <div className="text-right shrink-0">
                  <p
                    className={`font-bold text-lg ${
                      esIngreso ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {esIngreso ? "+" : ""}
                    {t.cantidad.toLocaleString("es-AR")} pts
                  </p>
                  <p className="text-xs text-neutral-400">
                    Saldo: {t.saldoNuevo.toLocaleString("es-AR")} pts
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Paginación */}
      {totalRegistros > REGISTROS_POR_PAGINA && (
        <div className="flex items-center justify-between pt-2 pb-4">
          <p className="text-sm text-neutral-400">
            Página {paginaActual} de {totalPaginas}{" "}
            <span className="hidden sm:inline">
              ({totalRegistros} movimientos)
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => cargarPagina(paginaActual - 1)}
              disabled={paginaActual <= 1 || cargando}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => cargarPagina(paginaActual + 1)}
              disabled={paginaActual >= totalPaginas || cargando}
              className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
