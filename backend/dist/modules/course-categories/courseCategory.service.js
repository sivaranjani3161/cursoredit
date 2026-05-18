"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseCategoryService = void 0;
const data_source_1 = require("../../config/data-source");
const CourseCategory_1 = require("../../entities/CourseCategory");
const slugify_1 = require("../../shared/utils/slugify");
const stringHelpers_1 = require("../../shared/utils/stringHelpers");
const repo = () => data_source_1.AppDataSource.getRepository(CourseCategory_1.CourseCategory);
exports.courseCategoryService = {
    findAll: async () => repo().find({ order: { sortOrder: "ASC", name: "ASC" } }),
    findAllWithCourses: async () => {
        const cats = await repo().find({ order: { sortOrder: "ASC", name: "ASC" }, relations: ["courses"] });
        return cats.map((cat) => ({
            ...cat,
            courses: (cat.courses || [])
                .filter((c) => c.isActive)
                .map((c) => ({ id: c.id, title: c.title, slug: c.slug })),
        }));
    },
    create: async (body) => {
        const name = String(body.name).trim();
        const slug = body.slug ? String(body.slug).trim() : (0, slugify_1.slugify)(name);
        const existing = await repo().findOne({ where: { slug } });
        if (existing)
            return { conflict: true };
        const cat = repo().create({
            name,
            slug,
            description: (0, stringHelpers_1.toNullableStr)(body.description),
            sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : 0,
        });
        await repo().save(cat);
        return { data: cat };
    },
    update: async (id, body) => {
        const cat = await repo().findOne({ where: { id } });
        if (!cat)
            return { notFound: true };
        if (body.name !== undefined)
            cat.name = String(body.name).trim();
        if (body.slug !== undefined)
            cat.slug = String(body.slug).trim();
        if (body.description !== undefined)
            cat.description = (0, stringHelpers_1.toNullableStr)(body.description);
        if (body.sortOrder !== undefined)
            cat.sortOrder = Number(body.sortOrder);
        await repo().save(cat);
        return { data: cat };
    },
    delete: async (id) => {
        const cat = await repo().findOne({ where: { id } });
        if (!cat)
            return { notFound: true };
        await repo().remove(cat);
        return { success: true };
    },
};
