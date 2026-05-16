import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Testimonial } from "../entities/Testimonial";
import { TestimonialType } from "../entities/enums/TestimonialType";
import { CreateTestimonialBody, UpdateTestimonialBody, TestimonialIdParam } from "../interfaces/testimonial.interface";
import { toNullableStr } from "../utils/stringHelpers";
import { validateCreateTestimonial } from "../validators";

const repo = () => AppDataSource.getRepository(Testimonial);

export async function getAllTestimonials(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const testimonials = await repo().find({ order: { sortOrder: "ASC", createdAt: "DESC" } });
    reply.send(testimonials);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch testimonials" });
  }
}

export async function getTestimonialById(
  req: FastifyRequest<{ Params: TestimonialIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const testimonial = await repo().findOne({ where: { id } });
    if (!testimonial) { reply.status(404).send({ error: "Testimonial not found" }); return; }
    reply.send(testimonial);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch testimonial" });
  }
}

export async function createTestimonial(
  req: FastifyRequest<{ Body: CreateTestimonialBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateTestimonial(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }

    const createdBy = Number(body.createdBy);
    const type = Object.values(TestimonialType).includes(body?.type as TestimonialType)
      ? (body.type as TestimonialType)
      : TestimonialType.TEXT;

    const videoUrl = String(body?.videoUrl ?? "").trim();
    const thumbnailUrl = String(body?.thumbnailUrl ?? "").trim();
    let name = String(body?.name ?? "").trim();

    if (type === TestimonialType.VIDEO) {
      if (!videoUrl) { reply.status(400).send({ error: "videoUrl is required for video testimonials" }); return; }
      if (!name) name = "Video";
    } else {
      if (!name) { reply.status(400).send({ error: "name is required for text testimonials" }); return; }
    }

    const maxRow = await repo()
      .createQueryBuilder("t")
      .select("COALESCE(MAX(t.sortOrder), -1)", "maxSort")
      .getRawOne<{ maxSort: string }>();
    const nextSort = Number(maxRow?.maxSort ?? -1) + 1;

    const testimonial = repo().create({
      type,
      videoUrl: type === TestimonialType.VIDEO ? videoUrl : null,
      thumbnailUrl: thumbnailUrl || null,
      name,
      role: toNullableStr(body?.role),
      company: toNullableStr(body?.company),
      title: toNullableStr(body?.title),
      description: toNullableStr(body?.description),
      isActive: body?.isActive !== undefined ? Boolean(body.isActive) : true,
      sortOrder: nextSort,
      createdBy,
    });

    const saved = await repo().save(testimonial);
    reply.status(201).send(saved);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to create testimonial" });
  }
}

export async function updateTestimonial(
  req: FastifyRequest<{ Params: TestimonialIdParam; Body: UpdateTestimonialBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const body = req.body as unknown as Record<string, unknown>;

    const testimonial = await repo().findOne({ where: { id } });
    if (!testimonial) { reply.status(404).send({ error: "Testimonial not found" }); return; }

    if (body?.type !== undefined && Object.values(TestimonialType).includes(body.type as TestimonialType))
      testimonial.type = body.type as TestimonialType;

    const nextType = testimonial.type;

    if (body?.name !== undefined) {
      let nextName = String(body.name ?? "").trim();
      if (nextType === TestimonialType.VIDEO && !nextName) nextName = "Video";
      testimonial.name = nextName;
    } else if (nextType === TestimonialType.VIDEO && !String(testimonial.name ?? "").trim()) {
      testimonial.name = "Video";
    }

    if (body?.videoUrl !== undefined)
      testimonial.videoUrl = body.videoUrl ? String(body.videoUrl).trim() : null;
    if (body?.thumbnailUrl !== undefined)
      testimonial.thumbnailUrl = body.thumbnailUrl ? String(body.thumbnailUrl).trim() : null;
    if (body?.role !== undefined) testimonial.role = toNullableStr(body.role);
    if (body?.company !== undefined) testimonial.company = toNullableStr(body.company);
    if (body?.title !== undefined) testimonial.title = toNullableStr(body.title);
    if (body?.description !== undefined) testimonial.description = toNullableStr(body.description);
    if (body?.isActive !== undefined) testimonial.isActive = Boolean(body.isActive);

    if (testimonial.type === TestimonialType.TEXT) testimonial.videoUrl = null;

    if (testimonial.type === TestimonialType.VIDEO && !String(testimonial.videoUrl ?? "").trim()) {
      reply.status(400).send({ error: "videoUrl is required for video testimonials" }); return;
    }
    if (testimonial.type === TestimonialType.TEXT && !String(testimonial.name ?? "").trim()) {
      reply.status(400).send({ error: "name is required for text testimonials" }); return;
    }

    const updated = await repo().save(testimonial);
    reply.send(updated);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to update testimonial" });
  }
}

export async function deleteTestimonial(
  req: FastifyRequest<{ Params: TestimonialIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const testimonial = await repo().findOne({ where: { id } });
    if (!testimonial) { reply.status(404).send({ error: "Testimonial not found" }); return; }
    await repo().remove(testimonial);
    reply.send({ success: true });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to delete testimonial" });
  }
}
