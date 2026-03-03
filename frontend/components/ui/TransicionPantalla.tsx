"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/ui-context";

/**
 * Overlay de wipe izquierda→derecha que se activa al iniciar sesión.
 * Cubre la pantalla con el gradiente de la app, espera a que la ruta
 * cambie y luego se desliza hacia la derecha revelando la nueva página.
 */
export function TransicionPantalla() {
  const { transicionActiva } = useUI();

  return (
    <AnimatePresence>
      {transicionActiva && (
        <motion.div
          key="transicion-pantalla"
          className="fixed inset-0 z-9999"
          style={{
            background:
              "linear-gradient(90deg, #B2B5E0 0%, #8b5cf6 40%, #C5ADC5 70%, #B2B5E0 100%)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{
            duration: 0.48,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      )}
    </AnimatePresence>
  );
}
