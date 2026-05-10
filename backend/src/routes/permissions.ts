import { FastifyInstance } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Permission } from "../entities/Permission";
import { Role } from "../entities/Role";

// Supported modules and operations
export const MODULES = ["courses", "blogs", "gallery", "enquiries", "testimonials"] as const;
export const OPERATIONS = ["create", "read", "update", "delete", "custom"] as const;
export type PermCode = `${typeof MODULES[number]}:${typeof OPERATIONS[number]}`;

export default async function permissionRoutes(app: FastifyInstance) {
  const permRepo = AppDataSource.getRepository(Permission);
  const roleRepo = AppDataSource.getRepository(Role);

  // GET /api/permissions?roleId=1
  // Returns a structured CRUD map for a given role
  app.get<{ Querystring: { roleId: string } }>(
    "/permissions",
    async (req, reply) => {
      const roleId = Number(req.query.roleId);
      if (Number.isNaN(roleId)) {
        return reply.status(400).send({
          error: "roleId is required",
        });
      }
      const perms = await permRepo.find({ where: { roleId } });

      // Build structured map: { courses: { create: true, read: true, ... }, ... }
      const result: Record<string, Record<string, boolean>> = {};
      for (const mod of MODULES) {
        result[mod] = {};
        for (const op of OPERATIONS) {
          const code = `${mod}:${op}`;
          result[mod][op] = perms.some((p) => p.code === code);
        }
      }
      return reply.send(result);
    }
  );

  // PUT /api/permissions — bulk upsert permissions for a role
  // Body: { roleId: number, permissions: { [module]: { create, read, update, delete } } }
  
 app.put("/permissions", async (req, reply) => {
  try {
    const body = req.body as {
      roleId: number;
      permissions: Record<string, Record<string, boolean>>;
    };

    const roleId = Number(body.roleId);
    const permissions = body.permissions;

    if (isNaN(roleId)) {
      return reply.status(400).send({
        error: "roleId is required",
      });
    }

    const role = await roleRepo.findOne({
      where: { id: roleId },
    });

    if (!role) {
      return reply.status(400).send({
        error: "Role not found",
      });
    }

    await permRepo.delete({ roleId });

    const toInsert: Partial<Permission>[] = [];

    for (const mod of MODULES) {
      for (const op of OPERATIONS) {
        if (permissions?.[mod]?.[op]) {
          const code = `${mod}:${op}`;

          toInsert.push({
            roleId,
            code,
            name: `${mod} ${op}`,
            description: null,
          });
        }
      }
    }

    if (toInsert.length > 0) {
      await permRepo.save(
        permRepo.create(toInsert as Permission[])
      );
    }

    return reply.send({
      success: true,
      inserted: toInsert.length,
    });

  } catch (err) {
    console.error("PUT ERROR:", err);

    return reply.status(500).send({
      error: "Internal Server Error",
    });
  }
});
  // GET /api/permissions/all — get permissions grouped by role (for admin overview)
  app.get("/permissions/all", async (req, reply) => {
    const roles = await roleRepo.find({ relations: ["permissions"] });
    const result = roles.map((role) => {
      const map: Record<string, Record<string, boolean>> = {};
      for (const mod of MODULES) {
        map[mod] = {};
        for (const op of OPERATIONS) {
          map[mod][op] = role.permissions.some((p) => p.code === `${mod}:${op}`);
        }
      }
      return { roleId: role.id, roleCode: role.code, roleName: role.name, permissions: map };
    });
    return reply.send(result);
  });
}
