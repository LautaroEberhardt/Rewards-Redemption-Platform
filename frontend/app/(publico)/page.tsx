import React from 'react';
import { Boton } from '@/components/ui/boton';
import { TarjetaPremio } from '@/components/ui/TarjetaModulo';

export default function PaginaInicio() {
  
  // DATOS MOCK: Simulamos premios reales
  const premiosDestacados = [
    { id: 1, nombre: "Gift Card Amazon", costo: 500, desc: "Canjeable por cualquier producto en la tienda." },
    { id: 2, nombre: "Auriculares Bluetooth", costo: 1200, desc: "Sonido de alta fidelidad con cancelación de ruido." },
    { id: 3, nombre: "Cena para Dos", costo: 2500, desc: "Experiencia gourmet en restaurantes seleccionados." },
    { id: 4, nombre: "Kit Merchandising", costo: 300, desc: "Camiseta, taza y stickers de la marca." },
    { id: 5, nombre: "Día de Spa", costo: 5000, desc: "Circuito completo de relajación y masaje." },
    { id: 6, nombre: "Entradas de Cine", costo: 450, desc: "Pack de 2 entradas + combo de palomitas." },
  ];

  return (
    <div className="flex flex-col w-full gap-y-0">

      {/* --- HERO --- */}
      <section id="inicio" className="w-full py-20 border-b border-neutral-200/60">
        <div className="flex flex-col items-center max-w-3xl mx-auto text-center gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Sistema canje de puntos <span className="text-primary-hover">AyV</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            Acumula puntos en cada visita y canjealos por recompensas pensadas para vos.
          </p>
          <div className="flex gap-4 mt-4">
            <Boton variante="secundario">Cómo Funciona</Boton>
          </div>
        </div>
      </section>

      {/* --- CATÁLOGO DE PREMIOS --- */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {premiosDestacados.map((premio) => (
              <TarjetaPremio 
                key={premio.id}
                id={premio.id}
                nombre={premio.nombre}
                descripcion={premio.desc}
                costoPuntos={premio.costo}
                // onCanjear={() => logicaDeCanje(premio.id)}
              />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
             <Boton variante="secundario" className="w-full">Ver todo el catálogo</Boton>
          </div>

        </div>
      </section>
      
    </div>
  );
}