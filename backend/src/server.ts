import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

import { buildApp } from "./app";

const start = async () => {
  try {
    const app = await buildApp();
    const port = parseInt(process.env.PORT || "3001");
    const host = process.env.HOST || "0.0.0.0";

    await app.listen({ port, host });
    
    app.log.info(`Server listening on http://${host}:${port}`);
    app.log.info(`Swagger documentation available at http://${host}:${port}/docs`);

    const signals = ["SIGINT", "SIGTERM"];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        app.log.info(`Received ${signal}, shutting down gracefully...`);
        await app.close();
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

start();
