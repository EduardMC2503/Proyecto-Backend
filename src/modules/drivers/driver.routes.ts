import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { driverController } from "./driver.controller";

export const driverRoutes = Router();

driverRoutes.get("/", asyncHandler(driverController.findAll));
driverRoutes.get("/:id", asyncHandler(driverController.findById));
driverRoutes.post("/", asyncHandler(driverController.create));
driverRoutes.put("/:id", asyncHandler(driverController.update));
driverRoutes.delete("/:id", asyncHandler(driverController.delete));
