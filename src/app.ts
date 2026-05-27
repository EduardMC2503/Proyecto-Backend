import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { driverRoutes } from "./modules/drivers/driver.routes";
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
    message: "La API esta en ejecucion",
  });
});

app.use("/drivers", driverRoutes);
app.use("/vehicles", vehicleRoutes);

app.use(errorMiddleware);
