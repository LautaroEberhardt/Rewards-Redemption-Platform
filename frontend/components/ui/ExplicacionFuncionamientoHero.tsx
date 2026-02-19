 "use client";

import React, { useState } from "react";
import { Boton } from "@/components/ui/boton";
import { ModalExplicacionFuncionamiento } from "@/components/ui/ModalExplicacionFuncionamiento";

export const ExplicacionFuncionamientoHero: React.FC = () => {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <Boton
        variante="secundario"
        onClick={() => {
          setAbierto(true);
        }}
      >
        Cómo Funciona
      </Boton>
      <ModalExplicacionFuncionamiento
        abierto={abierto}
        alCerrar={() => setAbierto(false)}
      />
    </>
  );
};

