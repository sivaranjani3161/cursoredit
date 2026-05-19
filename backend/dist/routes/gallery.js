"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = galleryRoutes;
const data_source_1 = require("../config/data-source");
const GalleryEvent_1 = require("../entities/GalleryEvent");
const GalleryImage_1 = require("../entities/GalleryImage");
async function galleryRoutes(app) {
    const eventRepo = data_source_1.AppDataSource.getRepository(GalleryEvent_1.GalleryEvent);
    const imageRepo = data_source_1.AppDataSource.getRepository(GalleryImage_1.GalleryImage);
    const mapImages = (value) => Array.isArray(value)
        ? value
            .map((item) => ({
            id: item?.id ? Number(item.id) : undefined,
            imageUrl: String(item?.imageUrl ?? "").trim(),
            altText: item?.altText ? String(item.altText) : null,
        }))
            .filter((item) => item.imageUrl.length > 0)
        : [];
    // GET /gallery?type=internal|external  (no param = all)
    app.get("/gallery", async (req, reply) => {
        try {
            const { type } = req.query;
            const where = type === "internal" || type === "external" ? { type: type } : {};
            const events = await eventRepo.find({
                where,
                relations: ["galleryImages"],
                order: { createdAt: "DESC", galleryImages: { createdAt: "ASC", id: "ASC" } },
            });
            return reply.send(events);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch gallery events" });
        }
    });
    app.get("/gallery/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const event = await eventRepo.findOne({
                where: { id },
                relations: ["galleryImages"],
                order: { galleryImages: { createdAt: "ASC", id: "ASC" } },
            });
            if (!event)
                return reply.status(404).send({ error: "Gallery event not found" });
            return reply.send(event);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch gallery event" });
        }
    });
    app.post("/gallery", async (req, reply) => {
        try {
            const body = req.body;
            const type = body?.type === "internal" ? "internal" : "external";
            if (type === "external") {
                const title = String(body?.title ?? "").trim();
                const slug = String(body?.slug ?? "").trim();
                const createdBy = Number(body?.createdBy);
                if (!title || !slug || Number.isNaN(createdBy)) {
                    return reply.status(400).send({ error: "title, slug and createdBy are required for external events" });
                }
                const slugExists = await eventRepo.findOne({ where: { slug } });
                if (slugExists)
                    return reply.status(409).send({ error: "Slug already exists" });
                const event = eventRepo.create({
                    type,
                    title,
                    slug,
                    location: body?.location ? String(body.location) : null,
                    coverImage: body?.coverImage ? String(body.coverImage) : null,
                    description: body?.description ? String(body.description) : null,
                    eventDate: body?.eventDate ? new Date(body.eventDate) : null,
                    createdBy,
                });
                const saved = await eventRepo.save(event);
                const images = mapImages(body?.galleryImages);
                if (images.length) {
                    await imageRepo.save(images.map((item) => ({ ...item, eventId: saved.id })));
                }
                const withImages = await eventRepo.findOne({ where: { id: saved.id }, relations: ["galleryImages"] });
                return reply.status(201).send(withImages);
            }
            else {
                // internal — only imageUrl required
                const imageUrl = String(body?.imageUrl ?? "").trim();
                if (!imageUrl)
                    return reply.status(400).send({ error: "imageUrl is required for internal images" });
                const event = eventRepo.create({
                    type,
                    title: null,
                    slug: null,
                    createdBy: null,
                });
                const saved = await eventRepo.save(event);
                await imageRepo.save({ imageUrl, altText: body?.altText ? String(body.altText) : null, eventId: saved.id });
                const withImages = await eventRepo.findOne({ where: { id: saved.id }, relations: ["galleryImages"] });
                return reply.status(201).send(withImages);
            }
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to create gallery entry" });
        }
    });
    app.put("/gallery/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const body = req.body;
            const event = await eventRepo.findOne({ where: { id }, relations: ["galleryImages"] });
            if (!event)
                return reply.status(404).send({ error: "Gallery event not found" });
            if (event.type === "external") {
                const nextSlug = body?.slug !== undefined ? String(body.slug).trim() : event.slug;
                if (!nextSlug)
                    return reply.status(400).send({ error: "slug is required" });
                if (nextSlug !== event.slug) {
                    const slugExists = await eventRepo.findOne({ where: { slug: nextSlug } });
                    if (slugExists && slugExists.id !== id)
                        return reply.status(409).send({ error: "Slug already exists" });
                }
                if (body?.title !== undefined)
                    event.title = String(body.title).trim();
                event.slug = nextSlug;
                if (body?.location !== undefined)
                    event.location = body.location ? String(body.location) : null;
                if (body?.coverImage !== undefined)
                    event.coverImage = body.coverImage ? String(body.coverImage) : null;
                if (body?.description !== undefined)
                    event.description = body.description ? String(body.description) : null;
                if (body?.eventDate !== undefined)
                    event.eventDate = body.eventDate ? new Date(body.eventDate) : null;
                await eventRepo.save(event);
                if (body?.galleryImages !== undefined) {
                    await imageRepo.delete({ eventId: event.id });
                    const images = mapImages(body.galleryImages);
                    if (images.length)
                        await imageRepo.save(images.map((item) => ({ ...item, eventId: event.id })));
                }
            }
            else {
                // internal — update the single image
                if (body?.imageUrl !== undefined || body?.altText !== undefined) {
                    await imageRepo.delete({ eventId: event.id });
                    const imageUrl = String(body?.imageUrl ?? "").trim();
                    if (imageUrl) {
                        await imageRepo.save({ imageUrl, altText: body?.altText ? String(body.altText) : null, eventId: event.id });
                    }
                }
            }
            const updated = await eventRepo.findOne({ where: { id: event.id }, relations: ["galleryImages"] });
            return reply.send(updated);
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to update gallery entry" });
        }
    });
    app.delete("/gallery/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const event = await eventRepo.findOne({ where: { id } });
            if (!event)
                return reply.status(404).send({ error: "Gallery event not found" });
            await eventRepo.remove(event);
            return reply.send({ success: true });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to delete gallery entry" });
        }
    });
}
