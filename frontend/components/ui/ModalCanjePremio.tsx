"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Gift, CheckCircle, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { canjearPremio } from "@/servicios/canjes.servicio";
import { Boton } from "@/components/ui/boton";

interface PropsPremioModal {
  id: number;
  nombre: string;
  descripcion: string;
  costoPuntos: number;
  imagenUrl?: string;
}

interface PropsModalCanje {
  premio: PropsPremioModal;
  abierto: boolean;
  onCerrar: () => void;
  onCanjeExitoso?: (codigoVerificacion: string) => void;
}

type EstadoCanje = "confirmacion" | "procesando" | "exito" | "error";

export function ModalCanjePremio({
  premio,
  abierto,
  onCerrar,
  onCanjeExitoso,
}: PropsModalCanje) {
  const { data: sesion } = useSession();
  const [estado, setEstado] = useState<EstadoCanje>("confirmacion");
  const [codigoVerificacion, setCodigoVerificacion] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const baseApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const srcImagen = premio.imagenUrl
    ? premio.imagenUrl.startsWith("http")
      ? premio.imagenUrl
      : `${baseApi}${premio.imagenUrl}`
    : undefined;

  const reiniciarEstado = () => {
    setEstado("confirmacion");
    setCodigoVerificacion("");
    setMensajeError("");
  };

  const cerrarModal = () => {
    reiniciarEstado();
    onCerrar();
  };

  const confirmarCanje = async () => {
    const token = sesion?.user?.accessToken;
    if (!token) {
      setMensajeError("No se pudo obtener tu sesión. Intentá de nuevo.");
      setEstado("error");
      return;
    }

    setEstado("procesando");

    try {
      const respuesta = await canjearPremio(premio.id, token);
      setCodigoVerificacion(respuesta.canje.codigoVerificacion);
      setEstado("exito");
      onCanjeExitoso?.(respuesta.canje.codigoVerificacion);
    } catch (err: unknown) {
      const mensaje =
        err instanceof Error ? err.message : "Error inesperado al canjear.";
      setMensajeError(mensaje);
      setEstado("error");
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={estado === "procesando" ? undefined : cerrarModal}
      />

      {/* Contenido del modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Botón cerrar */}
        {estado !== "procesando" && (
          <button
            onClick={cerrarModal}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        )}

        {/* ── ESTADO: Confirmación ── */}
        {estado === "confirmacion" && (
          <>
            {/* Imagen grande */}
            <div className="relative w-full h-64 sm:h-72 bg-background-secondary rounded-t-2xl overflow-hidden flex items-center justify-center">
              {srcImagen ? (
                <Image
                  src={srcImagen}
                  alt={premio.nombre}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center gap-3 opacity-50">
                  <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center">
                    <span className="text-4xl">🎁</span>
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">
                    Sin Imagen
                  </span>
                </div>
              )}

              {/* Badge de puntos */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="font-bold text-lg text-neutral-800">
                  {premio.costoPuntos} pts
                </span>
              </div>
            </div>

            {/* Info del premio */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                {premio.nombre}
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                {premio.descripcion}
              </p>

              {/* Acciones */}
              <div className="flex gap-3">
                <Boton
                  onClick={cerrarModal}
                  variante="sencillo"
                  className="flex-1 justify-center border border-neutral-200"
                >
                  Cancelar
                </Boton>
                <Boton
                  onClick={confirmarCanje}
                  variante="primario"
                  className="flex-1 justify-center"
                >
                  <span className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Confirmar Canje
                  </span>
                </Boton>
              </div>
            </div>
          </>
        )}

        {/* ── ESTADO: Procesando ── */}
        {estado === "procesando" && (
          <div className="p-12 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-lg font-medium text-neutral-700">
              Procesando tu canje...
            </p>
          </div>
        )}

        {/* ── ESTADO: Éxito ── */}
        {estado === "exito" && (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">
              ¡Canje exitoso!
            </h3>
            <p className="text-text-secondary">
              Mostrá este código al gerente para retirar tu premio:
            </p>
            <div className="bg-neutral-100 px-6 py-3 rounded-xl">
              <span className="text-3xl font-mono font-bold tracking-widest text-primary">
                {codigoVerificacion}
              </span>
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              Premio: <strong>{premio.nombre}</strong>
            </p>
            <Boton
              onClick={cerrarModal}
              variante="primario"
              className="mt-4 w-full justify-center"
            >
              Entendido
            </Boton>
          </div>
        )}

        {/* ── ESTADO: Error ── */}
        {estado === "error" && (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-9 h-9 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-800">
              No se pudo completar el canje
            </h3>
            <p className="text-text-secondary">{mensajeError}</p>
            <div className="flex gap-3 w-full mt-2">
              <Boton
                onClick={cerrarModal}
                variante="sencillo"
                className="flex-1 justify-center border border-neutral-200"
              >
                Cerrar
              </Boton>
              <Boton
                onClick={reiniciarEstado}
                variante="primario"
                className="flex-1 justify-center"
              >
                Reintentar
              </Boton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
