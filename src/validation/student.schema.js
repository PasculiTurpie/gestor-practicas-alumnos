import { z } from "zod";

// Email simple
const email = z.string().email("Correo inválido");

export const studentSchema = z.object({
  fullName: z.string().min(3, "Nombre mínimo 3 caracteres"),
  rut: z.string().min(2, "RUT requerido"), // DV se valida con hook al enviar (o aquí con refine si prefieres)
  institutionalEmail: email,
  personalEmail: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  nrcCode: z.string().min(1, "NRC requerido"),
  phone: z.string().min(6, "Celular inválido"),
  practiceCenter: z.string().min(2, "Centro requerido"),
  observations: z.string().optional().or(z.literal("")),
});
