import { FastifyInstance } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { Permission } from "../entities/Permission";

export default async function roleRoutes(app: FastifyInstance) {
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const permRepo = AppDataSource.getRepository(Permission);

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

  // PUT /api/roles/:id
  app.put<{ Params: { id: string }; Body: Record<string, unknown> }>(
    "/roles/:id",
    async (req, reply) => {
      try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
          return reply.status(400).send({ error: "Invalid role id" });
        }

        const body = req.body as { description?: string | null; name?: string; code?: string };

        const role = await roleRepo.findOne({ where: { id } });
        if (!role) {
          return reply.status(404).send({ error: "Role not found" });
        }

        if (role.code === "admin") {
          return reply.status(400).send({ error: "Admin role cannot be edited" });
        }

        if (body.name !== undefined || body.code !== undefined) {
          return reply.status(400).send({ error: "Role name and code cannot be changed" });
        }

        if (body.description !== undefined) role.description = body.description;

        const saved = await roleRepo.save(role);
        return reply.send(saved);
      } catch (error: any) {
        app.log.error(error);
        // MySQL duplicate key
        if (error?.code === "ER_DUP_ENTRY") {
          return reply.status(409).send({ error: "Role code already exists" });
        }
        return reply.status(500).send({ error: "Failed to update role" });
      }
    }
  );

  // DELETE /api/roles/:id
  app.delete<{ Params: { id: string } }>(
    "/roles/:id",
    async (req, reply) => {
      try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
          return reply.status(400).send({ error: "Invalid role id" });
        }

        const role = await roleRepo.findOne({ where: { id } });
        if (!role) {
          return reply.status(404).send({ error: "Role not found" });
        }

        if (role.code === "admin") {
          return reply.status(400).send({ error: "Admin role cannot be deleted" });
        }

        // Auto-reassign any users on this role to admin before deleting
        const adminRole = await roleRepo.findOne({ where: { code: "admin" } });
        if (adminRole) {
          await userRepo.update({ roleId: id }, { roleId: adminRole.id });
        }

        // Remove permissions first to avoid FK constraint failures.
        await permRepo.delete({ roleId: id });
        await roleRepo.delete(id);

        return reply.send({ success: true });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({ error: "Failed to delete role" });
      }
    }
  );
}
