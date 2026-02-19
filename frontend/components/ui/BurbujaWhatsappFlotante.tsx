"use client";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { ConfigNegocio } from "@/lib/constantes";

export interface BurbujaWhatsappFlotanteProps {
  mensajePersonalizado?: string;
}

export const BurbujaWhatsappFlotante: React.FC<
  BurbujaWhatsappFlotanteProps
> = ({ mensajePersonalizado }) => {
  const telefono = ConfigNegocio.TELEFONO_PEDIDOS;
  const mensaje =
    mensajePersonalizado ||
    "¡Hola! Quiero hacer una consulta sobre el sistema de puntos.";
  const enlace = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  return (
    <motion.a
      href={enlace}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg border-2 border-green-600 bg-background-secondary group"
      style={{ boxShadow: "0 4px 24px 0 rgba(37, 211, 102, 0.25)" }}
      whileHover={{ backgroundColor: "#25D366" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      animate={{ scale: [1, 1.13] }}
    >
      <FaWhatsapp className="w-8 h-8 md:w-10 md:h-10 text-white" />
      <span className="sr-only">WhatsApp</span>
    </motion.a>
  );
};
