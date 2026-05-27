import { z } from "zod";

export const vehicleParamsSchema = z.object({
  id: z.string().uuid("El ID del vehiculo debe ser un UUID valido"),
});

const vehicleBaseSchema = z.object({
  code: z.string().trim().min(1, "El codigo operativo es obligatorio"),
  plate: z.string().trim().min(1, "La placa es obligatoria"),
  vin: z.string().trim().min(1, "El VIN es obligatorio"),
  make: z.string().trim().min(1, "La marca es obligatoria"),
  model: z.string().trim().min(1, "El modelo es obligatorio"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vehicleType: z.string().trim().min(1, "El tipo de vehiculo es obligatorio"),
  fuelType: z.string().trim().min(1, "El tipo de combustible es obligatorio"),
  tankCapacityLiters: z.number().positive(),
  expectedEfficiencyKmL: z.number().positive(),
  status: z.string().trim().min(1, "El estado es obligatorio"),
  active: z.boolean().optional(),
});

export const createVehicleSchema = vehicleBaseSchema;

export const updateVehicleSchema = vehicleBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Se requiere al menos un campo",
  },
);

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
