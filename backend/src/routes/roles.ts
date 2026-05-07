import { FastifyInstance } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/Role";

export default async function roleRoutes(app: FastifyInstance) {
  const roleRepo = AppDataSource.getRepository(Role);

  // GET /api/roles
  app.get("/roles", async (req, reply) => {
    const roles = await roleRepo.find({ order: { id: "ASC" } });
    return reply.send(roles);
  });

  // POST /api/roles
  app.post<{ Body: { name: string; code: string; description?: string } }>(
    "/roles",
    async (req, reply) => {
      const { name, code, description } = req.body;
      const role = roleRepo.create({ name, code, description: description ?? null });
      const saved = await roleRepo.save(role);
      return reply.status(201).send(saved);
    }
  );
}
