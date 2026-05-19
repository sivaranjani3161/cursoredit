import { AppDataSource } from "../../config/data-source";
import { Role } from "../../entities/Role";
import { User } from "../../entities/User";
import { Permission } from "../../entities/Permission";
import { CreateRoleBody, UpdateRoleBody } from "./role.interface";

const roleRepo = () => AppDataSource.getRepository(Role);
const userRepo = () => AppDataSource.getRepository(User);
const permRepo = () => AppDataSource.getRepository(Permission);

export const roleService = {
  findAll: async () => roleRepo().find({ order: { id: "ASC" } }),

  create: async (body: CreateRoleBody) => {
    const role = roleRepo().create({
      name:        String(body.name).trim(),
      code:        String(body.code).trim(),
      description: body.description ? String(body.description) : null,
    });
    try {
      const saved = await roleRepo().save(role);
      return { data: saved };
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ER_DUP_ENTRY") return { conflict: true as const };
      throw err;
    }
  },

  update: async (id: number, body: Partial<UpdateRoleBody>) => {
    const role = await roleRepo().findOne({ where: { id } });
    if (!role) return { notFound: true as const };
    if (role.code === "admin") return { forbidden: "Admin role cannot be edited" as const };
    if (body.name !== undefined || body.code !== undefined)
      return { badRequest: "Role name and code cannot be changed" as const };
    if (body.description !== undefined) role.description = body.description as string | null;
    try {
      const saved = await roleRepo().save(role);
      return { data: saved };
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === "ER_DUP_ENTRY") return { conflict: true as const };
      throw err;
    }
  },

  delete: async (id: number) => {
    const role = await roleRepo().findOne({ where: { id } });
    if (!role) return { notFound: true as const };
    if (role.code === "admin") return { forbidden: "Admin role cannot be deleted" as const };
    const adminRole = await roleRepo().findOne({ where: { code: "admin" } });
    if (adminRole) await userRepo().update({ roleId: id }, { roleId: adminRole.id });
    await permRepo().delete({ roleId: id });
    await roleRepo().delete(id);
    return { success: true as const };
  },
};
