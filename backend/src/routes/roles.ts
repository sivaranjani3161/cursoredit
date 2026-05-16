import { FastifyInstance } from "fastify";
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/role.controller";
import { RoleIdParam, CreateRoleBody, UpdateRoleBody } from "../interfaces/role.interface";

export default async function roleRoutes(app: FastifyInstance): Promise<void> {
  app.get("/roles", getAllRoles);
  app.post<{ Body: CreateRoleBody }>("/roles", createRole);
  app.put<{ Params: RoleIdParam; Body: UpdateRoleBody }>("/roles/:id", updateRole);
  app.delete<{ Params: RoleIdParam }>("/roles/:id", deleteRole);
}
