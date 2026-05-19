import { FastifyRequest, FastifyReply } from "fastify";
import { roleService } from "./role.service";
import { validateCreateRole } from "./role.validator";
import { RoleIdParam, CreateRoleBody, UpdateRoleBody } from "./role.interface";

export async function getAllRoles(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await roleService.findAll()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch roles" }); }
}

export async function createRole(req: FastifyRequest<{ Body: CreateRoleBody }>, reply: FastifyReply): Promise<void> {
  const body = req.body as unknown as Record<string, unknown>;
  const validation = validateCreateRole(body);
  if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
  try {
    const result = await roleService.create(body as unknown as CreateRoleBody);
    if ("conflict" in result) { reply.status(409).send({ error: "Role code already exists" }); return; }
    reply.status(201).send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to create role" }); }
}

export async function updateRole(req: FastifyRequest<{ Params: RoleIdParam; Body: UpdateRoleBody }>, reply: FastifyReply): Promise<void> {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) { reply.status(400).send({ error: "Invalid role id" }); return; }
  try {
    const result = await roleService.update(id, req.body as Partial<UpdateRoleBody>);
    if ("notFound"   in result) { reply.status(404).send({ error: "Role not found" }); return; }
    if ("forbidden"  in result) { reply.status(400).send({ error: result.forbidden }); return; }
    if ("badRequest" in result) { reply.status(400).send({ error: result.badRequest }); return; }
    if ("conflict"   in result) { reply.status(409).send({ error: "Role code already exists" }); return; }
    reply.send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to update role" }); }
}

export async function deleteRole(req: FastifyRequest<{ Params: RoleIdParam }>, reply: FastifyReply): Promise<void> {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) { reply.status(400).send({ error: "Invalid role id" }); return; }
  try {
    const result = await roleService.delete(id);
    if ("notFound"  in result) { reply.status(404).send({ error: "Role not found" }); return; }
    if ("forbidden" in result) { reply.status(400).send({ error: result.forbidden }); return; }
    reply.send({ success: true });
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to delete role" }); }
}
