"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryService = void 0;
const data_source_1 = require("../../config/data-source");
const GalleryEvent_1 = require("../../entities/GalleryEvent");
const GalleryImage_1 = require("../../entities/GalleryImage");
const mappers_1 = require("../../shared/utils/mappers");
const stringHelpers_1 = require("../../shared/utils/stringHelpers");
const eventRepo = () => data_source_1.AppDataSource.getRepository(GalleryEvent_1.GalleryEvent);
const imageRepo = () => data_source_1.AppDataSource.getRepository(GalleryImage_1.GalleryImage);
const WITH_IMAGES = { relations: ["galleryImages"], order: { galleryImages: { createdAt: "ASC", id: "ASC" } } };
exports.galleryService = {
    findAll: async (type) => {
        const where = type === "internal" || type === "external" ? { type: type } : {};
        return eventRepo().find({
            where,
            relations: ["galleryImages"],
            order: { createdAt: "DESC", galleryImages: { createdAt: "ASC", id: "ASC" } },
        });
    },
    findById: async (id) => eventRepo().findOne({ where: { id }, ...WITH_IMAGES }),
    create: async (body) => {
        const type = body.type === "internal" ? "internal" : "external";
        if (type === "external") {
            const slug = String(body.slug ?? "").trim();
            const slugExists = await eventRepo().findOne({ where: { slug } });
            if (slugExists)
                return { conflict: true };
            const event = eventRepo().create({
                type,
                title: String(body.title ?? "").trim(),
                slug,
                location: (0, stringHelpers_1.toNullableStr)(body.location),
                coverImage: (0, stringHelpers_1.toNullableStr)(body.coverImage),
                description: (0, stringHelpers_1.toNullableStr)(body.description),
                eventDate: body.eventDate ? new Date(body.eventDate) : null,
                createdBy: body.createdBy ? Number(body.createdBy) : null,
            });
            const saved = await eventRepo().save(event);
            const images = (0, mappers_1.mapImageItems)(Array.isArray(body.galleryImages) ? body.galleryImages : []);
            if (images.length)
                await imageRepo().save(images.map((img) => ({ ...img, eventId: saved.id })));
            const withImages = await eventRepo().findOne({ where: { id: saved.id }, relations: ["galleryImages"] });
            return { data: withImages };
        }
        else {
            const event = eventRepo().create({ type, title: null, slug: null, createdBy: null });
            const saved = await eventRepo().save(event);
            await imageRepo().save({
                imageUrl: String(body.imageUrl ?? "").trim(),
                altText: (0, stringHelpers_1.toNullableStr)(body.altText),
                eventId: saved.id,
            });
            const withImages = await eventRepo().findOne({ where: { id: saved.id }, relations: ["galleryImages"] });
            return { data: withImages };
        }
    },
    update: async (id, body) => {
        const event = await eventRepo().findOne({ where: { id }, relations: ["galleryImages"] });
        if (!event)
            return { notFound: true };
        if (event.type === "external") {
            const nextSlug = body.slug !== undefined ? String(body.slug).trim() : event.slug;
            if (!nextSlug)
                return { badRequest: "slug is required" };
            if (nextSlug !== event.slug) {
                const conflict = await eventRepo().findOne({ where: { slug: nextSlug } });
                if (conflict && conflict.id !== id)
                    return { conflict: true };
            }
            if (body.title !== undefined)
                event.title = String(body.title).trim();
            event.slug = nextSlug;
            if (body.location !== undefined)
                event.location = (0, stringHelpers_1.toNullableStr)(body.location);
            if (body.coverImage !== undefined)
                event.coverImage = (0, stringHelpers_1.toNullableStr)(body.coverImage);
            if (body.description !== undefined)
                event.description = (0, stringHelpers_1.toNullableStr)(body.description);
            if (body.eventDate !== undefined)
                event.eventDate = body.eventDate ? new Date(body.eventDate) : null;
            await eventRepo().save(event);
            if (body.galleryImages !== undefined) {
                await imageRepo().delete({ eventId: event.id });
                const images = (0, mappers_1.mapImageItems)(Array.isArray(body.galleryImages) ? body.galleryImages : []);
                if (images.length)
                    await imageRepo().save(images.map((img) => ({ ...img, eventId: event.id })));
            }
        }
        else {
            if (body.imageUrl !== undefined || body.altText !== undefined) {
                await imageRepo().delete({ eventId: event.id });
                const imageUrl = String(body.imageUrl ?? "").trim();
                if (imageUrl)
                    await imageRepo().save({ imageUrl, altText: (0, stringHelpers_1.toNullableStr)(body.altText), eventId: event.id });
            }
        }
        const updated = await eventRepo().findOne({ where: { id: event.id }, relations: ["galleryImages"] });
        return { data: updated };
    },
    delete: async (id) => {
        const event = await eventRepo().findOne({ where: { id } });
        if (!event)
            return { notFound: true };
        await eventRepo().remove(event);
        return { success: true };
    },
};
