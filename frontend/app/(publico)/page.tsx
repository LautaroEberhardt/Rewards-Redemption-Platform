import React from "react";
import { auth } from "@/auth";
import { Boton } from "@/components/ui/boton";
import { BotonAgregarPremioFlotante } from "@/components/admin/premios/BotonAgregarPremioFlotante";
import { CatalogoPremiosEditableClient } from "@/components/admin/premios/CatalogoPremiosEditableClient";
import { CatalogoPremiosPublico } from "@/components/ui/CatalogoPremiosPublico";
import { listarPremios } from "@/servicios/premios.servicio";

export default async function PaginaInicio({
  searchParams,
}: {
  // En Next.js las Dynamic APIs pasan `searchParams` como Promesa
  searchParams?: Promise<{ edit?: string; crear?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  // Seguridad: solo admins pueden activar modo edición vía query string
  const sesion = await auth();
  const rol = (sesion?.user as { rol?: string } | undefined)?.rol;
  const esAdmin = rol === "ADMIN" || rol === "admin";
  const modoEdicion = esAdmin && sp.edit === "premios";
  const crearNuevo = modoEdicion && sp.crear === "1";

  // Intentamos traer premios reales desde el backend; si falla, usamos fallback estático
  let premiosReales: {
    id: number;
    nombre: string;
    descripcion: string;
    costoPuntos: number;
    imagenUrl?: string;
  }[] = [];
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
    premiosReales = [
      {
        id: 1,
        nombre: "Gift Card Amazon",
        descripcion: "Canjeable por cualquier producto en la tienda.",
        costoPuntos: 500,
      },
      {
        id: 2,
        nombre: "Auriculares Bluetooth",
        descripcion: "Sonido de alta fidelidad con cancelación de ruido.",
        costoPuntos: 1200,
      },
      {
        id: 3,
        nombre: "Cena para Dos",
        descripcion: "Experiencia gourmet en restaurantes seleccionados.",
        costoPuntos: 2500,
      },
      {
        id: 4,
        nombre: "Kit Merchandising",
        descripcion: "Camiseta, taza y stickers de la marca.",
        costoPuntos: 300,
      },
      {
        id: 5,
        nombre: "Día de Spa",
        descripcion: "Circuito completo de relajación y masaje.",
        costoPuntos: 5000,
      },
      {
        id: 6,
        nombre: "Entradas de Cine",
        descripcion: "Pack de 2 entradas + combo de palomitas.",
        costoPuntos: 450,
      },
    ];
  }

  // Los handlers se gestionan dentro del wrapper cliente

  return (
    <div className="flex flex-col w-full gap-y-0">
      {/* HERO */}
      <section
        id="inicio"
        className="w-full py-20 border-b border-neutral-200/60"
      >
        <div className="flex flex-col items-center max-w-3xl mx-auto text-center gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Sistema canje de puntos{" "}
            <span className="text-primary-hover">AyV</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            Acumula puntos en cada visita y canjealos por recompensas pensadas
            para vos.
          </p>
          <div className="flex gap-4 mt-4">
            <Boton variante="secundario">Cómo Funciona</Boton>
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
                Las recompensas favoritas de nuestros usuarios esta semana.
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
          ) : (
            <CatalogoPremiosPublico premios={premiosReales} />
          )}

          <div className="mt-12 text-center md:hidden">
            <Boton variante="secundario" className="w-full">
              Ver todo el catálogo
            </Boton>
          </div>
        </div>
      </section>
    </div>
  );
}
