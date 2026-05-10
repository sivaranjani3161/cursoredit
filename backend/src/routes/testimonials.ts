import { FastifyInstance } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Testimonial } from "../entities/Testimonial";
import { TestimonialType } from "../entities/enums/TestimonialType";

export default async function testimonialRoutes(app: FastifyInstance) {
  const testimonialRepo = AppDataSource.getRepository(Testimonial);

  app.get("/testimonials", async (_req, reply) => {
    try {
      const testimonials = await testimonialRepo.find({ order: { sortOrder: "ASC", createdAt: "DESC" } });
      return reply.send(testimonials);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch testimonials" });
    }
  });

  app.get<{ Params: { id: string } }>("/testimonials/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const testimonial = await testimonialRepo.findOne({ where: { id } });
      if (!testimonial) return reply.status(404).send({ error: "Testimonial not found" });
      return reply.send(testimonial);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch testimonial" });
    }
  });

  app.post("/testimonials", async (req, reply) => {
    try {
      const body = req.body as any;
      const createdBy = Number(body?.createdBy);
      if (Number.isNaN(createdBy)) {
        return reply.status(400).send({ error: "createdBy is required" });
      }

      const type = Object.values(TestimonialType).includes(body?.type)
        ? body.type
        : TestimonialType.TEXT;

      let name = String(body?.name ?? "").trim();
      const videoUrl = body?.videoUrl ? String(body.videoUrl).trim() : "";
      const thumbnailUrl = body?.thumbnailUrl ? String(body.thumbnailUrl).trim() : "";

      if (type === TestimonialType.VIDEO) {
        if (!videoUrl) {
          return reply.status(400).send({ error: "videoUrl is required for video testimonials" });
        }
        if (!name) name = "Video";
      } else {
        if (!name) {
          return reply.status(400).send({ error: "name is required for text testimonials" });
        }
      }

      const maxRow = await testimonialRepo
        .createQueryBuilder("t")
        .select("COALESCE(MAX(t.sortOrder), -1)", "maxSort")
        .getRawOne<{ maxSort: string }>();
      const nextSort = Number(maxRow?.maxSort ?? -1) + 1;

      const testimonial = testimonialRepo.create({
        type,
        videoUrl: type === TestimonialType.VIDEO ? videoUrl : null,
        thumbnailUrl: thumbnailUrl || null,
        name,
        role: body?.role ? String(body.role) : null,
        company: body?.company ? String(body.company) : null,
        title: body?.title ? String(body.title) : null,
        description: body?.description ? String(body.description) : null,
        isActive: body?.isActive ?? true,
        sortOrder: nextSort,
        createdBy,
      });

      const saved = await testimonialRepo.save(testimonial);
      return reply.status(201).send(saved);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to create testimonial" });
    }
  });

  app.put<{ Params: { id: string } }>("/testimonials/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const body = req.body as any;
      const testimonial = await testimonialRepo.findOne({ where: { id } });
      if (!testimonial) return reply.status(404).send({ error: "Testimonial not found" });

      if (body?.type !== undefined && Object.values(TestimonialType).includes(body.type)) {
        testimonial.type = body.type;
      }

      const nextType = testimonial.type;

      if (body?.name !== undefined) {
        let nextName = String(body.name ?? "").trim();
        if (nextType === TestimonialType.VIDEO && !nextName) nextName = "Video";
        testimonial.name = nextName;
      } else if (nextType === TestimonialType.VIDEO && !String(testimonial.name ?? "").trim()) {
        testimonial.name = "Video";
      }

      if (body?.videoUrl !== undefined) testimonial.videoUrl = body.videoUrl ? String(body.videoUrl).trim() : null;
      if (body?.thumbnailUrl !== undefined) testimonial.thumbnailUrl = body.thumbnailUrl ? String(body.thumbnailUrl).trim() : null;

      if (body?.role !== undefined) testimonial.role = body.role ? String(body.role) : null;
      if (body?.company !== undefined) testimonial.company = body.company ? String(body.company) : null;
      if (body?.title !== undefined) testimonial.title = body.title ? String(body.title) : null;
      if (body?.description !== undefined) testimonial.description = body.description ? String(body.description) : null;
      if (body?.isActive !== undefined) testimonial.isActive = Boolean(body.isActive);

      if (testimonial.type === TestimonialType.TEXT) {
        testimonial.videoUrl = null;
      }

      if (testimonial.type === TestimonialType.VIDEO && !String(testimonial.videoUrl ?? "").trim()) {
        return reply.status(400).send({ error: "videoUrl is required for video testimonials" });
      }
      if (testimonial.type === TestimonialType.TEXT && !String(testimonial.name ?? "").trim()) {
        return reply.status(400).send({ error: "name is required for text testimonials" });
      }

      const updated = await testimonialRepo.save(testimonial);
      return reply.send(updated);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to update testimonial" });
    }
  });

  app.delete<{ Params: { id: string } }>("/testimonials/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const testimonial = await testimonialRepo.findOne({ where: { id } });
      if (!testimonial) return reply.status(404).send({ error: "Testimonial not found" });
      await testimonialRepo.remove(testimonial);
      return reply.send({ success: true });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to delete testimonial" });
    }
  });
}
