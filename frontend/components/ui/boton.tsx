import React from 'react';

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variante?: 'primario' | 'secundario' | 'peligro' | 'sencillo' | 'gris';
}

export const Boton = ({ children, className = '', variante = 'primario', ...props }: BotonProps) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantes = {
    primario: "bg-primary text-text-on-primary hover:bg-primary-hover focus:ring-primary",
    secundario: "bg-background-secondary text-text-primary hover:bg-primary-hover focus:ring-gray-500",
    peligro: "bg-error-light text-white hover:bg-red-600 focus:ring-red-500",
    sencillo: "bg-transparent text-text-primary hover:text-primary hover:underline px-2 py-1 rounded-md focus:ring-primary",
    gris: "bg-gray-200 text-text-primary hover:bg-gray-300 focus:ring-gray-400",
  };

  return (
    <button 
      className={`${baseStyles} ${variantes[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};