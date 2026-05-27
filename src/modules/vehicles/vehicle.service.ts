import { Prisma } from "@prisma/client";
import { AppError } from "../../middlewares/error.middleware";
import { prisma } from "../../prisma/prisma.service";
import type { CreateVehicleInput, UpdateVehicleInput } from "./vehicle.validation";

const removeUndefinedValues = <T extends Record<string, unknown>>(data: T) => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
};

const normalizeVehicleStatus = <
  T extends { status?: string | undefined; active?: boolean | undefined },
>(
  data: T,
) => {
  if (!data.status) {
    return data;
  }

  const isInactive = data.status.toLowerCase() === "inactivo";

  return {
    ...data,
    active: !isInactive,
  };
};

const handleVehiclePrismaError = (error: unknown): never => {
  const prismaError = error as {
    code?: string;
    meta?: {
      target?: unknown;
      driverAdapterError?: {
        cause?: {
          originalMessage?: string;
        };
      };
    };
  };

  if (prismaError.code === "P2002") {
    const target = Array.isArray(prismaError.meta?.target)
      ? prismaError.meta.target
      : [];
    const originalMessage =
      prismaError.meta?.driverAdapterError?.cause?.originalMessage ?? "";

    if (target.includes("plate") || originalMessage.includes("Vehicle_plate_key")) {
      throw new AppError(409, "La placa del vehiculo ya existe", "DUPLICATED_PLATE");
    }

    if (target.includes("code") || originalMessage.includes("Vehicle_code_key")) {
      throw new AppError(409, "El codigo del vehiculo ya existe", "DUPLICATED_CODE");
    }
  }

  throw error;
};

export const vehicleService = {
  findAll: async () => {
    return prisma.vehicle.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById: async (id: string) => {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new AppError(404, "Vehiculo no encontrado", "VEHICLE_NOT_FOUND");
    }

    return vehicle;
  },

  create: async (data: CreateVehicleInput) => {
    try {
      return await prisma.vehicle.create({
        data: removeUndefinedValues(
          normalizeVehicleStatus(data),
        ) as Prisma.VehicleCreateInput,
      });
    } catch (error) {
      handleVehiclePrismaError(error);
    }
  },

  update: async (id: string, data: UpdateVehicleInput) => {
    await vehicleService.findById(id);

    try {
      return await prisma.vehicle.update({
        where: { id },
        data: removeUndefinedValues(
          normalizeVehicleStatus(data),
        ) as Prisma.VehicleUpdateInput,
      });
    } catch (error) {
      handleVehiclePrismaError(error);
    }
  },

  deactivate: async (id: string) => {
    await vehicleService.findById(id);

    return prisma.vehicle.update({
      where: { id },
      data: {
        active: false,
        status: "Inactivo",
      },
    });
  },

  delete: async (id: string) => {
    await vehicleService.findById(id);

    const assignmentCount = await prisma.vehicleDriverAssignment.count({
      where: { vehicleId: id },
    });

    if (assignmentCount > 0) {
      throw new AppError(
        409,
        "No se puede eliminar el vehiculo porque tiene historial de asignaciones. Puedes desactivarlo.",
        "VEHICLE_HAS_ASSIGNMENTS",
      );
    }

    return prisma.vehicle.delete({
      where: { id },
    });
  },
};
