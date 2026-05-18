import { AppDataSource } from "../../config/data-source";
import { Course } from "../../entities/Course";
import { CourseHighlight } from "../../entities/CourseHighlight";
import { CourseStructure } from "../../entities/CourseStructure";
import { CourseFeature } from "../../entities/CourseFeature";
import { mapNestedItems } from "../../shared/utils/mappers";
import { toNullableStr, toNullableInt } from "../../shared/utils/stringHelpers";
import { CreateCourseBody, UpdateCourseBody } from "./course.interface";

const courseRepo    = () => AppDataSource.getRepository(Course);
const highlightRepo = () => AppDataSource.getRepository(CourseHighlight);
const structureRepo = () => AppDataSource.getRepository(CourseStructure);
const featureRepo   = () => AppDataSource.getRepository(CourseFeature);

const RELATIONS = ["courseHighlights", "courseStructure", "courseFeatures"];

export const courseService = {
  findAll: async () =>
    courseRepo().find({ order: { createdAt: "DESC" } }),

  findActive: async () =>
    courseRepo().find({
      where: { isActive: true },
      select: ["id", "title", "slug", "description", "heroImage"],
      order: { createdAt: "ASC" },
    }),

  findBySlug: async (slug: string) => {
    const course = await courseRepo().findOne({ where: { slug, isActive: true }, relations: RELATIONS });
    if (!course) return null;
    course.courseHighlights.sort((a, b) => a.sortOrder - b.sortOrder);
    course.courseStructure.sort((a, b)  => a.sortOrder - b.sortOrder);
    course.courseFeatures.sort((a, b)   => a.sortOrder - b.sortOrder);
    return course;
  },

  findById: async (id: number) =>
    courseRepo().findOne({ where: { id }, relations: RELATIONS }),

  create: async (body: CreateCourseBody & { createdBy: number }) => {
    const slug = String(body.slug).trim();
    const existing = await courseRepo().findOne({ where: { slug } });
    if (existing) return { conflict: true as const };

    const course = courseRepo().create({
      title:      String(body.title).trim(),
      slug,
      description: toNullableStr(body.description),
      heroImage:   toNullableStr(body.heroImage),
      isActive:    body.isActive !== undefined ? Boolean(body.isActive) : true,
      categoryId:  toNullableInt(body.categoryId),
      createdBy:   body.createdBy,
      courseHighlights: mapNestedItems(Array.isArray(body.courseHighlights) ? body.courseHighlights : []) as unknown as CourseHighlight[],
      courseFeatures:   mapNestedItems(Array.isArray(body.courseFeatures)   ? body.courseFeatures   : []) as unknown as CourseFeature[],
      courseStructure:  mapNestedItems(Array.isArray(body.courseStructure)  ? body.courseStructure  : []) as unknown as CourseStructure[],
    });
    const saved = await courseRepo().save(course);
    return { data: saved };
  },

  update: async (id: number, body: Partial<UpdateCourseBody>) => {
    const existing = await courseRepo().findOne({ where: { id } });
    if (!existing) return { notFound: true as const };

    const updatePayload: Partial<Course> = {};
    if (body.title       !== undefined) updatePayload.title       = String(body.title).trim();
    if (body.description !== undefined) updatePayload.description = body.description as string | null;
    if (body.heroImage   !== undefined) updatePayload.heroImage   = body.heroImage   as string | null;
    if (body.isActive    !== undefined) updatePayload.isActive    = Boolean(body.isActive);
    if (body.categoryId  !== undefined) updatePayload.categoryId  = toNullableInt(body.categoryId);

    if (body.slug !== undefined) {
      const newSlug = String(body.slug).trim();
      if (newSlug !== existing.slug) {
        const conflict = await courseRepo().findOne({ where: { slug: newSlug } });
        if (conflict && conflict.id !== id) return { conflict: true as const };
      }
      updatePayload.slug = newSlug;
    }

    if (Object.keys(updatePayload).length > 0) await courseRepo().update(id, updatePayload);

    await highlightRepo().delete({ courseId: id });
    await structureRepo().delete({ courseId: id });
    await featureRepo().delete({ courseId: id });

    const highlights = mapNestedItems(Array.isArray(body.courseHighlights) ? body.courseHighlights : []);
    if (highlights.length)
      await highlightRepo().save(highlights.map((item) => highlightRepo().create({ ...item, courseId: id })));

    const structures = mapNestedItems(Array.isArray(body.courseStructure) ? body.courseStructure : []);
    if (structures.length)
      await structureRepo().save(structures.map((item) => structureRepo().create({ ...item, courseId: id })));

    const features = mapNestedItems(Array.isArray(body.courseFeatures) ? body.courseFeatures : []);
    if (features.length)
      await featureRepo().save(features.map((item) => featureRepo().create({ ...item, courseId: id })));

    const updated = await courseRepo().findOne({ where: { id }, relations: RELATIONS });
    return { data: updated };
  },

  delete: async (id: number) => {
    const course = await courseRepo().findOne({ where: { id } });
    if (!course) return { notFound: true as const };
    await highlightRepo().delete({ courseId: id });
    await structureRepo().delete({ courseId: id });
    await featureRepo().delete({ courseId: id });
    await courseRepo().remove(course);
    return { success: true as const };
  },
};
