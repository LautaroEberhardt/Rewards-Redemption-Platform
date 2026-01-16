import React from 'react';
import { Boton } from '@/components/ui/boton';

export default function PaginaInicio() {
  return (
    <div className="flex flex-col w-full gap-y-0">

      <section className="w-full py-20 border-b border-neutral-200/60">
        <div className="flex flex-col items-center max-w-3xl mx-auto text-center gap-6">
          
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Bienvenido a <span className="text-[#C5ADC5]">Sistema Uniformes</span>
          </h1>
          
          <p className="text-lg text-text-secondary leading-relaxed">
            Gestiona la fidelización de tus empleados, asigna puntos y canjea premios 
            desde un panel centralizado y moderno.
          </p>

          <div className="flex gap-4 mt-4">
            <Boton variante="primario">Comenzar Ahora</Boton>
            <Boton variante="secundario">Ver Documentación</Boton>
          </div>

        </div>
      </section>

      <section className="w-full py-16 bg-white/40 backdrop-blur-sm">
 
        <div className="container mx-auto px-4"> 
          
          <div className="flex justify-between items-end mb-8">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-neutral-800">
                Resumen de Actividad
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Vista rápida de los módulos disponibles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {Array.from({ length: 6 }).map((_, i) => (
              <article 
                key={i} 
                // CLASE CLAVE: bg-background-secondary reemplaza al style inline.
                // Agregamos hover y transición para interactividad.
                className="group p-6 rounded-xl bg-background-secondary shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
              >
                {/* Icono decorativo (placeholder) */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-bold text-lg">#{i + 1}</span>
                </div>
                
                <h3 className="font-semibold text-lg text-neutral-800 mb-2">
                  Módulo de Gestión {i + 1}
                </h3>
                
                <p className="text-sm text-text-secondary">
                  Administra las reglas de puntos y asignaciones para este sector.
                </p>
              </article>
            ))}
          </div>

        </div>
      </section>
      
    </div>
  );
}