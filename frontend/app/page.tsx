import { MainLayout } from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido al Sistema de Gestión de Uniformes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Administra tus puntos, canjea premios y gestiona tus uniformes de manera fácil y rápida.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Tarjeta de Ejemplo 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
              {/* Icono placeholder */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Mi Perfil</h3>
            <p className="text-gray-500">Consulta tus datos personales y estado actual.</p>
          </div>

          {/* Tarjeta de Ejemplo 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Canjear Puntos</h3>
            <p className="text-gray-500">Descubre los premios disponibles y canjea tus puntos.</p>
          </div>

          {/* Tarjeta de Ejemplo 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Historial</h3>
            <p className="text-gray-500">Revisa tu historial de movimientos y canjes pasados.</p>
          </div>
        </div>
        
        {/* Sección de contenido largo para probar scroll */}
        <section className="mt-12 p-6 bg-neutral-50 rounded-lg">
           <h3 className="text-xl font-bold mb-4">Información Importante</h3>
           <p className="text-neutral-600 mb-4">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
             Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
           </p>
           <p className="text-neutral-600">
             Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
             Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
           </p>
        </section>
      </div>
    </MainLayout>
  );
}

