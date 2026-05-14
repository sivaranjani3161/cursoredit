import { FastifyInstance } from "fastify";
import { AppDataSource } from "../config/data-source";
import { CourseCategory } from "../entities/CourseCategory";

export default async function courseCategoryRoutes(app: FastifyInstance) {
  const repo = AppDataSource.getRepository(CourseCategory);

  const makeSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  /* GET /api/course-categories — all categories */
  app.get("/course-categories", async (_req, reply) => {
    try {
      const cats = await repo.find({ order: { sortOrder: "ASC", name: "ASC" } });
      return reply.send(cats);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to fetch categories" });
    }
  });

  /* GET /api/course-categories/with-courses — categories + their active courses */
  app.get("/course-categories/with-courses", async (_req, reply) => {
    try {
      const cats = await repo.find({
        order: { sortOrder: "ASC", name: "ASC" },
        relations: ["courses"],
      });
      // Only include active courses in each category
      const result = cats.map((cat) => ({
        ...cat,
        courses: (cat.courses || [])
          .filter((c) => c.isActive)
          .map((c) => ({ id: c.id, title: c.title, slug: c.slug })),
      }));
      return reply.send(result);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to fetch categories with courses" });
    }
  });

  /* POST /api/course-categories — create */
  app.post("/course-categories", async (req, reply) => {
    try {
      const body = req.body as any;
      const name = String(body?.name ?? "").trim();
      if (!name) return reply.status(400).send({ error: "name is required" });

      const slug = body?.slug ? String(body.slug).trim() : makeSlug(name);

      const existing = await repo.findOne({ where: { slug } });
      if (existing) return reply.status(400).send({ error: "Category with this slug already exists" });

      const cat = repo.create({
        name,
        slug,
        description: body?.description ? String(body.description) : null,
        sortOrder: body?.sortOrder !== undefined ? Number(body.sortOrder) : 0,
      });
      await repo.save(cat);
      return reply.status(201).send(cat);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to create category" });
    }
  });

  /* PUT /api/course-categories/:id — update */
  app.put<{ Params: { id: string } }>("/course-categories/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const body = req.body as any;

      const cat = await repo.findOne({ where: { id } });
      if (!cat) return reply.status(404).send({ error: "Category not found" });

      if (body.name !== undefined) cat.name = String(body.name).trim();
      if (body.slug !== undefined) cat.slug = String(body.slug).trim();
      if (body.description !== undefined) cat.description = body.description || null;
      if (body.sortOrder !== undefined) cat.sortOrder = Number(body.sortOrder);

      await repo.save(cat);
      return reply.send(cat);
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to update category" });
    }
  });

  /* DELETE /api/course-categories/:id */
  app.delete<{ Params: { id: string } }>("/course-categories/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const cat = await repo.findOne({ where: { id } });
      if (!cat) return reply.status(404).send({ error: "Category not found" });
      await repo.remove(cat);
      return reply.send({ success: true });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to delete category" });
    }
  });
}
