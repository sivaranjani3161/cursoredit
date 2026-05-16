import { FastifyRequest, FastifyReply } from "fastify";
import { AppDataSource } from "../config/data-source";
import { CourseCategory } from "../entities/CourseCategory";
import {
  CreateCourseCategoryBody,
  UpdateCourseCategoryBody,
  CourseCategoryIdParam,
} from "../interfaces/courseCategory.interface";
import { slugify } from "../utils/slugify";
import { toNullableStr } from "../utils/stringHelpers";
import { validateCreateCourseCategory } from "../validators";

const repo = () => AppDataSource.getRepository(CourseCategory);

export async function getAllCategories(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const cats = await repo().find({ order: { sortOrder: "ASC", name: "ASC" } });
    reply.send(cats);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch categories" });
  }
}

export async function getCategoriesWithCourses(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const cats = await repo().find({
      order: { sortOrder: "ASC", name: "ASC" },
      relations: ["courses"],
    });
    const result = cats.map((cat) => ({
      ...cat,
      courses: (cat.courses || [])
        .filter((c) => c.isActive)
        .map((c) => ({ id: c.id, title: c.title, slug: c.slug })),
    }));
    reply.send(result);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch categories with courses" });
  }
}

export async function createCategory(
  req: FastifyRequest<{ Body: CreateCourseCategoryBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateCourseCategory(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors }); return;
    }

    const name = String(body.name).trim();
    const slug = body?.slug ? String(body.slug).trim() : slugify(name);

    const existing = await repo().findOne({ where: { slug } });
    if (existing) { reply.status(409).send({ error: "Category with this slug already exists" }); return; }

    const cat = repo().create({
      name,
      slug,
      description: toNullableStr(body?.description),
      sortOrder: body?.sortOrder !== undefined ? Number(body.sortOrder) : 0,
    });
    await repo().save(cat);
    reply.status(201).send(cat);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to create category" });
  }
}

export async function updateCategory(
  req: FastifyRequest<{ Params: CourseCategoryIdParam; Body: UpdateCourseCategoryBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const body = req.body as unknown as Record<string, unknown>;

    const cat = await repo().findOne({ where: { id } });
    if (!cat) { reply.status(404).send({ error: "Category not found" }); return; }

    if (body.name !== undefined) cat.name = String(body.name).trim();
    if (body.slug !== undefined) cat.slug = String(body.slug).trim();
    if (body.description !== undefined) cat.description = toNullableStr(body.description);
    if (body.sortOrder !== undefined) cat.sortOrder = Number(body.sortOrder);

    await repo().save(cat);
    reply.send(cat);
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to update category" });
  }
}

export async function deleteCategory(
  req: FastifyRequest<{ Params: CourseCategoryIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const cat = await repo().findOne({ where: { id } });
    if (!cat) { reply.status(404).send({ error: "Category not found" }); return; }
    await repo().remove(cat);
    reply.send({ success: true });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to delete category" });
  }
}
