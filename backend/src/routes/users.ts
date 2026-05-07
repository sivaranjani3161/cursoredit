import { FastifyInstance } from "fastify";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { UserStatus } from "../entities/enums/UserStatus";

export default async function userRoutes(app: FastifyInstance) {
  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository(Role);

  // GET /api/users — list all users with role
  app.get("/users", async (req, reply) => {
    const users = await userRepo.find({
      relations: ["role"],
      order: { createdAt: "DESC" },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        authProvider: true,
        roleId: true,
        createdAt: true,
        role: { id: true, name: true, code: true },
      },
    });
    return reply.send(users);
  });

  // GET /api/users/by-email/:email — used by NextAuth to look up user role
  app.get<{ Params: { email: string } }>(
    "/users/by-email/:email",
    async (req, reply) => {
      const { email } = req.params;
      const user = await userRepo.findOne({
        where: { email },
        relations: ["role", "role.permissions"],
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          roleId: true,
          role: {
            id: true,
            name: true,
            code: true,
            permissions: { id: true, code: true, name: true },
          },
        },
      });
      if (!user) return reply.status(404).send({ error: "User not found" });
      return reply.send(user);
    }
  );

  // POST /api/users — create user (admin-invited)
  app.post<{ Body: { email: string; name: string; roleId: number } }>(
    "/users",
    async (req, reply) => {
      const { email, name, roleId } = req.body;

      const role = await roleRepo.findOne({ where: { id: roleId } });
      if (!role) return reply.status(400).send({ error: "Role not found" });

      const existing = await userRepo.findOne({ where: { email } });
      if (existing) return reply.status(409).send({ error: "User already exists" });

      const user = userRepo.create({
        email,
        name,
        roleId,
        status: UserStatus.ACTIVE,
        authProvider: "google",
        password: null,
        oauthId: null,
        inviteToken: null,
        inviteExpiresAt: null,
      });
      const saved = await userRepo.save(user);
      return reply.status(201).send({ ...saved, role });
    }
  );

  // PUT /api/users/:id — update user role
  app.put<{ Params: { id: string }; Body: { roleId: number } }>(
    "/users/:id",
    async (req, reply) => {
      const { id } = req.params;
      const { roleId } = req.body;
      const user = await userRepo.findOne({ where: { id: Number(id) } });
      if (!user) return reply.status(404).send({ error: "User not found" });
      user.roleId = roleId;
      const saved = await userRepo.save(user);
      return reply.send(saved);
    }
  );

  // DELETE /api/users/:id
  app.delete<{ Params: { id: string } }>(
    "/users/:id",
    async (req, reply) => {
      const { id } = req.params;
      try {
        app.log.info(`Attempting to delete user with ID: ${id}`);
        const result = await userRepo.delete(Number(id));
        if (result.affected === 0) {
          app.log.warn(`User with ID ${id} not found for deletion`);
          return reply.status(404).send({ error: "User not found" });
        }
        app.log.info(`Successfully deleted user with ID: ${id}`);
        return reply.status(204).send();
      } catch (error: any) {
        app.log.error(`Failed to delete user with ID ${id}: ${error.message}`);
        return reply.status(500).send({ error: "Failed to delete user", details: error.message });
      }
    }
  );
}
