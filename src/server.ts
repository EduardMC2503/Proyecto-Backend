import { app } from "./app";
import { env } from "./config/env";
import { connectPrisma, disconnectPrisma } from "./prisma/prisma.service";

const startServer = async () => {
  await connectPrisma();

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
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
  console.error("Failed to start server", error);
  process.exit(1);
});
