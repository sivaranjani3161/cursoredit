"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTestimonials = getAllTestimonials;
exports.getTestimonialById = getTestimonialById;
exports.createTestimonial = createTestimonial;
exports.updateTestimonial = updateTestimonial;
exports.deleteTestimonial = deleteTestimonial;
const testimonial_service_1 = require("./testimonial.service");
const testimonial_validator_1 = require("./testimonial.validator");
async function getAllTestimonials(_req, reply) {
    try {
        reply.send(await testimonial_service_1.testimonialService.findAll());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch testimonials" });
    }
}
async function getTestimonialById(req, reply) {
    try {
        const item = await testimonial_service_1.testimonialService.findById(Number(req.params.id));
        if (!item) {
            reply.status(404).send({ error: "Testimonial not found" });
            return;
        }
        reply.send(item);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch testimonial" });
    }
}
async function createTestimonial(req, reply) {
    try {
        const body = req.body;
        const validation = (0, testimonial_validator_1.validateCreateTestimonial)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await testimonial_service_1.testimonialService.create({ ...body, createdBy: Number(body.createdBy) });
        if ("badRequest" in result) {
            reply.status(400).send({ error: result.badRequest });
            return;
        }
        reply.status(201).send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to create testimonial" });
    }
}
async function updateTestimonial(req, reply) {
    try {
        const result = await testimonial_service_1.testimonialService.update(Number(req.params.id), req.body);
        if ("notFound" in result) {
            reply.status(404).send({ error: "Testimonial not found" });
            return;
        }
        if ("badRequest" in result) {
            reply.status(400).send({ error: result.badRequest });
            return;
        }
        reply.send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to update testimonial" });
    }
}
async function deleteTestimonial(req, reply) {
    try {
        const result = await testimonial_service_1.testimonialService.delete(Number(req.params.id));
        if ("notFound" in result) {
            reply.status(404).send({ error: "Testimonial not found" });
            return;
        }
        reply.send({ success: true });
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to delete testimonial" });
    }
}
