'use client';

import { ReactNode } from 'react';
import { FcGoogle } from 'react-icons/fc'; // Logo de Google con colores
import { FaFacebook, FaApple } from 'react-icons/fa'; // Logos monocolor

interface PropiedadesBotonSocial {
  proveedor: 'google' | 'facebook' | 'apple';
  onClick?: () => void;
}

export const BotonSocial = ({ proveedor, onClick }: PropiedadesBotonSocial) => {
  const configuracion = {
    google: {
      icono: <FcGoogle size={20} />,
      texto: 'Google',
      estilos: 'border-gray-200 hover:bg-gray-50 text-gray-700'
    },
    facebook: {
      icono: <FaFacebook size={20} className="text-blue-600" />,
      texto: 'Facebook',
      estilos: 'border-gray-200 hover:bg-gray-50 text-gray-700'
    },
    apple: {
      icono: <FaApple size={20} className="text-gray-900" />,
      texto: 'Apple',
      estilos: 'border-gray-200 hover:bg-gray-50 text-gray-700'
    }
  };

  const { icono, texto, estilos } = configuracion[proveedor];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 p-2.5 bg-white border rounded-lg transition-colors duration-200 ${estilos}`}
    >
      {icono}
      <span className="text-sm font-medium">Continuar con {texto}</span>
    </button>
  );
};