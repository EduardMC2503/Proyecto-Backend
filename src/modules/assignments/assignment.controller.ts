import type { Request, Response } from "express";
import { assignmentService } from "./assignment.service";
import {
  assignmentParamsSchema,
  createAssignmentSchema,
} from "./assignment.validation";

export const assignmentController = {
  findAll: async (_req: Request, res: Response) => {
    const assignments = await assignmentService.findAll();

    res.json({
      data: assignments,
      message: "Asignaciones obtenidas correctamente",
    });
  },

  findById: async (req: Request, res: Response) => {
    const { id } = assignmentParamsSchema.parse(req.params);
    const assignment = await assignmentService.findById(id);

    res.json({
      data: assignment,
      message: "Asignacion obtenida correctamente",
    });
  },

  create: async (req: Request, res: Response) => {
    const data = createAssignmentSchema.parse(req.body);
    const assignment = await assignmentService.create(data);

    res.status(201).json({
      data: assignment,
      message: "Asignacion creada correctamente",
    });
  },

  finish: async (req: Request, res: Response) => {
    const { id } = assignmentParamsSchema.parse(req.params);
    const assignment = await assignmentService.finish(id);

    res.json({
      data: assignment,
      message: "Asignacion finalizada correctamente",
    });
  },
};
