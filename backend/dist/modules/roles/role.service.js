"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleService = void 0;
const data_source_1 = require("../../config/data-source");
const Role_1 = require("../../entities/Role");
const User_1 = require("../../entities/User");
const Permission_1 = require("../../entities/Permission");
const roleRepo = () => data_source_1.AppDataSource.getRepository(Role_1.Role);
const userRepo = () => data_source_1.AppDataSource.getRepository(User_1.User);
const permRepo = () => data_source_1.AppDataSource.getRepository(Permission_1.Permission);
exports.roleService = {
    findAll: async () => roleRepo().find({ order: { id: "ASC" } }),
    create: async (body) => {
        const role = roleRepo().create({
            name: String(body.name).trim(),
            code: String(body.code).trim(),
            description: body.description ? String(body.description) : null,
        });
        try {
            const saved = await roleRepo().save(role);
            return { data: saved };
        }
        catch (err) {
            if (err?.code === "ER_DUP_ENTRY")
                return { conflict: true };
            throw err;
        }
    },
    update: async (id, body) => {
        const role = await roleRepo().findOne({ where: { id } });
        if (!role)
            return { notFound: true };
        if (role.code === "admin")
            return { forbidden: "Admin role cannot be edited" };
        if (body.name !== undefined || body.code !== undefined)
            return { badRequest: "Role name and code cannot be changed" };
        if (body.description !== undefined)
            role.description = body.description;
        try {
            const saved = await roleRepo().save(role);
            return { data: saved };
        }
        catch (err) {
            if (err?.code === "ER_DUP_ENTRY")
                return { conflict: true };
            throw err;
        }
    },
    delete: async (id) => {
        const role = await roleRepo().findOne({ where: { id } });
        if (!role)
            return { notFound: true };
        if (role.code === "admin")
            return { forbidden: "Admin role cannot be deleted" };
        const adminRole = await roleRepo().findOne({ where: { code: "admin" } });
        if (adminRole)
            await userRepo().update({ roleId: id }, { roleId: adminRole.id });
        await permRepo().delete({ roleId: id });
        await roleRepo().delete(id);
        return { success: true };
    },
};
