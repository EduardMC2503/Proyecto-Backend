import { z } from "zod";

export const vehicleParamsSchema = z.object({
  id: z.string().uuid("El ID del vehiculo debe ser un UUID valido"),
});

const vehicleBaseSchema = z.object({
  code: z.string().trim().min(1, "El codigo operativo es obligatorio").max(10, "El codigo operativo no puede superar 10 caracteres"),
  plate: z.string().trim().min(1, "La placa es obligatoria").max(8, "La placa no puede superar 8 caracteres"),
  vin: z.string().trim().max(17, "El VIN no puede superar 17 caracteres").default(""),
  make: z.string().trim().min(1, "La marca es obligatoria").max(30, "La marca no puede superar 30 caracteres"),
  model: z.string().trim().min(1, "El modelo es obligatorio").max(30, "El modelo no puede superar 30 caracteres"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vehicleType: z.string().trim().min(1, "El tipo de vehiculo es obligatorio").max(20, "El tipo de vehiculo no puede superar 20 caracteres"),
  fuelType: z.string().trim().min(1, "El tipo de combustible es obligatorio").max(15, "El tipo de combustible no puede superar 15 caracteres"),
  tankCapacityLiters: z.number().positive().max(1000, "La capacidad del tanque no puede superar 1000 litros"),
  expectedEfficiencyKmL: z.number().positive().max(100, "La eficiencia esperada no puede superar 100 km/L"),
  status: z.string().trim().min(1, "El estado es obligatorio").max(20, "El estado no puede superar 20 caracteres"),
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
