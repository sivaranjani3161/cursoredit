import { AppDataSource } from "../../config/data-source";
import { Testimonial } from "../../entities/Testimonial";
import { TestimonialType } from "../../entities/enums/TestimonialType";
import { toNullableStr } from "../../shared/utils/stringHelpers";
import { CreateTestimonialBody, UpdateTestimonialBody } from "./testimonial.interface";

const repo = () => AppDataSource.getRepository(Testimonial);

export const testimonialService = {
  findAll: async () =>
    repo().find({ order: { sortOrder: "ASC", createdAt: "DESC" } }),

  findById: async (id: number) =>
    repo().findOne({ where: { id } }),

  create: async (body: CreateTestimonialBody & { createdBy: number }) => {
    const type = Object.values(TestimonialType).includes(body.type as TestimonialType)
      ? (body.type as TestimonialType)
      : TestimonialType.TEXT;

    const videoUrl     = String(body.videoUrl ?? "").trim();
    const thumbnailUrl = String(body.thumbnailUrl ?? "").trim();
    let name           = String(body.name ?? "").trim();

    if (type === TestimonialType.VIDEO) {
      if (!videoUrl) return { badRequest: "videoUrl is required for video testimonials" as const };
      if (!name) name = "Video";
    } else {
      if (!name) return { badRequest: "name is required for text testimonials" as const };
    }

    const maxRow = await repo()
      .createQueryBuilder("t")
      .select("COALESCE(MAX(t.sortOrder), -1)", "maxSort")
      .getRawOne<{ maxSort: string }>();
    const nextSort = Number(maxRow?.maxSort ?? -1) + 1;

    const testimonial = repo().create({
      type,
      videoUrl:     type === TestimonialType.VIDEO ? videoUrl : null,
      thumbnailUrl: thumbnailUrl || null,
      name,
      role:         toNullableStr(body.role),
      company:      toNullableStr(body.company),
      title:        toNullableStr(body.title),
      description:  toNullableStr(body.description),
      isActive:     body.isActive !== undefined ? Boolean(body.isActive) : true,
      sortOrder:    nextSort,
      createdBy:    body.createdBy,
    });

    const saved = await repo().save(testimonial);
    return { data: saved };
  },

  update: async (id: number, body: Partial<UpdateTestimonialBody>) => {
    const testimonial = await repo().findOne({ where: { id } });
    if (!testimonial) return { notFound: true as const };

    if (body.type !== undefined && Object.values(TestimonialType).includes(body.type as TestimonialType))
      testimonial.type = body.type as TestimonialType;

    const nextType = testimonial.type;

    if (body.name !== undefined) {
      let nextName = String(body.name ?? "").trim();
      if (nextType === TestimonialType.VIDEO && !nextName) nextName = "Video";
      testimonial.name = nextName;
    } else if (nextType === TestimonialType.VIDEO && !String(testimonial.name ?? "").trim()) {
      testimonial.name = "Video";
    }

    if (body.videoUrl     !== undefined) testimonial.videoUrl     = body.videoUrl ? String(body.videoUrl).trim() : null;
    if (body.thumbnailUrl !== undefined) testimonial.thumbnailUrl = body.thumbnailUrl ? String(body.thumbnailUrl).trim() : null;
    if (body.role         !== undefined) testimonial.role         = toNullableStr(body.role);
    if (body.company      !== undefined) testimonial.company      = toNullableStr(body.company);
    if (body.title        !== undefined) testimonial.title        = toNullableStr(body.title);
    if (body.description  !== undefined) testimonial.description  = toNullableStr(body.description);
    if (body.isActive     !== undefined) testimonial.isActive     = Boolean(body.isActive);

    if (testimonial.type === TestimonialType.TEXT) testimonial.videoUrl = null;

    if (testimonial.type === TestimonialType.VIDEO && !String(testimonial.videoUrl ?? "").trim())
      return { badRequest: "videoUrl is required for video testimonials" as const };
    if (testimonial.type === TestimonialType.TEXT && !String(testimonial.name ?? "").trim())
      return { badRequest: "name is required for text testimonials" as const };

    const updated = await repo().save(testimonial);
    return { data: updated };
  },

  delete: async (id: number) => {
    const testimonial = await repo().findOne({ where: { id } });
    if (!testimonial) return { notFound: true as const };
    await repo().remove(testimonial);
    return { success: true as const };
  },
};
