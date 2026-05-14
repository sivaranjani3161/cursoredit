import { FastifyInstance } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Course } from "../entities/Course";
import { CourseHighlight } from "../entities/CourseHighlight";
import { CourseStructure } from "../entities/CourseStructure";
import { CourseFeature } from "../entities/CourseFeature";

export default async function courseRoutes(app: FastifyInstance) {
  const courseRepo    = AppDataSource.getRepository(Course);
  const highlightRepo = AppDataSource.getRepository(CourseHighlight);
  const structureRepo = AppDataSource.getRepository(CourseStructure);
  const featureRepo   = AppDataSource.getRepository(CourseFeature);

  /** Normalize incoming nested-entity arrays from the admin form */
  const mapNestedItems = (arr: any[]) =>
    Array.isArray(arr)
      ? arr
          .map((item: any) => ({
            title: String(item?.title ?? "").trim(),
            description: Array.isArray(item?.description)
              ? item.description.map((p: any) => String(p ?? "").trim()).filter(Boolean)
              : [],
            icon: item?.icon ? String(item.icon) : null,
            phaseNumber:
              item?.phaseNumber !== undefined && item?.phaseNumber !== null
                ? Number(item.phaseNumber)
                : undefined,
            sortOrder:
              item?.sortOrder !== undefined && item?.sortOrder !== null
                ? Number(item.sortOrder)
                : 0,
          }))
          .filter((item: any) => item.title.length > 0)
      : [];

  /*
    GET /api/courses
    Get all courses (admin listing)
  */
  app.get("/courses", async (_req, reply) => {
    try {
      const courses = await courseRepo.find({ order: { createdAt: "DESC" } });
      return reply.send(courses);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to fetch courses" });
    }
  });

  /*
    POST /api/courses
    Create new course with related entities
  */
  app.post("/courses", async (req, reply) => {
    try {
      const body = req.body as any;
      const title     = String(body?.title ?? "").trim();
      const slug      = String(body?.slug  ?? "").trim();
      const createdBy = Number(body?.createdBy);

      if (!title || !slug || Number.isNaN(createdBy)) {
        return reply.status(400).send({ error: "title, slug and createdBy are required" });
      }

      const existing = await courseRepo.findOne({ where: { slug } });
      if (existing) {
        return reply.status(400).send({ error: "Slug already exists" });
      }

      const course = courseRepo.create({
        title,
        slug,
        description: body?.description ? String(body.description) : null,
        heroImage:   body?.heroImage   ? String(body.heroImage)   : null,
        isActive:    body?.isActive    ?? true,
        createdBy,
        courseHighlights: mapNestedItems(body?.courseHighlights) as any,
        courseFeatures:   mapNestedItems(body?.courseFeatures)   as any,
        courseStructure:  mapNestedItems(body?.courseStructure)  as any,
      });
      await courseRepo.save(course);

      return reply.status(201).send(course);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to create course" });
    }
  });

  /*
    GET /api/courses/active
    Lightweight list of active courses — used by portfolio & enquiry modal dropdown.
    MUST be registered before /courses/:id so "active" isn't parsed as an id.
  */
  app.get("/courses/active", async (_req, reply) => {
    try {
      const courses = await courseRepo.find({
        where:  { isActive: true },
        select: ["id", "title", "slug", "description", "heroImage"],
        order:  { createdAt: "ASC" },
      });
      return reply.send(courses);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to fetch active courses" });
    }
  });

  /*
    GET /api/courses/slug/:slug
    Full course data by slug — used by portfolio detail page.
    MUST be registered before /courses/:id.
  */
  app.get<{ Params: { slug: string } }>("/courses/slug/:slug", async (req, reply) => {
    try {
      const { slug } = req.params;
      const course = await courseRepo.findOne({
        where:     { slug, isActive: true },
        relations: ["courseHighlights", "courseStructure", "courseFeatures"],
      });
      if (!course) return reply.status(404).send({ error: "Course not found" });

      course.courseHighlights.sort((a, b) => a.sortOrder - b.sortOrder);
      course.courseStructure.sort((a, b)  => a.sortOrder - b.sortOrder);
      course.courseFeatures.sort((a, b)   => a.sortOrder - b.sortOrder);
      return reply.send(course);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to fetch course" });
    }
  });

  /*
    GET /api/courses/:id
    Single course with all relations — used by admin edit form.
  */
  app.get<{ Params: { id: string } }>("/courses/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const course = await courseRepo.findOne({
        where:     { id },
        relations: ["courseHighlights", "courseStructure", "courseFeatures"],
      });
      if (!course) return reply.status(404).send({ error: "Course not found" });
      return reply.send(course);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to fetch course" });
    }
  });

  /*
    PUT /api/courses/:id
    ─────────────────────────────────────────────────────────────────────
    Strategy: use courseRepo.update() for scalar fields, then explicitly
    delete old children and insert fresh ones with courseId.

    WHY NOT courseRepo.save(course)?
    Even with course.courseHighlights = [], TypeORM's cascade orphan handler
    still issues:  UPDATE course_highlights SET course_id = NULL WHERE id = ?
    before deleting — which violates the NOT NULL constraint.

    courseRepo.update() does a plain: UPDATE courses SET ... WHERE id = ?
    with zero knowledge of child tables, completely safe.
    ─────────────────────────────────────────────────────────────────────
  */
  app.put<{ Params: { id: string } }>("/courses/:id", async (req, reply) => {
    try {
      const id   = Number(req.params.id);
      const body = req.body as any;

      // Verify course exists
      const existing = await courseRepo.findOne({ where: { id } });
      if (!existing) return reply.status(404).send({ error: "Course not found" });

      // ── 1. Build scalar update payload ─────────────────────────────
      const updatePayload: Partial<typeof existing> = {};
      if (body.title       !== undefined) updatePayload.title       = String(body.title).trim();
      if (body.description !== undefined) updatePayload.description = body.description;
      if (body.heroImage   !== undefined) updatePayload.heroImage   = body.heroImage;
      if (body.isActive    !== undefined) updatePayload.isActive    = body.isActive;

      if (body.slug !== undefined) {
        const newSlug = String(body.slug).trim();
        if (newSlug !== existing.slug) {
          const conflict = await courseRepo.findOne({ where: { slug: newSlug } });
          if (conflict && conflict.id !== id) {
            return reply.status(400).send({ error: "Slug already exists" });
          }
          updatePayload.slug = newSlug;
        }
      }

      // Direct SQL UPDATE — no cascade, no child-table involvement at all
      if (Object.keys(updatePayload).length > 0) {
        await courseRepo.update(id, updatePayload);
      }

      // ── 2. Delete ALL old child rows for this course ────────────────
      await highlightRepo.delete({ courseId: id });
      await structureRepo.delete({ courseId: id });
      await featureRepo.delete({ courseId: id });

      // ── 3. Insert fresh children with explicit courseId ─────────────
      const highlights = mapNestedItems(body.courseHighlights ?? []);
      if (highlights.length > 0) {
        await highlightRepo.save(
          highlights.map((item) => highlightRepo.create({ ...item, courseId: id }))
        );
      }

      const structures = mapNestedItems(body.courseStructure ?? []);
      if (structures.length > 0) {
        await structureRepo.save(
          structures.map((item) => structureRepo.create({ ...item, courseId: id }))
        );
      }

      const features = mapNestedItems(body.courseFeatures ?? []);
      if (features.length > 0) {
        await featureRepo.save(
          features.map((item) => featureRepo.create({ ...item, courseId: id }))
        );
      }

      // ── 4. Return updated course with fresh relations ───────────────
      const updated = await courseRepo.findOne({
        where:     { id },
        relations: ["courseHighlights", "courseStructure", "courseFeatures"],
      });
      return reply.send(updated);
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      return reply.status(500).send({ error: "Failed to update course" });
    }
  });

  /*
    DELETE /api/courses/:id
    Explicitly deletes children first to avoid FK constraint issues,
    then removes the parent course.
  */
  app.delete<{ Params: { id: string } }>("/courses/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);

      const course = await courseRepo.findOne({ where: { id } });
      if (!course) return reply.status(404).send({ error: "Course not found" });

      // Delete children explicitly (DB cascade will also handle this, but being explicit is safer)
      await highlightRepo.delete({ courseId: id });
      await structureRepo.delete({ courseId: id });
      await featureRepo.delete({ courseId: id });

      await courseRepo.remove(course);
      return reply.send({ success: true });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to delete course" });
    }
  });
}