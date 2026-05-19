import { AppDataSource } from "../../config/data-source";
import { Permission } from "../../entities/Permission";
import { Role } from "../../entities/Role";

export const MODULES = ["courses", "blogs", "gallery", "enquiries", "testimonials"] as const;
export const OPERATIONS = ["create", "read", "update", "delete", "custom"] as const;

export type PermissionModule    = (typeof MODULES)[number];
export type PermissionOperation = (typeof OPERATIONS)[number];
export type PermCode = `${PermissionModule}:${PermissionOperation}`;
export type PermissionsMap = Record<string, Record<string, boolean>>;

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

export const permissionService = {
  getByRoleId: async (roleId: number): Promise<PermissionsMap> => {
    const perms = await permRepo().find({ where: { roleId } });
    return buildPermMap(perms);
  },

  getAll: async () => {
    const roles = await roleRepo().find({ relations: ["permissions"] });
    return roles.map((role) => ({
      roleId:      role.id,
      roleCode:    role.code,
      roleName:    role.name,
      permissions: buildPermMap(role.permissions),
    }));
  },

  upsert: async (roleId: number, permissions: PermissionsMap) => {
    const role = await roleRepo().findOne({ where: { id: roleId } });
    if (!role) return { notFound: true as const };

    await permRepo().delete({ roleId });

    const toInsert: Partial<Permission>[] = [];
    for (const mod of MODULES) {
      for (const op of OPERATIONS) {
        if (permissions?.[mod]?.[op]) {
          toInsert.push({ roleId, code: `${mod}:${op}` as PermCode, name: `${mod} ${op}`, description: null });
        }
      }
    }
    if (toInsert.length > 0) await permRepo().save(permRepo().create(toInsert as Permission[]));
    return { inserted: toInsert.length };
  },
};
