import { FastifyInstance } from "fastify";
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonial.controller";
import {
  TestimonialIdParam,
  CreateTestimonialBody,
  UpdateTestimonialBody,
} from "../interfaces/testimonial.interface";

export default async function testimonialRoutes(app: FastifyInstance): Promise<void> {
  app.get("/testimonials", getAllTestimonials);
  app.get<{ Params: TestimonialIdParam }>("/testimonials/:id", getTestimonialById);
  app.post<{ Body: CreateTestimonialBody }>("/testimonials", createTestimonial);
  app.put<{ Params: TestimonialIdParam; Body: UpdateTestimonialBody }>(
    "/testimonials/:id",
    updateTestimonial
  );
  app.delete<{ Params: TestimonialIdParam }>("/testimonials/:id", deleteTestimonial);
}
