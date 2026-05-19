"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = courseRoutes;
const data_source_1 = require("../config/data-source");
const Course_1 = require("../entities/Course");
async function courseRoutes(app) {
    const courseRepo = data_source_1.AppDataSource.getRepository(Course_1.Course);
    const mapNestedItems = (arr) => Array.isArray(arr)
        ? arr
            .map((item) => ({
            id: item?.id ? Number(item.id) : undefined,
            title: String(item?.title ?? "").trim(),
            description: Array.isArray(item?.description)
                ? item.description.map((part) => String(part ?? "").trim()).filter(Boolean)
                : [],
            icon: item?.icon ? String(item.icon) : null,
            phaseNumber: item?.phaseNumber !== undefined && item?.phaseNumber !== null
                ? Number(item.phaseNumber)
                : undefined,
            sortOrder: item?.sortOrder !== undefined && item?.sortOrder !== null
                ? Number(item.sortOrder)
                : 0,
        }))
            .filter((item) => item.title.length > 0)
        : [];
    /*
      GET /api/courses
      Get all courses
    */
    app.get("/courses", async (req, reply) => {
        try {
            const courses = await courseRepo.find({
                order: {
                    createdAt: "DESC",
                },
            });
            return reply.send(courses);
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "Failed to fetch courses",
            });
        }
    });
    /*
      POST /api/courses
      Create new course with related entities
    */
    app.post("/courses", async (req, reply) => {
        try {
            const body = req.body;
            const title = String(body?.title ?? "").trim();
            const slug = String(body?.slug ?? "").trim();
            const createdBy = Number(body?.createdBy);
            if (!title || !slug || Number.isNaN(createdBy)) {
                return reply.status(400).send({ error: "title, slug and createdBy are required" });
            }
            const existing = await courseRepo.findOne({
                where: {
                    slug,
                },
            });
            if (existing) {
                return reply.status(400).send({
                    error: "Slug already exists",
                });
            }
            const course = courseRepo.create({
                title,
                slug,
                description: body?.description ? String(body.description) : null,
                heroImage: body?.heroImage ? String(body.heroImage) : null,
                isActive: body?.isActive ?? true,
                createdBy,
                courseHighlights: mapNestedItems(body?.courseHighlights),
                courseFeatures: mapNestedItems(body?.courseFeatures),
                courseStructure: mapNestedItems(body?.courseStructure),
            });
            await courseRepo.save(course);
            return reply.status(201).send(course);
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "Failed to create course",
            });
        }
    });
    /*
      GET /api/courses/active
      Get all active courses (basic info for dropdowns / listings)
      NOTE: must be registered BEFORE /courses/:id to avoid "active" being treated as an id
    */
    app.get("/courses/active", async (req, reply) => {
        try {
            const courses = await courseRepo.find({
                where: { isActive: true },
                select: ["id", "title", "slug", "description", "heroImage"],
                order: { createdAt: "ASC" },
            });
            return reply.send(courses);
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Failed to fetch active courses" });
        }
    });
    /*
      GET /api/courses/slug/:slug
      Get single course by slug with full relations (used by portfolio)
    */
    app.get("/courses/slug/:slug", async (req, reply) => {
        try {
            const { slug } = req.params;
            const course = await courseRepo.findOne({
                where: { slug, isActive: true },
                relations: ["courseHighlights", "courseStructure", "courseFeatures"],
            });
            if (!course) {
                return reply.status(404).send({ error: "Course not found" });
            }
            // Sort nested arrays by sortOrder
            if (course.courseHighlights)
                course.courseHighlights.sort((a, b) => a.sortOrder - b.sortOrder);
            if (course.courseStructure)
                course.courseStructure.sort((a, b) => a.sortOrder - b.sortOrder);
            if (course.courseFeatures)
                course.courseFeatures.sort((a, b) => a.sortOrder - b.sortOrder);
            return reply.send(course);
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Failed to fetch course" });
        }
    });
    /*
      GET /api/courses/:id
      Get single course with relations
    */
    app.get("/courses/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const course = await courseRepo.findOne({
                where: { id },
                relations: ["courseHighlights", "courseStructure", "courseFeatures"],
            });
            if (!course) {
                return reply.status(404).send({
                    error: "Course not found",
                });
            }
            return reply.send(course);
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "Failed to fetch course",
            });
        }
    });
    /*
      PUT /api/courses/:id
      Update course and explicitly replace nested entities via cascade.
      TypeORM cascade-saves child arrays when we assign them on the parent entity.
      We clear the old children first (by loading with relations), then assign
      fresh items from the request body — old rows without an id will be
      inserted; rows with an existing id will be updated.
    */
    app.put("/courses/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const body = req.body;
            const normalizedSlug = body.slug !== undefined ? String(body.slug ?? "").trim() : undefined;
            const course = await courseRepo.findOne({
                where: { id },
                relations: ["courseHighlights", "courseStructure", "courseFeatures"],
            });
            if (!course) {
                return reply.status(404).send({
                    error: "Course not found",
                });
            }
            // Update flat scalar fields
            course.title = body.title ?? course.title;
            if (normalizedSlug !== undefined && normalizedSlug !== course.slug) {
                const slugExists = await courseRepo.findOne({ where: { slug: normalizedSlug } });
                if (slugExists && slugExists.id !== id) {
                    return reply.status(400).send({ error: "Slug already exists" });
                }
                course.slug = normalizedSlug;
            }
            course.description = body.description ?? course.description;
            course.heroImage = body.heroImage ?? course.heroImage;
            course.isActive = body.isActive ?? course.isActive;
            course.courseHighlights = mapNestedItems(body.courseHighlights ?? []);
            course.courseFeatures = mapNestedItems(body.courseFeatures ?? []);
            course.courseStructure = mapNestedItems(body.courseStructure ?? []);
            await courseRepo.save(course);
            // Re-fetch with fresh relations for response
            const updated = await courseRepo.findOne({
                where: { id },
                relations: ["courseHighlights", "courseStructure", "courseFeatures"],
            });
            return reply.send(updated);
        }
        catch (err) {
            console.error("UPDATE ERROR:", err);
            return reply.status(500).send({
                error: "Failed to update course",
            });
        }
    });
    /*
      DELETE /api/courses/:id
      Delete course
    */
    app.delete("/courses/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const course = await courseRepo.findOne({ where: { id } });
            if (!course) {
                return reply.status(404).send({ error: "Course not found" });
            }
            await courseRepo.remove(course);
            return reply.send({ success: true });
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Failed to delete course" });
        }
    });
}
