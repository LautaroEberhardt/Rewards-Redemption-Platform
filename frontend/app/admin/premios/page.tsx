import React from "react";
import { TarjetaPremio } from "@/components/ui/TarjetaModulo";
import { AccionesTarjetaAdmin } from "@/components/admin/premios/AccionesTarjetaAdmin";
import { listarPremios } from "@/servicios/premios.servicio";

export default async function PagePremios() {
  // Cargar desde API real
  const premios = await listarPremios().catch(() => []);

  return (
    <section className="space-y-6">
      {/* Header de la sección */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">
          Gestión de Premios
        </h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition">
          + Nuevo Premio
        </button>
      </div>

      {/* Grid reutilizando el diseño visual pero con lógica de Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premios.map((premio) => (
          <TarjetaPremio
            key={premio.id}
            id={premio.id}
            nombre={premio.nombre}
            descripcion={premio.descripcion ?? ""}
            costoPuntos={premio.costoPuntos}
            acciones={<AccionesTarjetaAdmin idPremio={premio.id} />}
          />
        ))}
      </div>
    </section>
  );
}
