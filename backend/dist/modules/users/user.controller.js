"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const user_service_1 = require("./user.service");
const user_validator_1 = require("./user.validator");
async function getAllUsers(_req, reply) {
    try {
        reply.send(await user_service_1.userService.findAll());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch users" });
    }
}
async function getUserByEmail(req, reply) {
    try {
        const user = await user_service_1.userService.findByEmail(req.params.email);
        if (!user) {
            reply.status(404).send({ error: "User not found" });
            return;
        }
        reply.send(user);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch user" });
    }
}
async function createUser(req, reply) {
    try {
        const body = req.body;
        const validation = (0, user_validator_1.validateCreateUser)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await user_service_1.userService.create(body);
        if ("badRequest" in result) {
            reply.status(400).send({ error: result.badRequest });
            return;
        }
        if ("conflict" in result) {
            reply.status(409).send({ error: "User already exists" });
            return;
        }
        reply.status(201).send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to create user" });
    }
}
async function updateUser(req, reply) {
    try {
        const body = req.body;
        const validation = (0, user_validator_1.validateUpdateUser)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await user_service_1.userService.update(Number(req.params.id), body);
        if ("notFound" in result) {
            reply.status(404).send({ error: "User not found" });
            return;
        }
        if ("badRequest" in result) {
            reply.status(400).send({ error: result.badRequest });
            return;
        }
        if ("conflict" in result) {
            reply.status(409).send({ error: "Email already in use" });
            return;
        }
        reply.send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to update user" });
    }
}
async function deleteUser(req, reply) {
    try {
        const result = await user_service_1.userService.delete(Number(req.params.id));
        if ("notFound" in result) {
            reply.status(404).send({ error: "User not found" });
            return;
        }
        reply.status(204).send();
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to delete user", details: err instanceof Error ? err.message : "Unknown" });
    }
}
