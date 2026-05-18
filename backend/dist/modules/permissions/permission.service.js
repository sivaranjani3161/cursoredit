"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionService = exports.OPERATIONS = exports.MODULES = void 0;
const data_source_1 = require("../../config/data-source");
const Permission_1 = require("../../entities/Permission");
const Role_1 = require("../../entities/Role");
exports.MODULES = ["courses", "blogs", "gallery", "enquiries", "testimonials"];
exports.OPERATIONS = ["create", "read", "update", "delete", "custom"];
function buildPermMap(perms) {
    const result = {};
    for (const mod of exports.MODULES) {
        result[mod] = {};
        for (const op of exports.OPERATIONS) {
            result[mod][op] = perms.some((p) => p.code === `${mod}:${op}`);
        }
    }
    return result;
}
const permRepo = () => data_source_1.AppDataSource.getRepository(Permission_1.Permission);
const roleRepo = () => data_source_1.AppDataSource.getRepository(Role_1.Role);
exports.permissionService = {
    getByRoleId: async (roleId) => {
        const perms = await permRepo().find({ where: { roleId } });
        return buildPermMap(perms);
    },
    getAll: async () => {
        const roles = await roleRepo().find({ relations: ["permissions"] });
        return roles.map((role) => ({
            roleId: role.id,
            roleCode: role.code,
            roleName: role.name,
            permissions: buildPermMap(role.permissions),
        }));
    },
    upsert: async (roleId, permissions) => {
        const role = await roleRepo().findOne({ where: { id: roleId } });
        if (!role)
            return { notFound: true };
        await permRepo().delete({ roleId });
        const toInsert = [];
        for (const mod of exports.MODULES) {
            for (const op of exports.OPERATIONS) {
                if (permissions?.[mod]?.[op]) {
                    toInsert.push({ roleId, code: `${mod}:${op}`, name: `${mod} ${op}`, description: null });
                }
            }
        }
        if (toInsert.length > 0)
            await permRepo().save(permRepo().create(toInsert));
        return { inserted: toInsert.length };
    },
};
