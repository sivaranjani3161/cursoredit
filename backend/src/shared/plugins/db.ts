import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { AppDataSource } from "../../config/data-source";

const typeOrmPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      fastify.log.info("TypeORM connected to the database!");
    }

    fastify.decorate("db", AppDataSource);

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

declare module "fastify" {
  interface FastifyInstance {
    db: typeof AppDataSource;
  }
}
