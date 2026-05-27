import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly error = "APP_ERROR",
  ) {
    super(message);
  }
}

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation error",
      error: "VALIDATION_ERROR",
      details: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      error: error.error,
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    message: "Internal server error",
    error: "INTERNAL_SERVER_ERROR",
  });
};
