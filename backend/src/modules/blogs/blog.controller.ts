import { FastifyRequest, FastifyReply } from "fastify";
import { blogService } from "./blog.service";
import { validateCreateBlog, validateUpdateBlog } from "./blog.validator";
import { BlogIdParam, CreateBlogBody, UpdateBlogBody } from "./blog.interface";

export async function getAllBlogs(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try { reply.send(await blogService.findAll()); }
  catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch blogs" }); }
}

export async function getBlogById(req: FastifyRequest<{ Params: BlogIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const blog = await blogService.findById(Number(req.params.id));
    if (!blog) { reply.status(404).send({ error: "Blog not found" }); return; }
    reply.send(blog);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to fetch blog" }); }
}

export async function createBlog(req: FastifyRequest<{ Body: CreateBlogBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateBlog(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }

    const result = await blogService.create({
      ...(body as unknown as CreateBlogBody & { createdBy: number }),
      createdBy: Number(body.createdBy),
    });
    if ("conflict" in result) { reply.status(409).send({ error: "Slug already exists" }); return; }
    reply.status(201).send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to create blog" }); }
}

export async function updateBlog(req: FastifyRequest<{ Params: BlogIdParam; Body: UpdateBlogBody }>, reply: FastifyReply): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateUpdateBlog(body);
    if (!validation.valid) { reply.status(400).send({ error: "Validation failed", details: validation.errors }); return; }

    const result = await blogService.update(Number(req.params.id), body as Partial<UpdateBlogBody>);
    if ("notFound" in result) { reply.status(404).send({ error: "Blog not found" }); return; }
    if ("conflict" in result) { reply.status(409).send({ error: "Slug already exists" }); return; }
    reply.send(result.data);
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to update blog" }); }
}

export async function deleteBlog(req: FastifyRequest<{ Params: BlogIdParam }>, reply: FastifyReply): Promise<void> {
  try {
    const result = await blogService.delete(Number(req.params.id));
    if ("notFound" in result) { reply.status(404).send({ error: "Blog not found" }); return; }
    reply.send({ success: true });
  } catch (err) { reply.log.error(err); reply.status(500).send({ error: "Failed to delete blog" }); }
}
