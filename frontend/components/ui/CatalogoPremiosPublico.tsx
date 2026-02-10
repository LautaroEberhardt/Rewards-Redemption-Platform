"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
  const { status } = useSession();
  const { abrirSidebar } = useUI();
  const { showInfo, showSuccess } = useToast();

  const [premioSeleccionado, setPremioSeleccionado] = useState<Premio | null>(
    null,
  );

  const manejarClickCanjear = (premio: Premio) => {
    if (status !== "authenticated") {
      showInfo("Debes iniciar sesión para canjear premios");
      abrirSidebar("registro");
      return;
    }
    // Usuario autenticado → abrir modal de canje
    setPremioSeleccionado(premio);
  };

  const manejarCanjeExitoso = (codigo: string) => {
    showSuccess(`¡Canje exitoso! Tu código: ${codigo}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {premios.map((premio) => (
          <div
            key={premio.id}
            onClick={() => manejarClickCanjear(premio)}
            className="cursor-pointer"
          >
            <TarjetaPremio
              id={premio.id}
              nombre={premio.nombre}
              descripcion={premio.descripcion}
              costoPuntos={premio.costoPuntos}
              imagenUrl={premio.imagenUrl}
              onCanjear={() => manejarClickCanjear(premio)}
            />
          </div>
        ))}
      </div>

      {/* Modal de canje para usuarios autenticados */}
      {premioSeleccionado && (
        <ModalCanjePremio
          premio={premioSeleccionado}
          abierto={!!premioSeleccionado}
          onCerrar={() => setPremioSeleccionado(null)}
          onCanjeExitoso={manejarCanjeExitoso}
        />
      )}
    </>
  );
}
