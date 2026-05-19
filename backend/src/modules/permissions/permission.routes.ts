import { FastifyInstance } from "fastify";
import { getPermissionsByRole, getAllPermissions, upsertPermissions } from "./permission.controller";
import { PermissionsMap } from "./permission.service";

export default async function permissionRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: { roleId: string } }>("/permissions", getPermissionsByRole);
  app.get("/permissions/all", getAllPermissions);
  app.post<{ Body: { roleId: number; permissions: PermissionsMap } }>("/permissions", upsertPermissions);
}
