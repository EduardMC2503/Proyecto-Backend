import { z } from "zod";

export const driverParamsSchema = z.object({
  id: z.string().uuid("El ID del conductor debe ser un UUID valido"),
});

const driverBaseSchema = z.object({
  employeeCode: z.string().trim().min(1, "El codigo de empleado es obligatorio"),
  fullName: z.string().trim().min(1, "El nombre completo es obligatorio"),
  email: z.string().trim().email("El correo debe ser valido"),
  phone: z.string().trim().min(1, "El telefono es obligatorio"),
  licenseNumber: z.string().trim().min(1, "El numero de licencia es obligatorio"),
  licenseType: z.string().trim().min(1, "El tipo de licencia es obligatorio"),
  licenseExpiresAt: z.coerce.date(),
  status: z.string().trim().min(1, "El estado es obligatorio"),
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
