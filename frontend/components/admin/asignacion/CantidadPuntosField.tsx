"use client";

import React from "react";

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  presets?: number[];
  inputClassName?: string;
  buttonClassName?: string; // permite variar el hover entre vistas
}

export function CantidadPuntosField({
  label = "Cantidad de Puntos",
  value,
  onChange,
  presets = [10, 50, 100],
  inputClassName,
  buttonClassName,
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex gap-2 mb-2">
        {presets.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(String(n))}
            className={
              `px-3 py-1 text-xs rounded-md border border-gray-300 transition hover:bg-gray-50` +
              (buttonClassName ? ` ${buttonClassName}` : "")
            }
          >
            +{n}
          </button>
        ))}
      </div>
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          `w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-background-secondary focus:outline-none` +
          (inputClassName ? ` ${inputClassName}` : "")
        }
        placeholder="0"
        required
      />
    </div>
  );
}
