import { ReactNode } from 'react';
import { Boton } from '@/components/ui/boton'; // Reutilizamos tu botón existente

interface PropsTarjetaPremio {
  id: number;
  nombre: string;
  descripcion: string;
  costoPuntos: number; // Propiedad vital para el negocio
  imagenUrl?: string; 
  onCanjear?: () => void;
}

export const TarjetaPremio = ({
  id,
  nombre,
  descripcion,
  costoPuntos,
  imagenUrl,
  onCanjear,
}: PropsTarjetaPremio) => {
  return (
    <article
      className="
        group 
        relative 
        flex flex-col 
        h-full
        p-5
        rounded-2xl 
        bg-white
        border border-neutral-200/60
        shadow-sm 
        hover:shadow-xl 
        hover:-translate-y-1
        hover:border-primary/20
        transition-all 
        duration-300 
        overflow-hidden
      "
    >
      {/* 1. ÁREA DE IMAGEN (Placeholder por ahora) */}
      <div className="
        relative 
        w-full 
        h-48 
        mb-5 
        rounded-xl 
        bg-background-secondary
        flex items-center justify-center 
        overflow-hidden
        transition-colors
      ">
        {!imagenUrl ? (
          // Placeholder visual (Icono de regalo o caja)
          <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-60 transition-opacity">
             {/* Círculo decorativo */}
             <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center">
                <span className="text-2xl">🎁</span>
             </div>
             <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Sin Imagen</span>
          </div>
        ) : (
          // Aquí irá la etiqueta <Image /> de Next.js
          <div className="w-full h-full bg-gray-200" />
        )}

        {/* ETIQUETA DE PUNTOS (Flotante) */}
        <div className="absolute top-3 right-3 bg-neutral-300/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-bold text-text-primary text-sm">
            {costoPuntos} pts
          </span>
        </div>
      </div>

      {/* 2. CONTENIDO */}
      <div className="flex flex-col flex-1">
        <h3 className="font-bold text-xl text-neutral-800 mb-2 group-hover:text-primary-hover transition-colors">
          {nombre}
        </h3>

        <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-2">
          {descripcion}
        </p>

        {/* 3. FOOTER DE ACCIÓN */}
        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">
                Stock disponible
            </span>
            <button 
                onClick={onCanjear}
                className="text-sm font-semibold text-neutral-400 hover:text-primary-hover transition-colors"
            >
                Canjear →
            </button>
        </div>
      </div>
    </article>
  );
};