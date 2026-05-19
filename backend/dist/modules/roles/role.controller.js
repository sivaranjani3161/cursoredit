"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRoles = getAllRoles;
exports.createRole = createRole;
exports.updateRole = updateRole;
exports.deleteRole = deleteRole;
const role_service_1 = require("./role.service");
const role_validator_1 = require("./role.validator");
async function getAllRoles(_req, reply) {
    try {
        reply.send(await role_service_1.roleService.findAll());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch roles" });
    }
}
async function createRole(req, reply) {
    const body = req.body;
    const validation = (0, role_validator_1.validateCreateRole)(body);
    if (!validation.valid) {
        reply.status(400).send({ error: "Validation failed", details: validation.errors });
        return;
    }
    try {
        const result = await role_service_1.roleService.create(body);
        if ("conflict" in result) {
            reply.status(409).send({ error: "Role code already exists" });
            return;
        }
        reply.status(201).send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to create role" });
    }
}
async function updateRole(req, reply) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        reply.status(400).send({ error: "Invalid role id" });
        return;
    }
    try {
        const result = await role_service_1.roleService.update(id, req.body);
        if ("notFound" in result) {
            reply.status(404).send({ error: "Role not found" });
            return;
        }
        if ("forbidden" in result) {
            reply.status(400).send({ error: result.forbidden });
            return;
        }
        if ("badRequest" in result) {
            reply.status(400).send({ error: result.badRequest });
            return;
        }
        if ("conflict" in result) {
            reply.status(409).send({ error: "Role code already exists" });
            return;
        }
        reply.send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to update role" });
    }
}
async function deleteRole(req, reply) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        reply.status(400).send({ error: "Invalid role id" });
        return;
    }
    try {
        const result = await role_service_1.roleService.delete(id);
        if ("notFound" in result) {
            reply.status(404).send({ error: "Role not found" });
            return;
        }
        if ("forbidden" in result) {
            reply.status(400).send({ error: result.forbidden });
            return;
        }
        reply.send({ success: true });
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to delete role" });
    }
}
