import { Prisma } from "@prisma/client";
import { AppError } from "../../middlewares/error.middleware";
import { prisma } from "../../prisma/prisma.service";
import type { CreateVehicleInput, UpdateVehicleInput } from "./vehicle.validation";

const removeUndefinedValues = <T extends Record<string, unknown>>(data: T) => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
};

const handleVehiclePrismaError = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = Array.isArray(error.meta?.target) ? error.meta.target : [];

    if (target.includes("plate")) {
      throw new AppError(409, "La placa del vehiculo ya existe", "DUPLICATED_PLATE");
    }

    if (target.includes("code")) {
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
        data: removeUndefinedValues(data) as Prisma.VehicleCreateInput,
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
        data: removeUndefinedValues(data) as Prisma.VehicleUpdateInput,
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
      },
    });
  },
};
