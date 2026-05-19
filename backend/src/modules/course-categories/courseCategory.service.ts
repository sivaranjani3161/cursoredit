import { AppDataSource } from "../../config/data-source";
import { CourseCategory } from "../../entities/CourseCategory";
import { slugify } from "../../shared/utils/slugify";
import { toNullableStr } from "../../shared/utils/stringHelpers";
import { CreateCourseCategoryBody, UpdateCourseCategoryBody } from "./courseCategory.interface";

const repo = () => AppDataSource.getRepository(CourseCategory);

export const courseCategoryService = {
  findAll: async () =>
    repo().find({ order: { sortOrder: "ASC", name: "ASC" } }),

  findAllWithCourses: async () => {
    const cats = await repo().find({ order: { sortOrder: "ASC", name: "ASC" }, relations: ["courses"] });
    return cats.map((cat) => ({
      ...cat,
      courses: (cat.courses || [])
        .filter((c) => c.isActive)
        .map((c) => ({ id: c.id, title: c.title, slug: c.slug })),
    }));
  },

  create: async (body: CreateCourseCategoryBody) => {
    const name = String(body.name).trim();
    const slug = body.slug ? String(body.slug).trim() : slugify(name);

    const existing = await repo().findOne({ where: { slug } });
    if (existing) return { conflict: true as const };

    const cat = repo().create({
      name,
      slug,
      description: toNullableStr(body.description),
      sortOrder:   body.sortOrder !== undefined ? Number(body.sortOrder) : 0,
    });
    await repo().save(cat);
    return { data: cat };
  },

  update: async (id: number, body: Partial<UpdateCourseCategoryBody>) => {
    const cat = await repo().findOne({ where: { id } });
    if (!cat) return { notFound: true as const };
    if (body.name        !== undefined) cat.name        = String(body.name).trim();
    if (body.slug        !== undefined) cat.slug        = String(body.slug).trim();
    if (body.description !== undefined) cat.description = toNullableStr(body.description);
    if (body.sortOrder   !== undefined) cat.sortOrder   = Number(body.sortOrder);
    await repo().save(cat);
    return { data: cat };
  },

  delete: async (id: number) => {
    const cat = await repo().findOne({ where: { id } });
    if (!cat) return { notFound: true as const };
    await repo().remove(cat);
    return { success: true as const };
  },
};
