import React from 'react';

interface PropsFondo {
  children: React.ReactNode;
  claseExtra?: string;
}

export const FondoDegradado = ({ children, claseExtra = '' }: PropsFondo) => {
  
  const estilo: React.CSSProperties = {

    backgroundImage: 'linear-gradient(135deg, var(--color-neutral-50) 0%, var(--color-neutral-200) 100%)',
    
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
      className={`min-h-screen w-full flex flex-col ${claseExtra}`}
      style={estilo}
    >
      {children}
    </div>
  );
};