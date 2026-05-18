import { FastifyRequest, FastifyReply } from "fastify";
import { courseCategoryService } from "./courseCategory.service";
import { validateCreateCourseCategory } from "./courseCategory.validator";
import { CourseCategoryIdParam, CreateCourseCategoryBody, UpdateCourseCategoryBody } from "./courseCategory.interface";

export async function getAllCategories(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await courseCategoryService.findAll()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch categories" }); }
}

export async function getCategoriesWithCourses(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await courseCategoryService.findAllWithCourses()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch categories" }); }
}

export async function createCategory(req: FastifyRequest<{ Body: CreateCourseCategoryBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateCourseCategory(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }
    const result = await courseCategoryService.create(body as unknown as CreateCourseCategoryBody);
    if ("conflict" in result) { reply.status(409).send({ error: "Category with this slug already exists" }); return; }
    reply.status(201).send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to create category" }); }
}

export async function updateCategory(req: FastifyRequest<{ Params: CourseCategoryIdParam; Body: UpdateCourseCategoryBody }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await courseCategoryService.update(Number(req.params.id), req.body as Partial<UpdateCourseCategoryBody>);
    if ("notFound" in result) { reply.status(404).send({ error: "Category not found" }); return; }
    reply.send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to update category" }); }
}

export async function deleteCategory(req: FastifyRequest<{ Params: CourseCategoryIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await courseCategoryService.delete(Number(req.params.id));
    if ("notFound" in result) { reply.status(404).send({ error: "Category not found" }); return; }
    reply.send({ success: true });
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to delete category" }); }
}
