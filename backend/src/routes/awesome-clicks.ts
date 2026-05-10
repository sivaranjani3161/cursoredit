import { FastifyInstance } from "fastify";
import { AppDataSource } from "../config/data-source";
import { AwesomeClick } from "../entities/AwesomeClick";

export default async function awesomeClickRoutes(app: FastifyInstance) {
  const repo = AppDataSource.getRepository(AwesomeClick);

  app.get("/awesome-clicks", async (_req, reply) => {
    try {
      const rows = await repo.find({ order: { createdAt: "ASC", id: "ASC" } });
      return reply.send(rows);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch awesome clicks" });
    }
  });

  app.get<{ Params: { id: string } }>("/awesome-clicks/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const row = await repo.findOne({ where: { id } });
      if (!row) return reply.status(404).send({ error: "Awesome click not found" });
      return reply.send(row);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch awesome click" });
    }
  });

  app.post("/awesome-clicks", async (req, reply) => {
    try {
      const body = req.body as any;
      const imageUrl = String(body?.imageUrl ?? "").trim();
      if (!imageUrl) {
        return reply.status(400).send({ error: "imageUrl is required" });
      }
      const row = repo.create({
        imageUrl,
        altText: body?.altText ? String(body.altText) : null,
      });
      const saved = await repo.save(row);
      return reply.status(201).send(saved);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to create awesome click" });
    }
  });

  app.put<{ Params: { id: string } }>("/awesome-clicks/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const body = req.body as any;
      const row = await repo.findOne({ where: { id } });
      if (!row) return reply.status(404).send({ error: "Awesome click not found" });

      if (body?.imageUrl !== undefined) {
        const imageUrl = String(body.imageUrl ?? "").trim();
        if (!imageUrl) return reply.status(400).send({ error: "imageUrl is required" });
        row.imageUrl = imageUrl;
      }
      if (body?.altText !== undefined) row.altText = body.altText ? String(body.altText) : null;

      const updated = await repo.save(row);
      return reply.send(updated);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to update awesome click" });
    }
  });

  app.delete<{ Params: { id: string } }>("/awesome-clicks/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const row = await repo.findOne({ where: { id } });
      if (!row) return reply.status(404).send({ error: "Awesome click not found" });
      await repo.remove(row);
      return reply.send({ success: true });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to delete awesome click" });
    }
  });
}
