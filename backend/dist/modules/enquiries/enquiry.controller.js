"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEnquiries = getAllEnquiries;
exports.getEnquiryById = getEnquiryById;
exports.createEnquiry = createEnquiry;
exports.updateEnquiry = updateEnquiry;
exports.deleteEnquiry = deleteEnquiry;
const enquiry_service_1 = require("./enquiry.service");
const enquiry_validator_1 = require("./enquiry.validator");
async function getAllEnquiries(_req, reply) {
    try {
        reply.send(await enquiry_service_1.enquiryService.findAll());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch enquiries" });
    }
}
async function getEnquiryById(req, reply) {
    try {
        const item = await enquiry_service_1.enquiryService.findById(Number(req.params.id));
        if (!item) {
            reply.status(404).send({ error: "Enquiry not found" });
            return;
        }
        reply.send(item);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch enquiry" });
    }
}
async function createEnquiry(req, reply) {
    try {
        const body = req.body;
        const validation = (0, enquiry_validator_1.validateCreateEnquiry)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await enquiry_service_1.enquiryService.create(body);
        reply.status(201).send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to create enquiry" });
    }
}
async function updateEnquiry(req, reply) {
    try {
        const body = req.body;
        const validation = (0, enquiry_validator_1.validateUpdateEnquiry)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await enquiry_service_1.enquiryService.update(Number(req.params.id), body);
        if ("notFound" in result) {
            reply.status(404).send({ error: "Enquiry not found" });
            return;
        }
        reply.send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to update enquiry" });
    }
}
async function deleteEnquiry(req, reply) {
    try {
        const result = await enquiry_service_1.enquiryService.delete(Number(req.params.id));
        if ("notFound" in result) {
            reply.status(404).send({ error: "Enquiry not found" });
            return;
        }
        reply.send({ success: true });
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to delete enquiry" });
    }
}
