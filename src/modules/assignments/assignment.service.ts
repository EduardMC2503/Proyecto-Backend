import { AppError } from "../../middlewares/error.middleware";
import { prisma } from "../../prisma/prisma.service";
import type { CreateAssignmentInput } from "./assignment.validation";

const assignmentInclude = {
  vehicle: true,
  driver: true,
};

const isInactiveStatus = (status: string) => {
  return ["INACTIVE", "INACTIVO"].includes(status.toUpperCase());
};

export const assignmentService = {
  findAll: async () => {
    return prisma.vehicleDriverAssignment.findMany({
      include: assignmentInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById: async (id: string) => {
    const assignment = await prisma.vehicleDriverAssignment.findUnique({
      where: { id },
      include: assignmentInclude,
    });

    if (!assignment) {
      throw new AppError(404, "Asignacion no encontrada", "ASSIGNMENT_NOT_FOUND");
    }

    return assignment;
  },

  create: async (data: CreateAssignmentInput) => {
    const [vehicle, driver] = await Promise.all([
      prisma.vehicle.findUnique({
        where: { id: data.vehicleId },
      }),
      prisma.driver.findUnique({
        where: { id: data.driverId },
      }),
    ]);

    if (!vehicle) {
      throw new AppError(404, "Vehiculo no encontrado", "VEHICLE_NOT_FOUND");
    }

    if (!driver) {
      throw new AppError(404, "Conductor no encontrado", "DRIVER_NOT_FOUND");
    }

    if (!vehicle.active) {
      throw new AppError(
        400,
        "Un vehiculo inactivo no puede asignarse a un conductor",
        "INACTIVE_VEHICLE",
      );
    }

    if (isInactiveStatus(driver.status)) {
      throw new AppError(
        400,
        "Un conductor inactivo no puede asignarse a un vehiculo",
        "INACTIVE_DRIVER",
      );
    }

    if (driver.licenseExpiresAt <= new Date()) {
      throw new AppError(
        400,
        "Un conductor con licencia vencida no puede asignarse a un vehiculo",
        "EXPIRED_LICENSE",
      );
    }

    const [activeVehicleAssignment, activeDriverAssignment] = await Promise.all([
      prisma.vehicleDriverAssignment.findFirst({
        where: {
          vehicleId: data.vehicleId,
          active: true,
        },
      }),
      prisma.vehicleDriverAssignment.findFirst({
        where: {
          driverId: data.driverId,
          active: true,
        },
      }),
    ]);

    if (activeVehicleAssignment) {
      throw new AppError(
        409,
        "El vehiculo ya tiene un conductor asignado activamente",
        "ACTIVE_VEHICLE_ASSIGNMENT_EXISTS",
      );
    }

    if (activeDriverAssignment) {
      throw new AppError(
        409,
        "El conductor ya esta asignado activamente a un vehiculo",
        "ACTIVE_DRIVER_ASSIGNMENT_EXISTS",
      );
    }

    return prisma.$transaction(async (transaction) => {
      const assignment = await transaction.vehicleDriverAssignment.create({
        data: {
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          assignedAt: data.assignedAt ?? new Date(),
          active: true,
        },
        include: assignmentInclude,
      });

      await Promise.all([
        transaction.vehicle.update({
          where: { id: data.vehicleId },
          data: { status: "Asignado" },
        }),
        transaction.driver.update({
          where: { id: data.driverId },
          data: { status: "Asignado" },
        }),
      ]);

      return assignment;
    });
  },

  finish: async (id: string) => {
    const assignment = await assignmentService.findById(id);

    if (!assignment.active) {
      throw new AppError(
        400,
        "La asignacion ya se encuentra finalizada",
        "ASSIGNMENT_ALREADY_FINISHED",
      );
    }

    return prisma.$transaction(async (transaction) => {
      const finishedAssignment = await transaction.vehicleDriverAssignment.update({
        where: { id },
        data: {
          active: false,
          unassignedAt: new Date(),
        },
        include: assignmentInclude,
      });

      await Promise.all([
        transaction.vehicle.update({
          where: { id: assignment.vehicleId },
          data: { status: "Disponible" },
        }),
        transaction.driver.update({
          where: { id: assignment.driverId },
          data: { status: "Disponible" },
        }),
      ]);

      return finishedAssignment;
    });
  },
};
