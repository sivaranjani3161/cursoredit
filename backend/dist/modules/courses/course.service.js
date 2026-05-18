"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseService = void 0;
const data_source_1 = require("../../config/data-source");
const Course_1 = require("../../entities/Course");
const CourseHighlight_1 = require("../../entities/CourseHighlight");
const CourseStructure_1 = require("../../entities/CourseStructure");
const CourseFeature_1 = require("../../entities/CourseFeature");
const mappers_1 = require("../../shared/utils/mappers");
const stringHelpers_1 = require("../../shared/utils/stringHelpers");
const courseRepo = () => data_source_1.AppDataSource.getRepository(Course_1.Course);
const highlightRepo = () => data_source_1.AppDataSource.getRepository(CourseHighlight_1.CourseHighlight);
const structureRepo = () => data_source_1.AppDataSource.getRepository(CourseStructure_1.CourseStructure);
const featureRepo = () => data_source_1.AppDataSource.getRepository(CourseFeature_1.CourseFeature);
const RELATIONS = ["courseHighlights", "courseStructure", "courseFeatures"];
exports.courseService = {
    findAll: async () => courseRepo().find({ order: { createdAt: "DESC" } }),
    findActive: async () => courseRepo().find({
        where: { isActive: true },
        select: ["id", "title", "slug", "description", "heroImage"],
        order: { createdAt: "ASC" },
    }),
    findBySlug: async (slug) => {
        const course = await courseRepo().findOne({ where: { slug, isActive: true }, relations: RELATIONS });
        if (!course)
            return null;
        course.courseHighlights.sort((a, b) => a.sortOrder - b.sortOrder);
        course.courseStructure.sort((a, b) => a.sortOrder - b.sortOrder);
        course.courseFeatures.sort((a, b) => a.sortOrder - b.sortOrder);
        return course;
    },
    findById: async (id) => courseRepo().findOne({ where: { id }, relations: RELATIONS }),
    create: async (body) => {
        const slug = String(body.slug).trim();
        const existing = await courseRepo().findOne({ where: { slug } });
        if (existing)
            return { conflict: true };
        const course = courseRepo().create({
            title: String(body.title).trim(),
            slug,
            description: (0, stringHelpers_1.toNullableStr)(body.description),
            heroImage: (0, stringHelpers_1.toNullableStr)(body.heroImage),
            isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
            categoryId: (0, stringHelpers_1.toNullableInt)(body.categoryId),
            createdBy: body.createdBy,
            courseHighlights: (0, mappers_1.mapNestedItems)(Array.isArray(body.courseHighlights) ? body.courseHighlights : []),
            courseFeatures: (0, mappers_1.mapNestedItems)(Array.isArray(body.courseFeatures) ? body.courseFeatures : []),
            courseStructure: (0, mappers_1.mapNestedItems)(Array.isArray(body.courseStructure) ? body.courseStructure : []),
        });
        const saved = await courseRepo().save(course);
        return { data: saved };
    },
    update: async (id, body) => {
        const existing = await courseRepo().findOne({ where: { id } });
        if (!existing)
            return { notFound: true };
        const updatePayload = {};
        if (body.title !== undefined)
            updatePayload.title = String(body.title).trim();
        if (body.description !== undefined)
            updatePayload.description = body.description;
        if (body.heroImage !== undefined)
            updatePayload.heroImage = body.heroImage;
        if (body.isActive !== undefined)
            updatePayload.isActive = Boolean(body.isActive);
        if (body.categoryId !== undefined)
            updatePayload.categoryId = (0, stringHelpers_1.toNullableInt)(body.categoryId);
        if (body.slug !== undefined) {
            const newSlug = String(body.slug).trim();
            if (newSlug !== existing.slug) {
                const conflict = await courseRepo().findOne({ where: { slug: newSlug } });
                if (conflict && conflict.id !== id)
                    return { conflict: true };
            }
            updatePayload.slug = newSlug;
        }
        if (Object.keys(updatePayload).length > 0)
            await courseRepo().update(id, updatePayload);
        await highlightRepo().delete({ courseId: id });
        await structureRepo().delete({ courseId: id });
        await featureRepo().delete({ courseId: id });
        const highlights = (0, mappers_1.mapNestedItems)(Array.isArray(body.courseHighlights) ? body.courseHighlights : []);
        if (highlights.length)
            await highlightRepo().save(highlights.map((item) => highlightRepo().create({ ...item, courseId: id })));
        const structures = (0, mappers_1.mapNestedItems)(Array.isArray(body.courseStructure) ? body.courseStructure : []);
        if (structures.length)
            await structureRepo().save(structures.map((item) => structureRepo().create({ ...item, courseId: id })));
        const features = (0, mappers_1.mapNestedItems)(Array.isArray(body.courseFeatures) ? body.courseFeatures : []);
        if (features.length)
            await featureRepo().save(features.map((item) => featureRepo().create({ ...item, courseId: id })));
        const updated = await courseRepo().findOne({ where: { id }, relations: RELATIONS });
        return { data: updated };
    },
    delete: async (id) => {
        const course = await courseRepo().findOne({ where: { id } });
        if (!course)
            return { notFound: true };
        await highlightRepo().delete({ courseId: id });
        await structureRepo().delete({ courseId: id });
        await featureRepo().delete({ courseId: id });
        await courseRepo().remove(course);
        return { success: true };
    },
};
