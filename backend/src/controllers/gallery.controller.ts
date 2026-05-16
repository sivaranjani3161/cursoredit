import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../config/data-source";
import { GalleryEvent } from "../entities/GalleryEvent";
import { GalleryImage } from "../entities/GalleryImage";
import {
  CreateGalleryBody,
  UpdateGalleryBody,
  GalleryIdParam,
  GalleryQuerystring,
} from "../interfaces/gallery.interface";
import { mapImageItems } from "../utils/mappers";
import { toNullableStr } from "../utils/stringHelpers";
import { validateCreateGallery } from "../validators";

const eventRepo = () => AppDataSource.getRepository(GalleryEvent);
const imageRepo = () => AppDataSource.getRepository(GalleryImage);

export async function getAllGallery(
  req: FastifyRequest<{ Querystring: GalleryQuerystring }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { type } = req.query;
    const where =
      type === "internal" || type === "external" ? { type } : {};
    const events = await eventRepo().find({
      where,
      relations: ["galleryImages"],
      order: { createdAt: "DESC", galleryImages: { createdAt: "ASC", id: "ASC" } },
    });
    reply.send(events);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch gallery events" });
  }
}

export async function getGalleryById(
  req: FastifyRequest<{ Params: GalleryIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const event = await eventRepo().findOne({
      where: { id },
      relations: ["galleryImages"],
      order: { galleryImages: { createdAt: "ASC", id: "ASC" } },
    });
    if (!event) { reply.status(404).send({ error: "Gallery event not found" }); return; }
    reply.send(event);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch gallery event" });
  }
}

export async function createGallery(
  req: FastifyRequest<{ Body: CreateGalleryBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateGallery(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }

    const type: "internal" | "external" = body?.type === "internal" ? "internal" : "external";

    if (type === "external") {
      const title = String(body.title).trim();
      const slug = String(body.slug).trim();
      const createdBy = Number(body.createdBy);

      const slugExists = await eventRepo().findOne({ where: { slug } });
      if (slugExists) { reply.status(409).send({ error: "Slug already exists" }); return; }

      const event = eventRepo().create({
        type,
        title,
        slug,
        location: toNullableStr(body?.location),
        coverImage: toNullableStr(body?.coverImage),
        description: toNullableStr(body?.description),
        eventDate: body?.eventDate ? new Date(body.eventDate as string) : null,
        createdBy,
      });
      const saved = await eventRepo().save(event);
      const images = mapImageItems(Array.isArray(body?.galleryImages) ? (body.galleryImages as unknown[]) : []);
      if (images.length)
        await imageRepo().save(images.map((img) => ({ ...img, eventId: saved.id })));

      const withImages = await eventRepo().findOne({ where: { id: saved.id }, relations: ["galleryImages"] });
      reply.status(201).send(withImages);
    } else {
      const imageUrl = String(body?.imageUrl ?? "").trim();
      const event = eventRepo().create({ type, title: null, slug: null, createdBy: null });
      const saved = await eventRepo().save(event);
      await imageRepo().save({
        imageUrl,
        altText: toNullableStr(body?.altText),
        eventId: saved.id,
      });
      const withImages = await eventRepo().findOne({ where: { id: saved.id }, relations: ["galleryImages"] });
      reply.status(201).send(withImages);
    }
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to create gallery entry" });
  }
}

export async function updateGallery(
  req: FastifyRequest<{ Params: GalleryIdParam; Body: UpdateGalleryBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const body = req.body as unknown as Record<string, unknown>;

    const event = await eventRepo().findOne({ where: { id }, relations: ["galleryImages"] });
    if (!event) { reply.status(404).send({ error: "Gallery event not found" }); return; }

    if (event.type === "external") {
      const nextSlug = body?.slug !== undefined ? String(body.slug).trim() : event.slug;
      if (!nextSlug) { reply.status(400).send({ error: "slug is required" }); return; }
      if (nextSlug !== event.slug) {
        const conflict = await eventRepo().findOne({ where: { slug: nextSlug } });
        if (conflict && conflict.id !== id) { reply.status(409).send({ error: "Slug already exists" }); return; }
      }
      if (body?.title !== undefined) event.title = String(body.title).trim();
      event.slug = nextSlug;
      if (body?.location !== undefined) event.location = toNullableStr(body.location);
      if (body?.coverImage !== undefined) event.coverImage = toNullableStr(body.coverImage);
      if (body?.description !== undefined) event.description = toNullableStr(body.description);
      if (body?.eventDate !== undefined)
        event.eventDate = body.eventDate ? new Date(body.eventDate as string) : null;
      await eventRepo().save(event);

      if (body?.galleryImages !== undefined) {
        await imageRepo().delete({ eventId: event.id });
        const images = mapImageItems(Array.isArray(body.galleryImages) ? (body.galleryImages as unknown[]) : []);
        if (images.length)
          await imageRepo().save(images.map((img) => ({ ...img, eventId: event.id })));
      }
    } else {
      // internal — update the single image
      if (body?.imageUrl !== undefined || body?.altText !== undefined) {
        await imageRepo().delete({ eventId: event.id });
        const imageUrl = String(body?.imageUrl ?? "").trim();
        if (imageUrl)
          await imageRepo().save({ imageUrl, altText: toNullableStr(body?.altText), eventId: event.id });
      }
    }

    const updated = await eventRepo().findOne({ where: { id: event.id }, relations: ["galleryImages"] });
    reply.send(updated);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to update gallery entry" });
  }
}

export async function deleteGallery(
  req: FastifyRequest<{ Params: GalleryIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const event = await eventRepo().findOne({ where: { id } });
    if (!event) { reply.status(404).send({ error: "Gallery event not found" }); return; }
    await eventRepo().remove(event);
    reply.send({ success: true });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to delete gallery entry" });
  }
}
