import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    data: {
      status: "ok",
      environment: env.NODE_ENV,
    },
    message: "API is running",
  });
});

app.use("/vehicles", vehicleRoutes);

app.use(errorMiddleware);
