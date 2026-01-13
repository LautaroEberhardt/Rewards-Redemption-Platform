import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  /**
   * Opcional: Para deshabilitar el padding del contenedor principal si se necesita ancho completo
   */
  fullWidth?: boolean;
}

/**
 * MainLayout
 * Este componente actúa como el "archivo de configuración básica" para las pantallas.
 * Proporciona:
 * 1. Estructura Flexbox para Sticky Footer (Header arrba, Footer abajo, Contenido expandible).
 * 2. Responsive container por defecto.
 * 3. Habilita el scroll nativo.
 * 4. Fondo base y colores de texto definidos en variables CSS.
 */
export function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <Header />
      
      <main className={`flex-grow w-full ${!fullWidth ? 'container mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
