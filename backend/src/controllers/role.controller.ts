import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { Permission } from "../entities/Permission";
import { CreateRoleBody, UpdateRoleBody, RoleIdParam } from "../interfaces/role.interface";
import { validateCreateRole } from "../validators";

const roleRepo = () => AppDataSource.getRepository(Role);
const userRepo = () => AppDataSource.getRepository(User);
const permRepo = () => AppDataSource.getRepository(Permission);

export async function getAllRoles(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const roles = await roleRepo().find({ order: { id: "ASC" } });
  reply.send(roles);
}

export async function createRole(
  req: FastifyRequest<{ Body: CreateRoleBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateRole(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }
    const role = roleRepo().create({
      name: String(body.name).trim(),
      code: String(body.code).trim(),
      description: body.description ? String(body.description) : null,
    });
    const saved = await roleRepo().save(role);
    reply.status(201).send(saved);
  } catch (err: unknown) {
    reply.log.error(err);
    if ((err as { code?: string })?.code === "ER_DUP_ENTRY")
      reply.status(409).send({ error: "Role code already exists" });
    else
      reply.status(500).send({ error: "Failed to create role" });
  }
}

export async function updateRole(
  req: FastifyRequest<{ Params: RoleIdParam; Body: UpdateRoleBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) { reply.status(400).send({ error: "Invalid role id" }); return; }

    const body = req.body as UpdateRoleBody;
    const role = await roleRepo().findOne({ where: { id } });
    if (!role) { reply.status(404).send({ error: "Role not found" }); return; }
    if (role.code === "admin") { reply.status(400).send({ error: "Admin role cannot be edited" }); return; }
    if (body.name !== undefined || body.code !== undefined)
      { reply.status(400).send({ error: "Role name and code cannot be changed" }); return; }

    if (body.description !== undefined) role.description = body.description as string | null;

    const saved = await roleRepo().save(role);
    reply.send(saved);
  } catch (err: unknown) {
    reply.log.error(err);
    if ((err as { code?: string })?.code === "ER_DUP_ENTRY")
      reply.status(409).send({ error: "Role code already exists" });
    else
      reply.status(500).send({ error: "Failed to update role" });
  }
}

export async function deleteRole(
  req: FastifyRequest<{ Params: RoleIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) { reply.status(400).send({ error: "Invalid role id" }); return; }

    const role = await roleRepo().findOne({ where: { id } });
    if (!role) { reply.status(404).send({ error: "Role not found" }); return; }
    if (role.code === "admin") { reply.status(400).send({ error: "Admin role cannot be deleted" }); return; }

    const adminRole = await roleRepo().findOne({ where: { code: "admin" } });
    if (adminRole) await userRepo().update({ roleId: id }, { roleId: adminRole.id });

    await permRepo().delete({ roleId: id });
    await roleRepo().delete(id);
    reply.send({ success: true });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to delete role" });
  }
}
