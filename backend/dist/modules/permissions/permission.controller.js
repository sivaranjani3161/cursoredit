"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByRole = getPermissionsByRole;
exports.getAllPermissions = getAllPermissions;
exports.upsertPermissions = upsertPermissions;
const permission_service_1 = require("./permission.service");
const permission_validator_1 = require("./permission.validator");
async function getPermissionsByRole(req, reply) {
    const roleId = Number(req.query.roleId);
    if (Number.isNaN(roleId) || roleId <= 0) {
        reply.status(400).send({ error: "roleId is required and must be a positive integer" });
        return;
    }
    try {
        reply.send(await permission_service_1.permissionService.getByRoleId(roleId));
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch permissions" });
    }
}
async function getAllPermissions(_req, reply) {
    try {
        reply.send(await permission_service_1.permissionService.getAll());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch permissions" });
    }
}
async function upsertPermissions(req, reply) {
    try {
        const body = req.body;
        const validation = (0, permission_validator_1.validateUpdatePermissions)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await permission_service_1.permissionService.upsert(Number(body.roleId), body.permissions);
        if ("notFound" in result) {
            reply.status(404).send({ error: "Role not found" });
            return;
        }
        reply.send({ success: true, inserted: result.inserted });
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to update permissions" });
    }
}
