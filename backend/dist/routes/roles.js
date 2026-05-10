"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = roleRoutes;
const data_source_1 = require("../config/data-source");
const Role_1 = require("../entities/Role");
const User_1 = require("../entities/User");
const Permission_1 = require("../entities/Permission");
async function roleRoutes(app) {
    const roleRepo = data_source_1.AppDataSource.getRepository(Role_1.Role);
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const permRepo = data_source_1.AppDataSource.getRepository(Permission_1.Permission);
    // GET /api/roles
    app.get("/roles", async (req, reply) => {
        const roles = await roleRepo.find({ order: { id: "ASC" } });
        return reply.send(roles);
    });
    // POST /api/roles
    app.post("/roles", async (req, reply) => {
        const { name, code, description } = req.body;
        const role = roleRepo.create({ name, code, description: description ?? null });
        const saved = await roleRepo.save(role);
        return reply.status(201).send(saved);
    });
    // PUT /api/roles/:id
    app.put("/roles/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return reply.status(400).send({ error: "Invalid role id" });
            }
            const body = req.body;
            const role = await roleRepo.findOne({ where: { id } });
            if (!role) {
                return reply.status(404).send({ error: "Role not found" });
            }
            if (role.code === "admin") {
                return reply.status(400).send({ error: "Admin role cannot be edited" });
            }
            if (body.name !== undefined || body.code !== undefined) {
                return reply.status(400).send({ error: "Role name and code cannot be changed" });
            }
            if (body.description !== undefined)
                role.description = body.description;
            const saved = await roleRepo.save(role);
            return reply.send(saved);
        }
        catch (error) {
            app.log.error(error);
            // MySQL duplicate key
            if (error?.code === "ER_DUP_ENTRY") {
                return reply.status(409).send({ error: "Role code already exists" });
            }
            return reply.status(500).send({ error: "Failed to update role" });
        }
    });
    // DELETE /api/roles/:id
    app.delete("/roles/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return reply.status(400).send({ error: "Invalid role id" });
            }
            const role = await roleRepo.findOne({ where: { id } });
            if (!role) {
                return reply.status(404).send({ error: "Role not found" });
            }
            if (role.code === "admin") {
                return reply.status(400).send({ error: "Admin role cannot be deleted" });
            }
            const usersWithRole = await userRepo.count({ where: { roleId: id } });
            if (usersWithRole > 0) {
                return reply.status(400).send({
                    error: "Role is assigned to users. Reassign users before deleting this role.",
                });
            }
            // Remove permissions first to avoid FK constraint failures.
            await permRepo.delete({ roleId: id });
            await roleRepo.delete(id);
            return reply.send({ success: true });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to delete role" });
        }
    });
}
