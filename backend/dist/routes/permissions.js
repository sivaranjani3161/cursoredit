"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPERATIONS = exports.MODULES = void 0;
exports.default = permissionRoutes;
const data_source_1 = require("../config/data-source");
const Permission_1 = require("../entities/Permission");
const Role_1 = require("../entities/Role");
// Supported modules and operations
exports.MODULES = ["courses", "blogs", "gallery", "enquiries", "testimonials"];
exports.OPERATIONS = ["create", "read", "update", "delete", "custom"];
async function permissionRoutes(app) {
    const permRepo = data_source_1.AppDataSource.getRepository(Permission_1.Permission);
    const roleRepo = data_source_1.AppDataSource.getRepository(Role_1.Role);
    // GET /api/permissions?roleId=1
    // Returns a structured CRUD map for a given role
    app.get("/permissions", async (req, reply) => {
        const roleId = Number(req.query.roleId);
        if (Number.isNaN(roleId)) {
            return reply.status(400).send({
                error: "roleId is required",
            });
        }
        const perms = await permRepo.find({ where: { roleId } });
        // Build structured map: { courses: { create: true, read: true, ... }, ... }
        const result = {};
        for (const mod of exports.MODULES) {
            result[mod] = {};
            for (const op of exports.OPERATIONS) {
                const code = `${mod}:${op}`;
                result[mod][op] = perms.some((p) => p.code === code);
            }
        }
        return reply.send(result);
    });
    // PUT /api/permissions — bulk upsert permissions for a role
    // Body: { roleId: number, permissions: { [module]: { create, read, update, delete } } }
    app.put("/permissions", async (req, reply) => {
        try {
            const body = req.body;
            const roleId = Number(body.roleId);
            const permissions = body.permissions;
            if (isNaN(roleId)) {
                return reply.status(400).send({
                    error: "roleId is required",
                });
            }
            const role = await roleRepo.findOne({
                where: { id: roleId },
            });
            if (!role) {
                return reply.status(400).send({
                    error: "Role not found",
                });
            }
            await permRepo.delete({ roleId });
            const toInsert = [];
            for (const mod of exports.MODULES) {
                for (const op of exports.OPERATIONS) {
                    if (permissions?.[mod]?.[op]) {
                        const code = `${mod}:${op}`;
                        toInsert.push({
                            roleId,
                            code,
                            name: `${mod} ${op}`,
                            description: null,
                        });
                    }
                }
            }
            if (toInsert.length > 0) {
                await permRepo.save(permRepo.create(toInsert));
            }
            return reply.send({
                success: true,
                inserted: toInsert.length,
            });
        }
        catch (err) {
            console.error("PUT ERROR:", err);
            return reply.status(500).send({
                error: "Internal Server Error",
            });
        }
    });
    // GET /api/permissions/all — get permissions grouped by role (for admin overview)
    app.get("/permissions/all", async (req, reply) => {
        const roles = await roleRepo.find({ relations: ["permissions"] });
        const result = roles.map((role) => {
            const map = {};
            for (const mod of exports.MODULES) {
                map[mod] = {};
                for (const op of exports.OPERATIONS) {
                    map[mod][op] = role.permissions.some((p) => p.code === `${mod}:${op}`);
                }
            }
            return { roleId: role.id, roleCode: role.code, roleName: role.name, permissions: map };
        });
        return reply.send(result);
    });
}
