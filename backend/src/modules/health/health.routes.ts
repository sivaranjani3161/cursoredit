import { FastifyInstance } from "fastify";

export default async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async (_req, reply) => {
    reply.send({ status: "ok", timestamp: new Date().toISOString() });
  });
}
