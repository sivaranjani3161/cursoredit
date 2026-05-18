import { FastifyInstance } from "fastify";
import { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "./blog.controller";
import { BlogIdParam, CreateBlogBody, UpdateBlogBody } from "./blog.interface";

export default async function blogRoutes(app: FastifyInstance): Promise<void> {
  app.get("/blogs", getAllBlogs);
  app.get<{ Params: BlogIdParam }>("/blogs/:id", getBlogById);
  app.post<{ Body: CreateBlogBody }>("/blogs", createBlog);
  app.put<{ Params: BlogIdParam; Body: UpdateBlogBody }>("/blogs/:id", updateBlog);
  app.delete<{ Params: BlogIdParam }>("/blogs/:id", deleteBlog);
}
