import { FastifyRequest, FastifyReply } from "fastify";
import { courseService } from "./course.service";
import { validateCreateCourse, validateUpdateCourse } from "./course.validator";
import { CourseIdParam, CourseSlugParam, CreateCourseBody, UpdateCourseBody } from "./course.interface";

export async function getAllCourses(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await courseService.findAll()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch courses" }); }
}

export async function getActiveCourses(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await courseService.findActive()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch active courses" }); }
}

export async function getCourseBySlug(req: FastifyRequest<{ Params: CourseSlugParam }>, reply: FastifyReply): Promise<void> {
  try {
    const course = await courseService.findBySlug(req.params.slug);
    if (!course) { reply.status(404).send({ error: "Course not found" }); return; }
    reply.send(course);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch course" }); }
}

export async function getCourseById(req: FastifyRequest<{ Params: CourseIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const course = await courseService.findById(Number(req.params.id));
    if (!course) { reply.status(404).send({ error: "Course not found" }); return; }
    reply.send(course);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch course" }); }
}

export async function createCourse(req: FastifyRequest<{ Body: CreateCourseBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateCourse(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await courseService.create({ ...(body as unknown as CreateCourseBody & { createdBy: number }), createdBy: Number(body.createdBy) });
    if ("conflict" in result) { reply.status(409).send({ error: "Slug already exists" }); return; }
    reply.status(201).send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to create course" }); }
}

export async function updateCourse(req: FastifyRequest<{ Params: CourseIdParam; Body: UpdateCourseBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateUpdateCourse(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await courseService.update(Number(req.params.id), body as Partial<UpdateCourseBody>);
    if ("notFound" in result) { reply.status(404).send({ error: "Course not found" }); return; }
    if ("conflict" in result) { reply.status(409).send({ error: "Slug already exists" }); return; }
    reply.send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to update course" }); }
}

export async function deleteCourse(req: FastifyRequest<{ Params: CourseIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await courseService.delete(Number(req.params.id));
    if ("notFound" in result) { reply.status(404).send({ error: "Course not found" }); return; }
    reply.send({ success: true });
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to delete course" }); }
}
