import type { Request, Response } from "express";
import { driverService } from "./driver.service";
import {
  createDriverSchema,
  driverParamsSchema,
  updateDriverSchema,
} from "./driver.validation";

export const driverController = {
  findAll: async (_req: Request, res: Response) => {
    const drivers = await driverService.findAll();

    res.json({
      data: drivers,
      message: "Conductores obtenidos correctamente",
    });
  },

  findById: async (req: Request, res: Response) => {
    const { id } = driverParamsSchema.parse(req.params);
    const driver = await driverService.findById(id);

    res.json({
      data: driver,
      message: "Conductor obtenido correctamente",
    });
  },

  create: async (req: Request, res: Response) => {
    const data = createDriverSchema.parse(req.body);
    const driver = await driverService.create(data);

    res.status(201).json({
      data: driver,
      message: "Conductor creado correctamente",
    });
  },

  update: async (req: Request, res: Response) => {
    const { id } = driverParamsSchema.parse(req.params);
    const data = updateDriverSchema.parse(req.body);
    const driver = await driverService.update(id, data);

    res.json({
      data: driver,
      message: "Conductor actualizado correctamente",
    });
  },

  delete: async (req: Request, res: Response) => {
    const { id } = driverParamsSchema.parse(req.params);
    const hardDelete = req.query["hard"] === "true";
    const driver = hardDelete
      ? await driverService.delete(id)
      : await driverService.deactivate(id);

    res.json({
      data: driver,
      message: hardDelete
        ? "Conductor eliminado correctamente"
        : "Conductor desactivado correctamente",
    });
  },
};
