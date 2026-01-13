import '@/app/globals.css';

export const metadata = {
  title: 'Sistema Uniformes',
  description: 'Aplicación de gestión de uniformes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
