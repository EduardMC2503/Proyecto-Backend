import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { vehicleController } from "./vehicle.controller";

export const vehicleRoutes = Router();

vehicleRoutes.get("/", asyncHandler(vehicleController.findAll));
vehicleRoutes.get("/:id", asyncHandler(vehicleController.findById));
vehicleRoutes.post("/", asyncHandler(vehicleController.create));
vehicleRoutes.put("/:id", asyncHandler(vehicleController.update));
vehicleRoutes.delete("/:id", asyncHandler(vehicleController.delete));
