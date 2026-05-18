import { AppDataSource } from "../../config/data-source";
import { GalleryEvent } from "../../entities/GalleryEvent";
import { GalleryImage } from "../../entities/GalleryImage";
import { mapImageItems } from "../../shared/utils/mappers";
import { toNullableStr } from "../../shared/utils/stringHelpers";
import { CreateGalleryBody, UpdateGalleryBody } from "./gallery.interface";

const eventRepo = () => AppDataSource.getRepository(GalleryEvent);
const imageRepo = () => AppDataSource.getRepository(GalleryImage);

const WITH_IMAGES = { relations: ["galleryImages"], order: { galleryImages: { createdAt: "ASC" as const, id: "ASC" as const } } };

export const galleryService = {
  findAll: async (type?: string) => {
    const where = type === "internal" || type === "external" ? { type: type as "internal" | "external" } : {};
    return eventRepo().find({
      where,
      relations: ["galleryImages"],
      order: { createdAt: "DESC", galleryImages: { createdAt: "ASC", id: "ASC" } },
    });
  },

  findById: async (id: number) =>
    eventRepo().findOne({ where: { id }, ...WITH_IMAGES }),

  create: async (body: CreateGalleryBody & { createdBy?: number }) => {
    const type: "internal" | "external" = body.type === "internal" ? "internal" : "external";

    if (type === "external") {
      const slug = String(body.slug ?? "").trim();
      const slugExists = await eventRepo().findOne({ where: { slug } });
      if (slugExists) return { conflict: true as const };

      const event = eventRepo().create({
        type,
        title:       String(body.title ?? "").trim(),
        slug,
        location:    toNullableStr(body.location),
        coverImage:  toNullableStr(body.coverImage),
        description: toNullableStr(body.description),
        eventDate:   body.eventDate ? new Date(body.eventDate) : null,
        createdBy:   body.createdBy ? Number(body.createdBy) : null,
      });
      const saved = await eventRepo().save(event);
      const images = mapImageItems(Array.isArray(body.galleryImages) ? body.galleryImages : []);
      if (images.length) await imageRepo().save(images.map((img) => ({ ...img, eventId: saved.id })));
      const withImages = await eventRepo().findOne({ where: { id: saved.id }, relations: ["galleryImages"] });
      return { data: withImages };
    } else {
      const event = eventRepo().create({ type, title: null, slug: null, createdBy: null });
      const saved = await eventRepo().save(event);
      await imageRepo().save({
        imageUrl: String(body.imageUrl ?? "").trim(),
        altText:  toNullableStr(body.altText),
        eventId:  saved.id,
      });
      const withImages = await eventRepo().findOne({ where: { id: saved.id }, relations: ["galleryImages"] });
      return { data: withImages };
    }
  },

  update: async (id: number, body: Partial<UpdateGalleryBody>) => {
    const event = await eventRepo().findOne({ where: { id }, relations: ["galleryImages"] });
    if (!event) return { notFound: true as const };

    if (event.type === "external") {
      const nextSlug = body.slug !== undefined ? String(body.slug).trim() : event.slug;
      if (!nextSlug) return { badRequest: "slug is required" as const };
      if (nextSlug !== event.slug) {
        const conflict = await eventRepo().findOne({ where: { slug: nextSlug } });
        if (conflict && conflict.id !== id) return { conflict: true as const };
      }
      if (body.title       !== undefined) event.title       = String(body.title).trim();
      event.slug = nextSlug;
      if (body.location    !== undefined) event.location    = toNullableStr(body.location);
      if (body.coverImage  !== undefined) event.coverImage  = toNullableStr(body.coverImage);
      if (body.description !== undefined) event.description = toNullableStr(body.description);
      if (body.eventDate   !== undefined) event.eventDate   = body.eventDate ? new Date(body.eventDate) : null;
      await eventRepo().save(event);

      if (body.galleryImages !== undefined) {
        await imageRepo().delete({ eventId: event.id });
        const images = mapImageItems(Array.isArray(body.galleryImages) ? body.galleryImages : []);
        if (images.length) await imageRepo().save(images.map((img) => ({ ...img, eventId: event.id })));
      }
    } else {
      if (body.imageUrl !== undefined || body.altText !== undefined) {
        await imageRepo().delete({ eventId: event.id });
        const imageUrl = String(body.imageUrl ?? "").trim();
        if (imageUrl)
          await imageRepo().save({ imageUrl, altText: toNullableStr(body.altText), eventId: event.id });
      }
    }

    const updated = await eventRepo().findOne({ where: { id: event.id }, relations: ["galleryImages"] });
    return { data: updated };
  },

  delete: async (id: number) => {
    const event = await eventRepo().findOne({ where: { id } });
    if (!event) return { notFound: true as const };
    await eventRepo().remove(event);
    return { success: true as const };
  },
};
