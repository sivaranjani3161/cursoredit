"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialService = void 0;
const data_source_1 = require("../../config/data-source");
const Testimonial_1 = require("../../entities/Testimonial");
const TestimonialType_1 = require("../../entities/enums/TestimonialType");
const stringHelpers_1 = require("../../shared/utils/stringHelpers");
const repo = () => data_source_1.AppDataSource.getRepository(Testimonial_1.Testimonial);
exports.testimonialService = {
    findAll: async () => repo().find({ order: { sortOrder: "ASC", createdAt: "DESC" } }),
    findById: async (id) => repo().findOne({ where: { id } }),
    create: async (body) => {
        const type = Object.values(TestimonialType_1.TestimonialType).includes(body.type)
            ? body.type
            : TestimonialType_1.TestimonialType.TEXT;
        const videoUrl = String(body.videoUrl ?? "").trim();
        const thumbnailUrl = String(body.thumbnailUrl ?? "").trim();
        let name = String(body.name ?? "").trim();
        if (type === TestimonialType_1.TestimonialType.VIDEO) {
            if (!videoUrl)
                return { badRequest: "videoUrl is required for video testimonials" };
            if (!name)
                name = "Video";
        }
        else {
            if (!name)
                return { badRequest: "name is required for text testimonials" };
        }
        const maxRow = await repo()
            .createQueryBuilder("t")
            .select("COALESCE(MAX(t.sortOrder), -1)", "maxSort")
            .getRawOne();
        const nextSort = Number(maxRow?.maxSort ?? -1) + 1;
        const testimonial = repo().create({
            type,
            videoUrl: type === TestimonialType_1.TestimonialType.VIDEO ? videoUrl : null,
            thumbnailUrl: thumbnailUrl || null,
            name,
            role: (0, stringHelpers_1.toNullableStr)(body.role),
            company: (0, stringHelpers_1.toNullableStr)(body.company),
            title: (0, stringHelpers_1.toNullableStr)(body.title),
            description: (0, stringHelpers_1.toNullableStr)(body.description),
            isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
            sortOrder: nextSort,
            createdBy: body.createdBy,
        });
        const saved = await repo().save(testimonial);
        return { data: saved };
    },
    update: async (id, body) => {
        const testimonial = await repo().findOne({ where: { id } });
        if (!testimonial)
            return { notFound: true };
        if (body.type !== undefined && Object.values(TestimonialType_1.TestimonialType).includes(body.type))
            testimonial.type = body.type;
        const nextType = testimonial.type;
        if (body.name !== undefined) {
            let nextName = String(body.name ?? "").trim();
            if (nextType === TestimonialType_1.TestimonialType.VIDEO && !nextName)
                nextName = "Video";
            testimonial.name = nextName;
        }
        else if (nextType === TestimonialType_1.TestimonialType.VIDEO && !String(testimonial.name ?? "").trim()) {
            testimonial.name = "Video";
        }
        if (body.videoUrl !== undefined)
            testimonial.videoUrl = body.videoUrl ? String(body.videoUrl).trim() : null;
        if (body.thumbnailUrl !== undefined)
            testimonial.thumbnailUrl = body.thumbnailUrl ? String(body.thumbnailUrl).trim() : null;
        if (body.role !== undefined)
            testimonial.role = (0, stringHelpers_1.toNullableStr)(body.role);
        if (body.company !== undefined)
            testimonial.company = (0, stringHelpers_1.toNullableStr)(body.company);
        if (body.title !== undefined)
            testimonial.title = (0, stringHelpers_1.toNullableStr)(body.title);
        if (body.description !== undefined)
            testimonial.description = (0, stringHelpers_1.toNullableStr)(body.description);
        if (body.isActive !== undefined)
            testimonial.isActive = Boolean(body.isActive);
        if (testimonial.type === TestimonialType_1.TestimonialType.TEXT)
            testimonial.videoUrl = null;
        if (testimonial.type === TestimonialType_1.TestimonialType.VIDEO && !String(testimonial.videoUrl ?? "").trim())
            return { badRequest: "videoUrl is required for video testimonials" };
        if (testimonial.type === TestimonialType_1.TestimonialType.TEXT && !String(testimonial.name ?? "").trim())
            return { badRequest: "name is required for text testimonials" };
        const updated = await repo().save(testimonial);
        return { data: updated };
    },
    delete: async (id) => {
        const testimonial = await repo().findOne({ where: { id } });
        if (!testimonial)
            return { notFound: true };
        await repo().remove(testimonial);
        return { success: true };
    },
};
