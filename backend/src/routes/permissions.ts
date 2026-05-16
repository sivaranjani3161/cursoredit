import { FastifyInstance } from "fastify";
import {
  getPermissionsByRole,
  getAllPermissions,
  upsertPermissions,
} from "../controllers/permission.controller";

export default async function permissionRoutes(app: FastifyInstance): Promise<void> {
  // GET /api/permissions?roleId=1  — permissions map for a specific role
  app.get<{ Querystring: { roleId: string } }>("/permissions", getPermissionsByRole);

  // GET /api/permissions/all — all roles with their permissions (admin overview)
  app.get("/permissions/all", getAllPermissions);

  // PUT /api/permissions — bulk upsert permissions for a role
  app.put("/permissions", upsertPermissions);
}
