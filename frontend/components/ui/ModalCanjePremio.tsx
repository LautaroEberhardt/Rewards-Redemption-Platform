"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, Gift, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { canjearPremio } from "@/servicios/canjes.servicio";
import { generarEnlaceCanje } from "@/lib/whatsapp";
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
  onCanjeExitoso?: () => void;
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
  const [mensajeError, setMensajeError] = useState("");
  const [enlaceWhatsApp, setEnlaceWhatsApp] = useState<string | null>(null);

  const baseApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const srcImagen = premio.imagenUrl
    ? premio.imagenUrl.startsWith("http")
      ? premio.imagenUrl
      : `${baseApi}${premio.imagenUrl}`
    : undefined;

  const reiniciarEstado = () => {
    setEstado("confirmacion");
    setMensajeError("");
    setEnlaceWhatsApp(null);
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
      // Abrimos la ventana ANTES del await para evitar bloqueo de popup
      const ventana = window.open("about:blank", "_blank");

      const respuesta = await canjearPremio(premio.id, token);

      // Generar enlace de WhatsApp con el ID real de la transacción
      const nombreUsuario = sesion?.user?.name ?? "Cliente";
      const enlace = generarEnlaceCanje(
        nombreUsuario,
        premio.nombre,
        respuesta.canje.id,
      );
      setEnlaceWhatsApp(enlace);

      // Redirigir a WhatsApp
      if (ventana) {
        ventana.location.href = enlace;
      } else {
        // Fallback si el popup fue bloqueado: se muestra el botón en la pantalla de éxito
      }

      setEstado("exito");
      onCanjeExitoso?.();
      // Notificar a la navbar para refrescar puntos
      window.dispatchEvent(new Event("puntos-actualizados"));
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
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={estado === "procesando" ? undefined : cerrarModal}
      />

      {/* Contenido del modal */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
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
              ¡Canje solicitado!
            </h3>
            <p className="text-text-secondary">
              Tu solicitud fue registrada correctamente.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 text-left">
                Tu premio queda <strong>pendiente de entrega</strong>. El
                administrador lo marcará como completado cuando lo retires.
              </p>
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              Premio: <strong>{premio.nombre}</strong> — {premio.costoPuntos}{" "}
              pts
            </p>

            {/* Botón de WhatsApp (respaldo si el popup fue bloqueado) */}
            {enlaceWhatsApp && (
              <a
                href={enlaceWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.3 0-4.438-.763-6.152-2.05l-.43-.326-2.655.89.89-2.655-.326-.43A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Enviar por WhatsApp
              </a>
            )}

            <Boton
              onClick={cerrarModal}
              variante="sencillo"
              className="mt-2 w-full justify-center border border-neutral-200"
            >
              Cerrar
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
      </motion.div>
    </div>
  );
}
