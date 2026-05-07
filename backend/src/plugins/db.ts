import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../config/data-source";

const typeOrmPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      fastify.log.info("TypeORM connected to the database!");
    }

    // Add it to fastify instance for convenience (optional, mostly use AppDataSource directly)
    fastify.decorate("db", AppDataSource);

    // Graceful shutdown
    fastify.addHook("onClose", async (instance) => {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        fastify.log.info("TypeORM connection closed.");
      }
    });
  } catch (error) {
    fastify.log.error("Failed to connect to the database");
    fastify.log.error(error);
    process.exit(1);
  }
};

export default fp(typeOrmPlugin);

// Extend FastifyInstance
declare module "fastify" {
  interface FastifyInstance {
    db: typeof AppDataSource;
  }
}
