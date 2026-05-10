import { FastifyInstance } from "fastify";
import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Blog } from "../entities/Blog";
import { BlogTag } from "../entities/BlogTag";
import { RelatedBlog } from "../entities/RelatedBlog";
import { Tag } from "../entities/Tag";
import { BlogStatus } from "../entities/enums/BlogStatus";

const normalizeTagName = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default async function blogRoutes(app: FastifyInstance) {
  const blogRepo = AppDataSource.getRepository(Blog);
  const blogTagRepo = AppDataSource.getRepository(BlogTag);
  const relatedBlogRepo = AppDataSource.getRepository(RelatedBlog);
  const tagRepo = AppDataSource.getRepository(Tag);

  const formatBlog = (blog: Blog & { blogTags?: BlogTag[]; relatedBlogs?: RelatedBlog[] }) => ({
    ...blog,
    tags: blog.blogTags?.map((item: any) => item.tag?.name).filter(Boolean) ?? [],
    relatedBlogIds: blog.relatedBlogs?.map((item: any) => item.relatedBlogId) ?? [],
  });

  const getOrCreateTags = async (tagNames: string[]) => {
    const normalized = Array.from(new Set(tagNames.map((name) => normalizeTagName(String(name || ""))).filter(Boolean)));
    if (!normalized.length) return [];

    const existing = await tagRepo.find({ where: { name: In(normalized) } });
    const map = new Map(existing.map((tag) => [tag.name, tag]));
    const toCreate = normalized.filter((name) => !map.has(name));

    for (const name of toCreate) {
      const created = tagRepo.create({ name, slug: slugify(name) });
      const saved = await tagRepo.save(created);
      map.set(name, saved);
    }

    return normalized.map((name) => map.get(name)!).filter(Boolean);
  };

  const syncTagRelations = async (blogId: number, tagNames: string[]) => {
    await blogTagRepo.delete({ blogId });
    const tags = await getOrCreateTags(tagNames);
    if (!tags.length) return;
    await blogTagRepo.save(tags.map((tag) => blogTagRepo.create({ blogId, tagId: tag.id })));
  };

  const syncRelatedBlogs = async (blogId: number, ids: number[]) => {
    await relatedBlogRepo.delete({ blogId });
    const cleanIds = Array.from(new Set(ids.map(Number).filter((id) => !Number.isNaN(id) && id > 0 && id !== blogId)));
    if (!cleanIds.length) return;

    const available = await blogRepo.find({ where: { id: In(cleanIds) }, select: { id: true } });
    const allowed = new Set(available.map((item) => item.id));
    await relatedBlogRepo.save(
      cleanIds
        .filter((id) => allowed.has(id))
        .map((relatedBlogId) => relatedBlogRepo.create({ blogId, relatedBlogId }))
    );
  };

  app.get("/blogs", async (_req, reply) => {
    try {
      const blogs = await blogRepo.find({
        relations: ["blogTags", "blogTags.tag", "relatedBlogs"],
        order: { createdAt: "DESC" },
      });
      return reply.send(blogs.map((blog) => formatBlog(blog as any)));
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch blogs" });
    }
  });

  app.get<{ Params: { id: string } }>("/blogs/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const blog = await blogRepo.findOne({
        where: { id },
        relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
      });

      if (!blog) return reply.status(404).send({ error: "Blog not found" });
      return reply.send(formatBlog(blog as any));
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch blog" });
    }
  });

  app.post("/blogs", async (req, reply) => {
    try {
      const body = req.body as any;
      const title = String(body?.title ?? "").trim();
      const slug = String(body?.slug ?? "").trim();
      const createdBy = Number(body?.createdBy);
      const status: BlogStatus = Object.values(BlogStatus).includes(body?.status)
        ? body.status
        : BlogStatus.DRAFT;

      if (!title || !slug || Number.isNaN(createdBy)) {
        return reply.status(400).send({ error: "title, slug and createdBy are required" });
      }

      const slugExists = await blogRepo.findOne({ where: { slug } });
      if (slugExists) return reply.status(409).send({ error: "Slug already exists" });

      const blog = blogRepo.create({
        title,
        slug,
        excerpt: body?.excerpt ? String(body.excerpt) : null,
        content: String(body?.content ?? ""),
        coverImage: body?.coverImage ? String(body.coverImage) : null,
        publishedAt: body?.publishedAt ? new Date(body.publishedAt) : null,
        status,
        createdBy,
      });

      const saved = await blogRepo.save(blog);
      await syncTagRelations(saved.id, Array.isArray(body?.tags) ? body.tags : []);
      await syncRelatedBlogs(saved.id, Array.isArray(body?.relatedBlogIds) ? body.relatedBlogIds : []);

      const withRelations = await blogRepo.findOne({
        where: { id: saved.id },
        relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
      });
      return reply.status(201).send(formatBlog(withRelations as any));
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to create blog" });
    }
  });

  app.put<{ Params: { id: string } }>("/blogs/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const body = req.body as any;
      const blog = await blogRepo.findOne({ where: { id } });
      if (!blog) return reply.status(404).send({ error: "Blog not found" });

      const nextSlug = body?.slug !== undefined ? String(body.slug).trim() : blog.slug;
      if (!nextSlug) return reply.status(400).send({ error: "slug is required" });
      if (nextSlug !== blog.slug) {
        const slugExists = await blogRepo.findOne({ where: { slug: nextSlug } });
        if (slugExists && slugExists.id !== id) {
          return reply.status(409).send({ error: "Slug already exists" });
        }
      }

      if (body?.title !== undefined) blog.title = String(body.title).trim();
      blog.slug = nextSlug;
      if (body?.excerpt !== undefined) blog.excerpt = body.excerpt ? String(body.excerpt) : null;
      if (body?.content !== undefined) blog.content = String(body.content);
      if (body?.coverImage !== undefined) blog.coverImage = body.coverImage ? String(body.coverImage) : null;
      if (body?.publishedAt !== undefined) blog.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
      if (body?.status !== undefined && Object.values(BlogStatus).includes(body.status)) {
        blog.status = body.status;
      }

      await blogRepo.save(blog);
      if (body?.tags !== undefined) {
        await syncTagRelations(blog.id, Array.isArray(body.tags) ? body.tags : []);
      }
      if (body?.relatedBlogIds !== undefined) {
        await syncRelatedBlogs(blog.id, Array.isArray(body.relatedBlogIds) ? body.relatedBlogIds : []);
      }

      const withRelations = await blogRepo.findOne({
        where: { id: blog.id },
        relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
      });
      return reply.send(formatBlog(withRelations as any));
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to update blog" });
    }
  });

  app.delete<{ Params: { id: string } }>("/blogs/:id", async (req, reply) => {
    try {
      const id = Number(req.params.id);
      const blog = await blogRepo.findOne({ where: { id } });
      if (!blog) return reply.status(404).send({ error: "Blog not found" });
      await blogRepo.remove(blog);
      return reply.send({ success: true });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ error: "Failed to delete blog" });
    }
  });
}
