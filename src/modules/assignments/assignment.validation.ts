import { z } from "zod";

export const assignmentParamsSchema = z.object({
  id: z.string().uuid("El ID de la asignacion debe ser un UUID valido"),
});

export const createAssignmentSchema = z.object({
  vehicleId: z.string().uuid("El ID del vehiculo debe ser un UUID valido"),
  driverId: z.string().uuid("El ID del conductor debe ser un UUID valido"),
  assignedAt: z.coerce.date().optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
