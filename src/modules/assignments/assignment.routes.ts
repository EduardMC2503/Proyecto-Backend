import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { assignmentController } from "./assignment.controller";

export const assignmentRoutes = Router();

assignmentRoutes.get("/", asyncHandler(assignmentController.findAll));
assignmentRoutes.get("/:id", asyncHandler(assignmentController.findById));
assignmentRoutes.post("/", asyncHandler(assignmentController.create));
assignmentRoutes.patch("/:id/finish", asyncHandler(assignmentController.finish));
