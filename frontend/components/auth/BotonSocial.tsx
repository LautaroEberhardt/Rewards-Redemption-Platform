"use client";

import { signIn } from "next-auth/react";
import { Boton } from "../ui/boton";
import { Chrome } from "lucide-react";
import { useUI } from "@/context/ui-context";

interface BotonSocialProps {
  proveedor: "google";
  onClick?: () => void;
}

export const BotonSocial = ({ proveedor, onClick }: BotonSocialProps) => {
  const { activarTransicion } = useUI();

  const manejarClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Wipe visual antes de redirigir a Google OAuth
      activarTransicion(() => {
        signIn(proveedor, {
          callbackUrl: "/",
        });
      });
    }
  };

  return (
    <Boton
      variante="secundario"
      className="w-full flex items-center justify-center gap-3"
      onClick={manejarClick}
    >
      <Chrome className="w-5 h-5" />
      <span className="text-sm font-medium">Continuar con Google</span>
    </Boton>
  );
};
