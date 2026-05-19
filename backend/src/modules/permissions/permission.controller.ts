import { FastifyRequest, FastifyReply } from "fastify";
import { permissionService, PermissionsMap } from "./permission.service";
import { validateUpdatePermissions } from "./permission.validator";

export async function getPermissionsByRole(req: FastifyRequest<{ Querystring: { roleId: string } }>, reply: FastifyReply): Promise<void> {
  const roleId = Number(req.query.roleId);
  if (Number.isNaN(roleId) || roleId <= 0) {
    reply.status(400).send({ error: "roleId is required and must be a positive integer" }); return;
  }
  try { reply.send(await permissionService.getByRoleId(roleId)); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch permissions" }); }
}

export async function getAllPermissions(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await permissionService.getAll()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch permissions" }); }
}

export async function upsertPermissions(req: FastifyRequest<{ Body: { roleId: number; permissions: PermissionsMap } }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const validation = validateUpdatePermissions(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await permissionService.upsert(Number(body.roleId), body.permissions as PermissionsMap);
    if ("notFound" in result) { reply.status(404).send({ error: "Role not found" }); return; }
    reply.send({ success: true, inserted: result.inserted });
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to update permissions" }); }
}
