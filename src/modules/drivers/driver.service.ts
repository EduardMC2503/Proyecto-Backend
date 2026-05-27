import { Prisma } from "@prisma/client";
import { AppError } from "../../middlewares/error.middleware";
import { prisma } from "../../prisma/prisma.service";
import type { CreateDriverInput, UpdateDriverInput } from "./driver.validation";

const removeUndefinedValues = <T extends Record<string, unknown>>(data: T) => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );
};

const handleDriverPrismaError = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = Array.isArray(error.meta?.target) ? error.meta.target : [];

    if (target.includes("licenseNumber")) {
      throw new AppError(
        409,
        "La licencia del conductor ya existe",
        "DUPLICATED_LICENSE",
      );
    }

    if (target.includes("employeeCode")) {
      throw new AppError(
        409,
        "El codigo de empleado del conductor ya existe",
        "DUPLICATED_EMPLOYEE_CODE",
      );
    }

    if (target.includes("email")) {
      throw new AppError(409, "El correo del conductor ya existe", "DUPLICATED_EMAIL");
    }
  }

  throw error;
};

export const driverService = {
  findAll: async () => {
    return prisma.driver.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById: async (id: string) => {
    const driver = await prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new AppError(404, "Conductor no encontrado", "DRIVER_NOT_FOUND");
    }

    return driver;
  },

  create: async (data: CreateDriverInput) => {
    try {
      return await prisma.driver.create({
        data: removeUndefinedValues(data) as Prisma.DriverCreateInput,
      });
    } catch (error) {
      handleDriverPrismaError(error);
    }
  },

  update: async (id: string, data: UpdateDriverInput) => {
    await driverService.findById(id);

    try {
      return await prisma.driver.update({
        where: { id },
        data: removeUndefinedValues(data) as Prisma.DriverUpdateInput,
      });
    } catch (error) {
      handleDriverPrismaError(error);
    }
  },

  deactivate: async (id: string) => {
    await driverService.findById(id);

    return prisma.driver.update({
      where: { id },
      data: {
        status: "INACTIVO",
      },
    });
  },
};
