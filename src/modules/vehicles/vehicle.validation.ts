import { z } from "zod";

export const vehicleParamsSchema = z.object({
  id: z.string().uuid("Vehicle ID must be a valid UUID"),
});

const vehicleBaseSchema = z.object({
  code: z.string().trim().min(1, "Code is required"),
  plate: z.string().trim().min(1, "Plate is required"),
  vin: z.string().trim().min(1, "VIN is required"),
  make: z.string().trim().min(1, "Make is required"),
  model: z.string().trim().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  vehicleType: z.string().trim().min(1, "Vehicle type is required"),
  fuelType: z.string().trim().min(1, "Fuel type is required"),
  tankCapacityLiters: z.number().positive(),
  expectedEfficiencyKmL: z.number().positive(),
  status: z.string().trim().min(1, "Status is required"),
  active: z.boolean().optional(),
});

export const createVehicleSchema = vehicleBaseSchema;

export const updateVehicleSchema = vehicleBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field is required",
  },
);

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
