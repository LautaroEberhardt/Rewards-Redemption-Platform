
import React from 'react';

interface PropsFondoDegradado {
  children: React.ReactNode;
  /**
   * Tipo de degradado:
   * - 'sutil': Para fondos de página completos (Gris a Blanco).
   * - 'marca': Para destacar (Azul a Violeta).
   */
  variante?: 'sutil' | 'marca';
  claseExtra?: string;
}

export const FondoDegradado = ({ 
  children, 
  variante = 'sutil', 
  claseExtra = '' 
}: PropsFondoDegradado) => {
  
  // Definimos los estilos usando tus variables de colors.css
  // Tailwind v4 permite usar clases directas que mapean a tus variables
  const variantes = {
    // Un degradado casi imperceptible, muy elegante para SaaS
    sutil: "bg-gradient-to-br from-neutral-50 to-neutral-200", 
    
    // Tus colores corporativos (Azul -> Violeta)
    marca: "bg-gradient-to-r from-primary/10 to-secondary/10"
  };

  return (
    <div className={`min-h-screen w-full ${variantes[variante]} ${claseExtra}`}>
      {children}
    </div>
  );
};