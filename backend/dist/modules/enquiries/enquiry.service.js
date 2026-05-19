"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryService = void 0;
const data_source_1 = require("../../config/data-source");
const Enquiry_1 = require("../../entities/Enquiry");
const EnquiryStatus_1 = require("../../entities/enums/EnquiryStatus");
const stringHelpers_1 = require("../../shared/utils/stringHelpers");
const repo = () => data_source_1.AppDataSource.getRepository(Enquiry_1.Enquiry);
exports.enquiryService = {
    findAll: async () => repo().find({ relations: ["course"], order: { createdAt: "DESC" } }),
    findById: async (id) => repo().findOne({ where: { id }, relations: ["course"] }),
    create: async (body) => {
        const enquiry = repo().create({
            fullName: String(body.fullName).trim(),
            email: (0, stringHelpers_1.normalizeEmail)(body.email),
            phone: (0, stringHelpers_1.toNullableStr)(body.phone),
            message: (0, stringHelpers_1.toNullableStr)(body.message),
            courseId: (0, stringHelpers_1.toNullableInt)(body.courseId),
            status: Object.values(EnquiryStatus_1.EnquiryStatus).includes(body.status)
                ? body.status
                : EnquiryStatus_1.EnquiryStatus.NEW,
        });
        const saved = await repo().save(enquiry);
        return { data: saved };
    },
    update: async (id, body) => {
        const enquiry = await repo().findOne({ where: { id } });
        if (!enquiry)
            return { notFound: true };
        if (body.fullName !== undefined)
            enquiry.fullName = String(body.fullName).trim();
        if (body.email !== undefined)
            enquiry.email = (0, stringHelpers_1.normalizeEmail)(body.email);
        if (body.phone !== undefined)
            enquiry.phone = (0, stringHelpers_1.toNullableStr)(body.phone);
        if (body.message !== undefined)
            enquiry.message = (0, stringHelpers_1.toNullableStr)(body.message);
        if (body.courseId !== undefined)
            enquiry.courseId = (0, stringHelpers_1.toNullableInt)(body.courseId);
        if (body.status !== undefined && Object.values(EnquiryStatus_1.EnquiryStatus).includes(body.status))
            enquiry.status = body.status;
        const updated = await repo().save(enquiry);
        return { data: updated };
    },
    delete: async (id) => {
        const enquiry = await repo().findOne({ where: { id } });
        if (!enquiry)
            return { notFound: true };
        await repo().remove(enquiry);
        return { success: true };
    },
};
