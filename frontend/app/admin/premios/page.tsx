import React from 'react';
import { TarjetaPremio } from "@/components/ui/TarjetaModulo";
import { AccionesTarjetaAdmin } from "@/components/admin/premios/AccionesTarjetaAdmin";
// import { obtenerPremios } from "@/servicios/premios.servicio"; // Descomentar cuando tengas el servicio

export default async function PagePremios() {
  
  // TODO: Reemplazar esto con la llamada real a tu base de datos: 
  // const premios = await obtenerPremios();
  
  const premiosMock = [
    { id: 1, nombre: "Gift Card Amazon", costoEnPuntos: 500, descripcion: "Canjeable en tienda.", stockDisponible: 10 },
    { id: 2, nombre: "Auriculares", costoEnPuntos: 1200, descripcion: "Sonido HD.", stockDisponible: 5 },
  ];

  return (
    <section className="space-y-6">
      
      {/* Header de la sección */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">Gestión de Premios</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition">
          + Nuevo Premio
        </button>
      </div>

      {/* Grid reutilizando el diseño visual pero con lógica de Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {premiosMock.map((premio) => (
          <TarjetaPremio
            key={premio.id}
            id={premio.id}
            nombre={premio.nombre}
            descripcion={premio.descripcion}
            costoPuntos={premio.costoEnPuntos}
            // AQUÍ OCURRE LA MAGIA: Inyectamos los botones de Admin
            acciones={<AccionesTarjetaAdmin idPremio={premio.id} />}
          />
        ))}
      </div>
    </section>
  );
}