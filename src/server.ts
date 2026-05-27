import { app } from "./app";
import { env } from "./config/env";
import { connectPrisma, disconnectPrisma } from "./prisma/prisma.service";

const startServer = async () => {
  await connectPrisma();

  const server = app.listen(env.PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    await disconnectPrisma();
    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
  console.error("No se pudo iniciar el servidor", error);
  process.exit(1);
});
