import { z } from "zod";

export const EsquemaLogin = z.object({
  correo: z.string().correo({ message: "Correo electrónico inválido" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

export const EsquemaRegistro = z
  .object({
    nombreCompleto: z
      .string()
      .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    correo: z
      .string()
      .correo({ message: "Por favor, introduce un correo válido" }),
    contrasena: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmarContrasena: z.string(),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"], // El error se mostrará en este campo
  });

export type FormularioLoginDatos = z.infer<typeof EsquemaLogin>;
export type FormularioRegistroDatos = z.infer<typeof EsquemaRegistro>;
