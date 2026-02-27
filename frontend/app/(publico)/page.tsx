import React from "react";
import { auth } from "@/auth";
import { BotonAgregarPremioFlotante } from "@/components/admin/premios/BotonAgregarPremioFlotante";
import { CatalogoPremiosEditableClient } from "@/components/admin/premios/CatalogoPremiosEditableClient";
import { CatalogoPremiosPublico } from "@/components/ui/CatalogoPremiosPublico";
import { listarPremios } from "@/servicios/premios.servicio";
import { ExplicacionFuncionamientoHero } from "@/components/ui/ExplicacionFuncionamientoHero";
import { BurbujaWhatsappFlotante } from "@/components/ui/BurbujaWhatsappFlotante";

export default async function PaginaInicio({
  searchParams,
}: {
  searchParams?: Promise<{ edit?: string; crear?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const sesion = await auth();
  const rol = (sesion?.user as { rol?: string } | undefined)?.rol;
  const esAdmin = rol === "ADMIN" || rol === "admin";
  const modoEdicion = esAdmin && sp.edit === "premios";
  const crearNuevo = modoEdicion && sp.crear === "1";

  let premiosReales: {
    id: number;
    nombre: string;
    descripcion: string;
    costoPuntos: number;
    imagenUrl?: string;
  }[] = [];
  let errorCarga = false;
  try {
    const apiPremios = await listarPremios();
    premiosReales = apiPremios.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion ?? "",
      costoPuntos: p.costoPuntos,
      imagenUrl: p.imagenUrl,
    }));
  } catch {
    errorCarga = true;
  }

  return (
    <div className="flex flex-col w-full gap-y-0">
      {/* HERO */}
      <section
        id="inicio"
        className="w-full py-20 border-b border-neutral-200/60 px-1"
      >
        <div className="flex flex-col items-center max-w-3xl mx-auto text-center gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight flex items-center justify-center gap-3 flex-wrap">
            Sistema canje de puntos <span className=" font-serif text-background-secondary"> AyV Uniformes </span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            Acumula puntos en cada visita y canjealos por recompensas pensadas
            para vos.
          </p>

          <div className="flex gap-4 mt-4">
            <ExplicacionFuncionamientoHero />
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE PREMIOS */}
      <section id="catalogo-premios" className="w-full py-16 bg-neutral-50/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center mb-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-800">
                Premios Destacados
              </h2>
              <p className="text-text-secondary mt-6">
                Las recompensas de esta semana para nuestros usuarios.
              </p>
            </div>
          </div>

          {/* Botón flotante para crear en modo edición */}
          {modoEdicion && <BotonAgregarPremioFlotante />}

          {modoEdicion ? (
            <CatalogoPremiosEditableClient
              crearNuevo={crearNuevo}
              premios={premiosReales}
            />
          ) : errorCarga ? (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">
                No se pudieron cargar los premios en este momento.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Intentá de nuevo más tarde.
              </p>
            </div>
          ) : premiosReales.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">
                Aún no hay premios disponibles.
              </p>
            </div>
          ) : (
            <CatalogoPremiosPublico premios={premiosReales} />
          )}
        </div>
      </section>
      {/* Burbuja flotante de WhatsApp solo para usuarios públicos y clientes */}
      {!esAdmin && <BurbujaWhatsappFlotante />}
    </div>
  );
}
