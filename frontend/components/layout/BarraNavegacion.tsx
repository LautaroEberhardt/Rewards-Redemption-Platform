"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  House,
  Pen,
  ShoppingCart,
  LogIn,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  UserCircle,
  Star,
  History,
} from "lucide-react";
import { Boton } from "../ui/boton";
import { useUI } from "@/context/ui-context";
import { obtenerPerfilAction } from "@/actions/perfil";

export default function BarraNavegacion() {
  const { abrirSidebar } = useUI();
  const router = useRouter();
  const { data: sesion, status } = useSession();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  const estaCargando = status === "loading";
  const estaAutenticado = status === "authenticated";

  const esAdmin = sesion?.user?.rol?.toLowerCase() === "admin";
  const rutaDashboard = esAdmin ? "/admin/panel" : "/";

  const [puntos, setPuntos] = useState<number | null>(null);

  const cargarPuntos = useCallback(() => {
    if (!estaAutenticado || esAdmin) return;
    obtenerPerfilAction()
      .then((res) => {
        if (res.ok && res.usuario.puntos !== undefined) {
          setPuntos(res.usuario.puntos);
        }
      })
      .catch(() => {});
  }, [estaAutenticado, esAdmin]);

  useEffect(() => {
    cargarPuntos();
  }, [cargarPuntos]);

  // Refrescar puntos tras un canje exitoso
  useEffect(() => {
    const handler = () => cargarPuntos();
    window.addEventListener("puntos-actualizados", handler);
    return () => window.removeEventListener("puntos-actualizados", handler);
  }, [cargarPuntos]);

  // Refrescar puntos al volver a la pestaña
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") cargarPuntos();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [cargarPuntos]);

  const manejarNavegacion = (accion: () => void) => {
    setMenuAbierto(false);
    setMenuUsuarioAbierto(false);
    accion();
  };

  const cerrarSesionUsuario = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background-secondary text-shadow-violet-950/50 shadow-sm transition-all">
      <div className="container flex items-center justify-between py-4 relative">
        {/* 1. LOGO */}
        <Link href="/" className="z-50">
          <Image
            src="/images/logo-ayv.png"
            alt="AyV Logo"
            width={80}
            height={80}
            className="h-20 w-auto -my-4"
            priority
          />
        </Link>

        {/* 2. NAVEGACIÓN DESKTOP */}
        <nav
          className="hidden md:flex gap-6 items-center"
          aria-label="Navegación principal"
        >
          <Boton onClick={() => router.push("/#inicio")} variante="sencillo">
            <span className="flex items-center gap-2">
              <House className="w-4 h-4" />
              Inicio
            </span>
          </Boton>

          <Boton
            onClick={() => router.push("/#catalogo-premios")}
            variante="sencillo"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Productos
            </span>
          </Boton>

          {/* Ocultar botón de Registro si está autenticado */}
          {!estaAutenticado && !estaCargando && (
            <Boton onClick={() => abrirSidebar("registro")} variante="sencillo">
              <span className="flex items-center gap-2">
                <Pen className="w-4 h-4" />
                Regístrate
              </span>
            </Boton>
          )}
        </nav>

        {/* 3. ACCIONES DESKTOP (Login vs User Menu) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Badge de puntos para clientes */}
          {estaAutenticado && !esAdmin && puntos !== null && (
            <Link
              href="/cliente/perfil"
              className="flex items-center gap-1.5 px-3 py-3 rounded-full bg-background-secondary border border-gray-200 hover:bg-secondary/20 transition-colors"
              title="Tus puntos"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={puntos}
                  className="text-sm font-semibold text-secondary"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                >
                  {puntos.toLocaleString("es-AR")}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-text-primary">pts</span>
            </Link>
          )}

          {estaCargando ? (
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          ) : estaAutenticado ? (
            /* MENÚ DE USUARIO LOGUEADO */
            <div className="relative">
              <button
                onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
                className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="bg-primary/10 text-primary p-1.5 rounded-full">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-25 truncate">
                  {sesion?.user?.name || "Usuario"}
                </span>
              </button>

              {/* Dropdown del Usuario */}
              {menuUsuarioAbierto && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-gray-100 mb-2">
                    <p className="text-xs text-gray-500">
                      Sesión iniciada como
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {sesion?.user?.email}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      manejarNavegacion(() =>
                        router.push(
                          esAdmin ? rutaDashboard : "/cliente/perfil",
                        ),
                      )
                    }
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    {esAdmin ? (
                      <>
                        <LayoutDashboard className="w-4 h-4" />
                        Ir al Panel
                      </>
                    ) : (
                      <>
                        <UserCircle className="w-4 h-4" />
                        Mi Perfil
                      </>
                    )}
                  </button>

                  {/* Historial de puntos — solo clientes */}
                  {!esAdmin && (
                    <button
                      onClick={() =>
                        manejarNavegacion(() =>
                          router.push("/cliente/historial"),
                        )
                      }
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <History className="w-4 h-4" />
                      Historial de Puntos
                    </button>
                  )}

                  <button
                    onClick={cerrarSesionUsuario}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* BOTÓN INGRESAR (Si no está logueado) */
            <Boton onClick={() => abrirSidebar("login")} variante="primario">
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Ingresar
              </span>
            </Boton>
          )}
        </div>

        {/* 4. BOTÓN HAMBURGUESA MOVIL */}
        <div className="md:hidden flex items-center gap-3">
          {/* Badge de puntos móvil */}
          {estaAutenticado && !esAdmin && puntos !== null && (
            <Link
              href="/cliente/perfil"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-background-secondary border border-gray-200 transition-colors"
              title="Tus puntos"
            >
              <Star className="w-3 h-3  text-amber-400 fill-amber-400" />
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={puntos}
                  className="text-xs font-semibold text-secondary"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.25 }}
                >
                  {puntos.toLocaleString("es-AR")}
                </motion.span>
              </AnimatePresence>
              <span className="text-xs text-text-primary">pts</span>
            </Link>
          )}

          {estaAutenticado && (
            <div
              onClick={() =>
                router.push(esAdmin ? rutaDashboard : "/cliente/perfil")
              }
              className="bg-primary/10 text-primary p-2 rounded-full cursor-pointer"
            >
              <User className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-primary p-2 focus:outline-none"
            aria-label="Alternar menú"
          >
            {menuAbierto ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* 5. MENÚ MÓVIL DESPLEGABLE */}
      {menuAbierto && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background-secondary border-t border-gray-100 shadow-lg flex flex-col p-4 gap-4 animate-in slide-in-from-top-5 fade-in duration-200">
          <Boton
            onClick={() => manejarNavegacion(() => router.push("/#inicio"))}
            variante="sencillo"
            className="w-full justify-start"
          >
            <span className="flex items-center gap-2">
              <House className="w-4 h-4" /> Inicio
            </span>
          </Boton>

          <Boton
            onClick={() =>
              manejarNavegacion(() => router.push("/#catalogo-premios"))
            }
            variante="sencillo"
            className="w-full justify-start"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Productos
            </span>
          </Boton>

          <div className="border-t border-gray-200 my-2 pt-2">
            {estaAutenticado ? (
              <>
                <div className="px-2 py-2 mb-2">
                  <p className="text-sm font-semibold text-primary">
                    Hola, {sesion?.user?.name}
                  </p>
                </div>
                <Boton
                  onClick={() =>
                    manejarNavegacion(() =>
                      router.push(esAdmin ? rutaDashboard : "/cliente/perfil"),
                    )
                  }
                  variante="primario"
                  className="w-full justify-center mb-2"
                >
                  <span className="flex items-center gap-2">
                    {esAdmin ? (
                      <>
                        <LayoutDashboard className="w-4 h-4" /> Mi Panel
                      </>
                    ) : (
                      <>
                        <UserCircle className="w-4 h-4" /> Mi Perfil
                      </>
                    )}
                  </span>
                </Boton>
                {/* Historial de puntos — solo clientes (móvil) */}
                {!esAdmin && (
                  <Boton
                    onClick={() =>
                      manejarNavegacion(() => router.push("/cliente/historial"))
                    }
                    variante="sencillo"
                    className="w-full justify-center mb-2"
                  >
                    <span className="flex items-center gap-2">
                      <History className="w-4 h-4" /> Historial de Puntos
                    </span>
                  </Boton>
                )}
                <Boton
                  onClick={cerrarSesionUsuario}
                  variante="sencillo"
                  className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </span>
                </Boton>
              </>
            ) : (
              <>
                <Boton
                  onClick={() =>
                    manejarNavegacion(() => abrirSidebar("registro"))
                  }
                  variante="sencillo"
                  className="w-full justify-start mb-2"
                >
                  <span className="flex items-center gap-2">
                    <Pen className="w-4 h-4" /> Regístrate
                  </span>
                </Boton>
                <Boton
                  onClick={() => manejarNavegacion(() => abrirSidebar("login"))}
                  variante="primario"
                  className="w-full justify-center"
                >
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" /> Ingresar
                  </span>
                </Boton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
