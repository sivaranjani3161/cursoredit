"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const data_source_1 = require("../../config/data-source");
const User_1 = require("../../entities/User");
const Role_1 = require("../../entities/Role");
const UserStatus_1 = require("../../entities/enums/UserStatus");
const stringHelpers_1 = require("../../shared/utils/stringHelpers");
const userRepo = () => data_source_1.AppDataSource.getRepository(User_1.User);
const roleRepo = () => data_source_1.AppDataSource.getRepository(Role_1.Role);
const USER_SELECT = {
    id: true, email: true, name: true, status: true,
    authProvider: true, roleId: true, createdAt: true,
    role: { id: true, name: true, code: true },
};
exports.userService = {
    findAll: async () => userRepo().find({ relations: ["role"], order: { createdAt: "DESC" }, select: USER_SELECT }),
    findByEmail: async (email) => userRepo().findOne({
        where: { email },
        relations: ["role", "role.permissions"],
        select: {
            id: true, email: true, name: true, status: true, roleId: true,
            role: { id: true, name: true, code: true, permissions: { id: true, code: true, name: true } },
        },
    }),
    create: async (body) => {
        const email = (0, stringHelpers_1.normalizeEmail)(body.email);
        const name = String(body.name).trim();
        const roleId = Number(body.roleId);
        const role = await roleRepo().findOne({ where: { id: roleId } });
        if (!role)
            return { badRequest: "Role not found" };
        const existing = await userRepo().findOne({ where: { email } });
        if (existing)
            return { conflict: true };
        const user = userRepo().create({
            email, name, roleId,
            status: UserStatus_1.UserStatus.ACTIVE,
            authProvider: "google",
            password: null,
            oauthId: null,
            inviteToken: null,
            inviteExpiresAt: null,
        });
        const saved = await userRepo().save(user);
        return { data: { ...saved, role } };
    },
    update: async (id, body) => {
        const user = await userRepo().findOne({ where: { id } });
        if (!user)
            return { notFound: true };
        if (body.roleId !== undefined) {
            const role = await roleRepo().findOne({ where: { id: Number(body.roleId) } });
            if (!role)
                return { badRequest: "Role not found" };
            user.roleId = Number(body.roleId);
        }
        if (body.name !== undefined)
            user.name = String(body.name).trim();
        if (body.email !== undefined) {
            const email = (0, stringHelpers_1.normalizeEmail)(body.email);
            const conflict = await userRepo().findOne({ where: { email } });
            if (conflict && conflict.id !== id)
                return { conflict: true };
            user.email = email;
        }
        if (body.status !== undefined) {
            if (!Object.values(UserStatus_1.UserStatus).includes(body.status))
                return { badRequest: "Invalid status value" };
            user.status = body.status;
        }
        const saved = await userRepo().save(user);
        const withRole = await userRepo().findOne({ where: { id: saved.id }, relations: ["role"], select: USER_SELECT });
        return { data: withRole };
    },
    delete: async (id) => {
        const result = await userRepo().delete(id);
        if (result.affected === 0)
            return { notFound: true };
        return { success: true };
    },
};
