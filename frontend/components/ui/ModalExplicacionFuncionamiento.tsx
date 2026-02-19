import React from "react";
import { Boton } from "@/components/ui/boton";

export interface ModalExplicacionFuncionamientoProps {
  abierto: boolean;
  alCerrar: () => void;
}

export const ModalExplicacionFuncionamiento: React.FC<
  ModalExplicacionFuncionamientoProps
> = ({ abierto, alCerrar }) => {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in px-2 sm:px-0">
      <div
        className="relative max-w-lg rounded-2xl shadow-2xl bg-background border border-(--color-border-light) px-4 py-6 sm:px-8 sm:py-8 animate-fade-in-up"
        style={{
          boxShadow: "0 8px 32px 0 var(--color-shadow-xl)",
          maxWidth: "95vw",
        }}
      >
        <h3 className="text-2xl font-extrabold mb-4 text-text-primary tracking-tight text-center">
          ¿Cómo funciona el sistema?
        </h3>
        <div className="space-y-3 text-text-secondary text-base leading-relaxed mb-6 text-center">
          <p>
            Nuestro sistema de fidelización te permite acumular puntos cada vez
            que realizás una compra.
          </p>
          <p>
            Los puntos se suman automáticamente a tu cuenta y podés canjearlos
            por premios destacados desde el catálogo.
          </p>
          <p className="font-semibold text-bg-primary">
            ¡Cuantos más puntos juntes, mejores recompensas podrás obtener!
          </p>
        </div>
        <Boton
          className="w-full py-3 rounded-lg"
          variante="secundario"
          onClick={alCerrar}
        >
          Entendido
        </Boton>
      </div>
      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};
