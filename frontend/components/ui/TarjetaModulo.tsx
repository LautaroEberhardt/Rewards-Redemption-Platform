import { ReactNode } from "react";

// Actualizamos la interfaz
interface PropsTarjetaPremio {
  id: number;
  nombre: string;
  descripcion: string;
  costoPuntos: number;
  imagenUrl?: string;
  onCanjear?: () => void;
  // NUEVO: Slot opcional para inyectar botones personalizados
  acciones?: ReactNode;
}

export const TarjetaPremio = ({
  id,
  nombre,
  descripcion,
  costoPuntos,
  imagenUrl,
  onCanjear,
  acciones, // Recibimos el slot
}: PropsTarjetaPremio) => {
  const baseApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const srcImagen = imagenUrl
    ? imagenUrl.startsWith("http")
      ? imagenUrl
      : `${baseApi}${imagenUrl}`
    : undefined;
  return (
    <article
      className="
        group relative flex flex-col h-full p-5 rounded-2xl bg-white
        border border-neutral-200/60 shadow-sm hover:shadow-xl
        shadow-primary-hover hover:-translate-y-3 hover:border-primary/20
        transition-all duration-300 overflow-hidden
      "
    >
      {/* 1. ÁREA DE IMAGEN (Sin cambios) */}
      <div className="relative w-full h-48 mb-5 rounded-xl bg-background-secondary flex items-center justify-center overflow-hidden transition-colors">
        {!srcImagen ? (
          <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-60 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center">
              <span className="text-2xl">🎁</span>
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Sin Imagen
            </span>
          </div>
        ) : (
          <img
            src={srcImagen}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        )}

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

        {/* 3. FOOTER DE ACCIÓN (DINÁMICO) */}
        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
          {acciones ? (
            // CASO A: Si mandamos acciones (Admin), renderizamos eso
            <div className="w-full">{acciones}</div>
          ) : (
            // CASO B: Comportamiento por defecto (Cliente)
            <>
              <span className="text-xs font-medium text-neutral-400">
                Stock disponible
              </span>
              <button
                onClick={onCanjear}
                className="text-sm font-semibold text-neutral-400 hover:text-primary-hover transition-colors"
              >
                Canjear →
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
