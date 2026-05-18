import { FastifyInstance } from "fastify";
import { getAllCourses, getActiveCourses, getCourseBySlug, getCourseById, createCourse, updateCourse, deleteCourse } from "./course.controller";
import { CourseIdParam, CourseSlugParam, CreateCourseBody, UpdateCourseBody } from "./course.interface";

export default async function courseRoutes(app: FastifyInstance): Promise<void> {
  app.get("/courses", getAllCourses);
  app.get("/courses/active", getActiveCourses);
  app.get<{ Params: CourseSlugParam }>("/courses/slug/:slug", getCourseBySlug);
  app.get<{ Params: CourseIdParam }>("/courses/:id", getCourseById);
  app.post<{ Body: CreateCourseBody }>("/courses", createCourse);
  app.put<{ Params: CourseIdParam; Body: UpdateCourseBody }>("/courses/:id", updateCourse);
  app.delete<{ Params: CourseIdParam }>("/courses/:id", deleteCourse);
}
