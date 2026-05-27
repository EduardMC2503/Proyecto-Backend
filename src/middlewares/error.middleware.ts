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

const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError || (error as Error).name === "ZodError";
};

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isZodError(error)) {
    res.status(400).json({
      message: "Error de validacion",
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
    message: "Error interno del servidor",
    error: "INTERNAL_SERVER_ERROR",
  });
};
