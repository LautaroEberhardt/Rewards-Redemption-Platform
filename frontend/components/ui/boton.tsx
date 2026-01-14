import React from 'react';

interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variante?: 'primario' | 'secundario' | 'peligro';
}

export const Boton = ({ children, className = '', variante = 'primario', ...props }: BotonProps) => {
  // Definimos los estilos base y las variantes usando clases de Tailwind
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantes = {
    primario: "bg-primary text-text-on-primary hover:bg-primary-hover focus:ring-primary",
    secundario: "bg-background-secondary text-text-primary hover:bg-background-tertiary focus:ring-gray-500",
    peligro: "bg-state-error text-white hover:bg-red-600 focus:ring-red-500"
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