import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Permission } from "../entities/Permission";
import { Role } from "../entities/Role";
import { validateUpdatePermissions } from "../validators";

// Supported modules and operations — single source of truth
export const MODULES = [
  "courses",
  "blogs",
  "gallery",
  "enquiries",
  "testimonials",
] as const;

export const OPERATIONS = [
  "create",
  "read",
  "update",
  "delete",
  "custom",
] as const;

export type PermissionModule = (typeof MODULES)[number];
export type PermissionOperation = (typeof OPERATIONS)[number];
export type PermCode = `${PermissionModule}:${PermissionOperation}`;

type PermissionsMap = Record<string, Record<string, boolean>>;

function buildPermMap(perms: Permission[]): PermissionsMap {
  const result: PermissionsMap = {};
  for (const mod of MODULES) {
    result[mod] = {};
    for (const op of OPERATIONS) {
      result[mod][op] = perms.some((p) => p.code === `${mod}:${op}`);
    }
  }
  return result;
}

const permRepo = () => AppDataSource.getRepository(Permission);
const roleRepo = () => AppDataSource.getRepository(Role);

export async function getPermissionsByRole(
  req: FastifyRequest<{ Querystring: { roleId: string } }>,
  reply: FastifyReply
): Promise<void> {
  const roleId = Number(req.query.roleId);
  if (Number.isNaN(roleId) || roleId <= 0) {
    reply.status(400).send({ error: "roleId is required and must be a positive integer" });
    return;
  }
  const perms = await permRepo().find({ where: { roleId } });
  reply.send(buildPermMap(perms));
}

export async function getAllPermissions(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const roles = await roleRepo().find({ relations: ["permissions"] });
  const result = roles.map((role) => ({
    roleId: role.id,
    roleCode: role.code,
    roleName: role.name,
    permissions: buildPermMap(role.permissions),
  }));
  reply.send(result);
}

export async function upsertPermissions(
  req: FastifyRequest<{
    Body: { roleId: number; permissions: PermissionsMap };
  }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const validation = validateUpdatePermissions(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors });
      return;
    }

    const roleId = Number(body.roleId);
    const permissions = body.permissions as PermissionsMap;

    const role = await roleRepo().findOne({ where: { id: roleId } });
    if (!role) { reply.status(404).send({ error: "Role not found" }); return; }

    await permRepo().delete({ roleId });

    const toInsert: Partial<Permission>[] = [];
    for (const mod of MODULES) {
      for (const op of OPERATIONS) {
        if (permissions?.[mod]?.[op]) {
          toInsert.push({
            roleId,
            code: `${mod}:${op}` as PermCode,
            name: `${mod} ${op}`,
            description: null,
          });
        }
      }
    }

    if (toInsert.length > 0) {
      await permRepo().save(permRepo().create(toInsert as Permission[]));
    }

    reply.send({ success: true, inserted: toInsert.length });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to update permissions" });
  }
}
