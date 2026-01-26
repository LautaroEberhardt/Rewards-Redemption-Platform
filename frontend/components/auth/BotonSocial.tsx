'use client';

import { signIn } from 'next-auth/react';
import { Boton } from '../ui/boton';
import { Chrome } from 'lucide-react';

interface BotonSocialProps {
  proveedor: 'google';
  onClick?: () => void;
}

export const BotonSocial = ({ proveedor, onClick }: BotonSocialProps) => {
  
  const manejarClick = () => {
    if (onClick) {
      onClick();
    } else {
      signIn(proveedor, {
        callbackUrl: '/dashboard',
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