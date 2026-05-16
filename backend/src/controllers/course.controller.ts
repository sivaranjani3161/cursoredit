import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Course } from "../entities/Course";
import { CourseHighlight } from "../entities/CourseHighlight";
import { CourseStructure } from "../entities/CourseStructure";
import { CourseFeature } from "../entities/CourseFeature";
import { CreateCourseBody, UpdateCourseBody, CourseIdParam, CourseSlugParam } from "../interfaces/course.interface";
import { mapNestedItems } from "../utils/mappers";
import { toNullableStr, toNullableInt } from "../utils/stringHelpers";
import { validateCreateCourse, validateUpdateCourse } from "../validators";

const courseRepo = () => AppDataSource.getRepository(Course);
const highlightRepo = () => AppDataSource.getRepository(CourseHighlight);
const structureRepo = () => AppDataSource.getRepository(CourseStructure);
const featureRepo = () => AppDataSource.getRepository(CourseFeature);


export async function getAllCourses(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const courses = await courseRepo().find({ order: { createdAt: "DESC" } });
    reply.send(courses);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch courses" });
  }
}

export async function getActiveCourses(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const courses = await courseRepo().find({
      where: { isActive: true },
      select: ["id", "title", "slug", "description", "heroImage"],
      order: { createdAt: "ASC" },
    });
    reply.send(courses);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch active courses" });
  }
}

export async function getCourseBySlug(
  req: FastifyRequest<{ Params: CourseSlugParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { slug } = req.params;
    const course = await courseRepo().findOne({
      where: { slug, isActive: true },
      relations: ["courseHighlights", "courseStructure", "courseFeatures"],
    });
    if (!course) { reply.status(404).send({ error: "Course not found" }); return; }

    course.courseHighlights.sort((a, b) => a.sortOrder - b.sortOrder);
    course.courseStructure.sort((a, b) => a.sortOrder - b.sortOrder);
    course.courseFeatures.sort((a, b) => a.sortOrder - b.sortOrder);
    reply.send(course);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch course" });
  }
}

export async function getCourseById(
  req: FastifyRequest<{ Params: CourseIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const course = await courseRepo().findOne({
      where: { id },
      relations: ["courseHighlights", "courseStructure", "courseFeatures"],
    });
    if (!course) { reply.status(404).send({ error: "Course not found" }); return; }
    reply.send(course);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch course" });
  }
}

export async function createCourse(
  req: FastifyRequest<{ Body: CreateCourseBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateCourse(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }

    const title = String(body.title).trim();
    const slug = String(body.slug).trim();
    const createdBy = Number(body.createdBy);

    const existing = await courseRepo().findOne({ where: { slug } });
    if (existing) { reply.status(409).send({ error: "Slug already exists" }); return; }

    const course = courseRepo().create({
      title,
      slug,
      description: toNullableStr(body?.description),
      heroImage: toNullableStr(body?.heroImage),
      isActive: body?.isActive !== undefined ? Boolean(body.isActive) : true,
      categoryId: toNullableInt(body?.categoryId),
      createdBy,
      courseHighlights: mapNestedItems(Array.isArray(body?.courseHighlights) ? (body.courseHighlights as unknown[]) : []) as unknown as CourseHighlight[],
      courseFeatures: mapNestedItems(Array.isArray(body?.courseFeatures) ? (body.courseFeatures as unknown[]) : []) as unknown as CourseFeature[],
      courseStructure: mapNestedItems(Array.isArray(body?.courseStructure) ? (body.courseStructure as unknown[]) : []) as unknown as CourseStructure[],
    });
    await courseRepo().save(course);
    reply.status(201).send(course);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to create course" });
  }
}

export async function updateCourse(
  req: FastifyRequest<{ Params: CourseIdParam; Body: UpdateCourseBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const body = req.body as unknown as Record<string, unknown>;

    const validation = validateUpdateCourse(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }

    const existing = await courseRepo().findOne({ where: { id } });
    if (!existing) { reply.status(404).send({ error: "Course not found" }); return; }

    // Build scalar-only update (no child tables involved)
    const updatePayload: Partial<Course> = {};
    if (body.title !== undefined) updatePayload.title = String(body.title).trim();
    if (body.description !== undefined) updatePayload.description = body.description as string | null;
    if (body.heroImage !== undefined) updatePayload.heroImage = body.heroImage as string | null;
    if (body.isActive !== undefined) updatePayload.isActive = Boolean(body.isActive);
    if (body.categoryId !== undefined) updatePayload.categoryId = toNullableInt(body.categoryId);

    if (body.slug !== undefined) {
      const newSlug = String(body.slug).trim();
      if (newSlug !== existing.slug) {
        const conflict = await courseRepo().findOne({ where: { slug: newSlug } });
        if (conflict && conflict.id !== id) {
          reply.status(409).send({ error: "Slug already exists" }); return;
        }
      }
      updatePayload.slug = String(body.slug).trim();
    }

    if (Object.keys(updatePayload).length > 0) {
      await courseRepo().update(id, updatePayload);
    }

    // Replace child rows
    await highlightRepo().delete({ courseId: id });
    await structureRepo().delete({ courseId: id });
    await featureRepo().delete({ courseId: id });

    const highlights = mapNestedItems(Array.isArray(body.courseHighlights) ? (body.courseHighlights as unknown[]) : []);
    if (highlights.length)
      await highlightRepo().save(highlights.map((item) => highlightRepo().create({ ...item, courseId: id })));

    const structures = mapNestedItems(Array.isArray(body.courseStructure) ? (body.courseStructure as unknown[]) : []);
    if (structures.length)
      await structureRepo().save(structures.map((item) => structureRepo().create({ ...item, courseId: id })));

    const features = mapNestedItems(Array.isArray(body.courseFeatures) ? (body.courseFeatures as unknown[]) : []);
    if (features.length)
      await featureRepo().save(features.map((item) => featureRepo().create({ ...item, courseId: id })));

    const updated = await courseRepo().findOne({
      where: { id },
      relations: ["courseHighlights", "courseStructure", "courseFeatures"],
    });
    reply.send(updated);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to update course" });
  }
}

export async function deleteCourse(
  req: FastifyRequest<{ Params: CourseIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const course = await courseRepo().findOne({ where: { id } });
    if (!course) { reply.status(404).send({ error: "Course not found" }); return; }

    await highlightRepo().delete({ courseId: id });
    await structureRepo().delete({ courseId: id });
    await featureRepo().delete({ courseId: id });
    await courseRepo().remove(course);
    reply.send({ success: true });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to delete course" });
  }
}
