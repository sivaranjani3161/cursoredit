import { FastifyInstance } from "fastify";
import { AppDataSource } from "../config/data-source";
import { Course } from "../entities/Course";

export default async function courseRoutes(app: FastifyInstance) {
  const courseRepo = AppDataSource.getRepository(Course);

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
    } catch (err) {
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
      const body = req.body as any;

      const existing = await courseRepo.findOne({
        where: {
          slug: body.slug,
        },
      });

      if (existing) {
        return reply.status(400).send({
          error: "Slug already exists",
        });
      }

      const course = courseRepo.create(body);
      await courseRepo.save(course);

      return reply.status(201).send(course);

    } catch (err) {
      console.error(err);

      return reply.status(500).send({
        error: "Failed to create course",
      });
    }
  });

  /*
    GET /api/courses/:id
    Get single course with relations
  */
  app.get<{
    Params: {
      id: string;
    };
  }>("/courses/:id", async (req, reply) => {
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
    } catch (err) {
      console.error(err);

      return reply.status(500).send({
        error: "Failed to fetch course",
      });
    }
  });

  /*
    PUT /api/courses/:id
    Update course and its related entities
  */
  app.put<{
    Params: { id: string };
  }>("/courses/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const body = req.body as any;

      const course = await courseRepo.findOne({
        where: { id },
      });

      if (!course) {
        return reply.status(404).send({
          error: "Course not found",
        });
      }

      // Merge and save (TypeORM will handle cascading updates if configured)
      const updated = courseRepo.merge(course, body);
      await courseRepo.save(updated);

      return reply.send(updated);
    } catch (err) {
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
  app.delete<{
    Params: { id: string };
  }>("/courses/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      
      const course = await courseRepo.findOne({ where: { id } });
      if (!course) {
        return reply.status(404).send({ error: "Course not found" });
      }

      await courseRepo.remove(course);
      return reply.send({ success: true });
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Failed to delete course" });
    }
  });
}