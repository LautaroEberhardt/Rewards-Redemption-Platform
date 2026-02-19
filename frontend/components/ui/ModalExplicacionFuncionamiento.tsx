import React from "react";

export interface ModalExplicacionFuncionamientoProps {
  abierto: boolean;
  alCerrar: () => void;
}

export const ModalExplicacionFuncionamiento: React.FC<
  ModalExplicacionFuncionamientoProps
> = ({ abierto, alCerrar }) => {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 text-2xl font-bold focus:outline-none"
          aria-label="Cerrar"
          onClick={alCerrar}
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-neutral-800">
          ¿Cómo funciona el sistema?
        </h3>
        <p className="text-neutral-700 mb-2">
          Nuestro sistema de fidelización te permite acumular puntos cada vez
          que realizás una compra.
        </p>
        <p className="text-neutral-700 mb-2">
          Los puntos se suman automáticamente a tu cuenta y podés canjearlos por
          premios destacados desde el catálogo.
        </p>
        <p className="text-neutral-700 mb-4">
          ¡Cuantos más puntos juntes, mejores recompensas podrás obtener!
        </p>
        <button
          className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          onClick={alCerrar}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
