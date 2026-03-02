import React from "react";

export default function PantallaDeCarga() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-solid border-primary-hover border-t-transparent shadow-md"></div>
      <p className="text-lg font-medium text-text-secondary animate-pulse">
        Cargando...
      </p>
    </div>
  );
}
