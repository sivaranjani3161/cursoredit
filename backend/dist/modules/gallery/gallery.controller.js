"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGallery = getAllGallery;
exports.getGalleryById = getGalleryById;
exports.createGallery = createGallery;
exports.updateGallery = updateGallery;
exports.deleteGallery = deleteGallery;
const gallery_service_1 = require("./gallery.service");
const gallery_validator_1 = require("./gallery.validator");
async function getAllGallery(req, reply) {
    try {
        reply.send(await gallery_service_1.galleryService.findAll(req.query.type));
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch gallery events" });
    }
}
async function getGalleryById(req, reply) {
    try {
        const event = await gallery_service_1.galleryService.findById(Number(req.params.id));
        if (!event) {
            reply.status(404).send({ error: "Gallery event not found" });
            return;
        }
        reply.send(event);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch gallery event" });
    }
}
async function createGallery(req, reply) {
    try {
        const body = req.body;
        const validation = (0, gallery_validator_1.validateCreateGallery)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await gallery_service_1.galleryService.create(body);
        if ("conflict" in result) {
            reply.status(409).send({ error: "Slug already exists" });
            return;
        }
        reply.status(201).send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to create gallery entry" });
    }
}
async function updateGallery(req, reply) {
    try {
        const result = await gallery_service_1.galleryService.update(Number(req.params.id), req.body);
        if ("notFound" in result) {
            reply.status(404).send({ error: "Gallery event not found" });
            return;
        }
        if ("badRequest" in result) {
            reply.status(400).send({ error: result.badRequest });
            return;
        }
        if ("conflict" in result) {
            reply.status(409).send({ error: "Slug already exists" });
            return;
        }
        reply.send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to update gallery entry" });
    }
}
async function deleteGallery(req, reply) {
    try {
        const result = await gallery_service_1.galleryService.delete(Number(req.params.id));
        if ("notFound" in result) {
            reply.status(404).send({ error: "Gallery event not found" });
            return;
        }
        reply.send({ success: true });
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to delete gallery entry" });
    }
}
