import { FastifyInstance } from "fastify";
import { getAllCategories, getCategoriesWithCourses, createCategory, updateCategory, deleteCategory } from "./courseCategory.controller";
import { CourseCategoryIdParam, CreateCourseCategoryBody, UpdateCourseCategoryBody } from "./courseCategory.interface";

export default async function courseCategoryRoutes(app: FastifyInstance): Promise<void> {
  app.get("/course-categories", getAllCategories);
  app.get("/course-categories/with-courses", getCategoriesWithCourses);
  app.post<{ Body: CreateCourseCategoryBody }>("/course-categories", createCategory);
  app.put<{ Params: CourseCategoryIdParam; Body: UpdateCourseCategoryBody }>("/course-categories/:id", updateCategory);
  app.delete<{ Params: CourseCategoryIdParam }>("/course-categories/:id", deleteCategory);
}
