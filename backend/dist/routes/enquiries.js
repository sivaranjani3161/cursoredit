"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = enquiryRoutes;
const data_source_1 = require("../config/data-source");
const Enquiry_1 = require("../entities/Enquiry");
const EnquiryStatus_1 = require("../entities/enums/EnquiryStatus");
async function enquiryRoutes(app) {
    const enquiryRepo = data_source_1.AppDataSource.getRepository(Enquiry_1.Enquiry);
    app.get("/enquiries", async (_req, reply) => {
        try {
            const enquiries = await enquiryRepo.find({
                relations: ["course"],
                order: { createdAt: "DESC" },
            });
            return reply.send(enquiries);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch enquiries" });
        }
    });
    app.get("/enquiries/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const enquiry = await enquiryRepo.findOne({ where: { id }, relations: ["course"] });
            if (!enquiry)
                return reply.status(404).send({ error: "Enquiry not found" });
            return reply.send(enquiry);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch enquiry" });
        }
    });
    app.post("/enquiries", async (req, reply) => {
        try {
            const body = req.body;
            const fullName = String(body?.fullName ?? "").trim();
            const email = String(body?.email ?? "").trim().toLowerCase();
            if (!fullName || !email) {
                return reply.status(400).send({ error: "fullName and email are required" });
            }
            const enquiry = enquiryRepo.create({
                fullName,
                email,
                phone: body?.phone ? String(body.phone) : null,
                message: body?.message ? String(body.message) : null,
                courseId: body?.courseId ? Number(body.courseId) : null,
                status: Object.values(EnquiryStatus_1.EnquiryStatus).includes(body?.status) ? body.status : EnquiryStatus_1.EnquiryStatus.NEW,
            });
            const saved = await enquiryRepo.save(enquiry);
            return reply.status(201).send(saved);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to create enquiry" });
        }
    });
    app.put("/enquiries/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const body = req.body;
            const enquiry = await enquiryRepo.findOne({ where: { id } });
            if (!enquiry)
                return reply.status(404).send({ error: "Enquiry not found" });
            if (body?.fullName !== undefined)
                enquiry.fullName = String(body.fullName).trim();
            if (body?.email !== undefined)
                enquiry.email = String(body.email).trim().toLowerCase();
            if (body?.phone !== undefined)
                enquiry.phone = body.phone ? String(body.phone) : null;
            if (body?.message !== undefined)
                enquiry.message = body.message ? String(body.message) : null;
            if (body?.courseId !== undefined)
                enquiry.courseId = body.courseId ? Number(body.courseId) : null;
            if (body?.status !== undefined && Object.values(EnquiryStatus_1.EnquiryStatus).includes(body.status)) {
                enquiry.status = body.status;
            }
            const updated = await enquiryRepo.save(enquiry);
            return reply.send(updated);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to update enquiry" });
        }
    });
    app.delete("/enquiries/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const enquiry = await enquiryRepo.findOne({ where: { id } });
            if (!enquiry)
                return reply.status(404).send({ error: "Enquiry not found" });
            await enquiryRepo.remove(enquiry);
            return reply.send({ success: true });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to delete enquiry" });
        }
    });
}
