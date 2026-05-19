"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const Role_1 = require("../entities/Role");
const UserStatus_1 = require("../entities/enums/UserStatus");
async function userRoutes(app) {
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const roleRepo = data_source_1.AppDataSource.getRepository(Role_1.Role);
    // GET /api/users — list all users with role
    app.get("/users", async (req, reply) => {
        const users = await userRepo.find({
            relations: ["role"],
            order: { createdAt: "DESC" },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                authProvider: true,
                roleId: true,
                createdAt: true,
                role: { id: true, name: true, code: true },
            },
        });
        return reply.send(users);
    });
    // GET /api/users/by-email/:email — used by NextAuth to look up user role
    app.get("/users/by-email/:email", async (req, reply) => {
        const { email } = req.params;
        const user = await userRepo.findOne({
            where: { email },
            relations: ["role", "role.permissions"],
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                roleId: true,
                role: {
                    id: true,
                    name: true,
                    code: true,
                    permissions: { id: true, code: true, name: true },
                },
            },
        });
        if (!user)
            return reply.status(404).send({ error: "User not found" });
        return reply.send(user);
    });
    // POST /api/users — create user (admin-invited)
    app.post("/users", async (req, reply) => {
        const { email, name, roleId } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const normalizedName = String(name || "").trim();
        const parsedRoleId = Number(roleId);
        if (!normalizedEmail || !normalizedName || Number.isNaN(parsedRoleId)) {
            return reply.status(400).send({ error: "email, name and roleId are required" });
        }
        const role = await roleRepo.findOne({ where: { id: parsedRoleId } });
        if (!role)
            return reply.status(400).send({ error: "Role not found" });
        const existing = await userRepo.findOne({ where: { email: normalizedEmail } });
        if (existing)
            return reply.status(409).send({ error: "User already exists" });
        const user = userRepo.create({
            email: normalizedEmail,
            name: normalizedName,
            roleId: parsedRoleId,
            status: UserStatus_1.UserStatus.ACTIVE,
            authProvider: "google",
            password: null,
            oauthId: null,
            inviteToken: null,
            inviteExpiresAt: null,
        });
        const saved = await userRepo.save(user);
        return reply.status(201).send({ ...saved, role });
    });
    // PUT /api/users/:id — update user details
    app.put("/users/:id", async (req, reply) => {
        const { id } = req.params;
        const { roleId, name, email, status } = req.body;
        const userId = Number(id);
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            return reply.status(404).send({ error: "User not found" });
        if (roleId !== undefined) {
            const role = await roleRepo.findOne({ where: { id: Number(roleId) } });
            if (!role)
                return reply.status(400).send({ error: "Role not found" });
            user.roleId = Number(roleId);
        }
        if (name !== undefined) {
            const trimmedName = String(name).trim();
            if (!trimmedName)
                return reply.status(400).send({ error: "Name cannot be empty" });
            user.name = trimmedName;
        }
        if (email !== undefined) {
            const normalizedEmail = String(email).trim().toLowerCase();
            if (!normalizedEmail)
                return reply.status(400).send({ error: "Email cannot be empty" });
            const existing = await userRepo.findOne({ where: { email: normalizedEmail } });
            if (existing && existing.id !== userId) {
                return reply.status(409).send({ error: "Email already in use" });
            }
            user.email = normalizedEmail;
        }
        if (status !== undefined) {
            if (!Object.values(UserStatus_1.UserStatus).includes(status)) {
                return reply.status(400).send({ error: "Invalid status value" });
            }
            user.status = status;
        }
        const saved = await userRepo.save(user);
        const withRole = await userRepo.findOne({
            where: { id: saved.id },
            relations: ["role"],
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                authProvider: true,
                roleId: true,
                createdAt: true,
                role: { id: true, name: true, code: true },
            },
        });
        return reply.send(withRole);
    });
    // DELETE /api/users/:id
    app.delete("/users/:id", async (req, reply) => {
        const { id } = req.params;
        try {
            app.log.info(`Attempting to delete user with ID: ${id}`);
            const result = await userRepo.delete(Number(id));
            if (result.affected === 0) {
                app.log.warn(`User with ID ${id} not found for deletion`);
                return reply.status(404).send({ error: "User not found" });
            }
            app.log.info(`Successfully deleted user with ID: ${id}`);
            return reply.status(204).send();
        }
        catch (error) {
            app.log.error(`Failed to delete user with ID ${id}: ${error.message}`);
            return reply.status(500).send({ error: "Failed to delete user", details: error.message });
        }
    });
}
