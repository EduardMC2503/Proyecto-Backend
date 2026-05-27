import { z } from "zod";

export const driverParamsSchema = z.object({
  id: z.string().uuid("El ID del conductor debe ser un UUID valido"),
});

const driverBaseSchema = z.object({
  employeeCode: z.string().trim().min(1, "El codigo de empleado es obligatorio").max(10, "El codigo de empleado no puede superar 10 caracteres"),
  fullName: z.string().trim().min(1, "El nombre completo es obligatorio").max(80, "El nombre completo no puede superar 80 caracteres"),
  email: z.string().trim().email("El correo debe ser valido").max(80, "El correo no puede superar 80 caracteres"),
  phone: z.string().trim().min(1, "El telefono es obligatorio").max(10, "El telefono no puede superar 10 caracteres"),
  licenseNumber: z.string().trim().min(1, "El numero de licencia es obligatorio").max(15, "El numero de licencia no puede superar 15 caracteres"),
  licenseType: z.string().trim().min(1, "El tipo de licencia es obligatorio").max(15, "El tipo de licencia no puede superar 15 caracteres"),
  licenseExpiresAt: z.coerce.date(),
  status: z.string().trim().min(1, "El estado es obligatorio").max(20, "El estado no puede superar 20 caracteres"),
});

export const createDriverSchema = driverBaseSchema;

export const updateDriverSchema = driverBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Se requiere al menos un campo",
  },
);

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
