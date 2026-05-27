import type { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";
import {
  createVehicleSchema,
  updateVehicleSchema,
  vehicleParamsSchema,
} from "./vehicle.validation";

export const vehicleController = {
  findAll: async (_req: Request, res: Response) => {
    const vehicles = await vehicleService.findAll();

    res.json({
      data: vehicles,
      message: "Vehicles retrieved successfully",
    });
  },

  findById: async (req: Request, res: Response) => {
    const { id } = vehicleParamsSchema.parse(req.params);
    const vehicle = await vehicleService.findById(id);

    res.json({
      data: vehicle,
      message: "Vehicle retrieved successfully",
    });
  },

  create: async (req: Request, res: Response) => {
    const data = createVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.create(data);

    res.status(201).json({
      data: vehicle,
      message: "Vehicle created successfully",
    });
  },

  update: async (req: Request, res: Response) => {
    const { id } = vehicleParamsSchema.parse(req.params);
    const data = updateVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.update(id, data);

    res.json({
      data: vehicle,
      message: "Vehicle updated successfully",
    });
  },

  delete: async (req: Request, res: Response) => {
    const { id } = vehicleParamsSchema.parse(req.params);
    const vehicle = await vehicleService.deactivate(id);

    res.json({
      data: vehicle,
      message: "Vehicle deactivated successfully",
    });
  },
};
