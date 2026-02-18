"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/ui-context";
import { useToast } from "@/components/ui/toast";
import { TarjetaPremio } from "@/components/ui/TarjetaModulo";
import { ModalCanjePremio } from "@/components/ui/ModalCanjePremio";

interface Premio {
  id: number;
  nombre: string;
  descripcion: string;
  costoPuntos: number;
  imagenUrl?: string;
}

export function CatalogoPremiosPublico({ premios }: { premios: Premio[] }) {
  const { data: sesion, status } = useSession();
  const { abrirSidebar } = useUI();
  const { showInfo, showSuccess } = useToast();

  const esAdmin = sesion?.user?.rol?.toUpperCase() === "ADMIN";

  const [premioSeleccionado, setPremioSeleccionado] = useState<Premio | null>(
    null,
  );

  const manejarClickCanjear = (premio: Premio) => {
    if (esAdmin) return;
    if (status !== "authenticated") {
      showInfo("Debes iniciar sesión para canjear premios");
      abrirSidebar("registro");
      return;
    }
    // Usuario cliente autenticado → abrir modal de canje
    setPremioSeleccionado(premio);
  };

  const manejarCanjeExitoso = () => {
    showSuccess("¡Canje solicitado! Queda pendiente de entrega.");
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="show"
      >
        {premios.map((premio) => (
          <motion.div
            key={premio.id}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              },
            }}
            onClick={() => manejarClickCanjear(premio)}
            className={esAdmin ? "" : "cursor-pointer"}
          >
            <TarjetaPremio
              id={premio.id}
              nombre={premio.nombre}
              descripcion={premio.descripcion}
              costoPuntos={premio.costoPuntos}
              imagenUrl={premio.imagenUrl}
              ocultarCanje={esAdmin}
              onCanjear={() => manejarClickCanjear(premio)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Modal de canje para usuarios autenticados */}
      <AnimatePresence>
        {premioSeleccionado && (
          <ModalCanjePremio
            premio={premioSeleccionado}
            abierto={!!premioSeleccionado}
            onCerrar={() => setPremioSeleccionado(null)}
            onCanjeExitoso={manejarCanjeExitoso}
          />
        )}
      </AnimatePresence>
    </>
  );
}
