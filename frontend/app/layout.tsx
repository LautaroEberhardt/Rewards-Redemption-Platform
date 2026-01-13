import type { Metadata } from 'next';
import './colors.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema de Uniformes',
  description: 'Gestión de canjes y premios',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
