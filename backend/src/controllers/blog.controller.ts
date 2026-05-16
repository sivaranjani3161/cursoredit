import { FastifyRequest, FastifyReply } from "fastify";
import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Blog } from "../entities/Blog";
import { BlogTag } from "../entities/BlogTag";
import { RelatedBlog } from "../entities/RelatedBlog";
import { Tag } from "../entities/Tag";
import { BlogStatus } from "../entities/enums/BlogStatus";
import { CreateBlogBody, UpdateBlogBody, BlogIdParam } from "../interfaces/blog.interface";
import { slugify } from "../utils/slugify";
import { normalizeTagName, toNullableStr } from "../utils/stringHelpers";
import { validateCreateBlog, validateUpdateBlog } from "../validators";
const blogRepo = () => AppDataSource.getRepository(Blog);
const blogTagRepo = () => AppDataSource.getRepository(BlogTag);
const relatedBlogRepo = () => AppDataSource.getRepository(RelatedBlog);
const tagRepo = () => AppDataSource.getRepository(Tag);
function formatBlog(blog: Blog & { blogTags?: BlogTag[]; relatedBlogs?: RelatedBlog[] }) {
  return {
    ...blog,
    tags: blog.blogTags?.map((item) => (item as BlogTag & { tag?: Tag }).tag?.name).filter(Boolean) ?? [],
    relatedBlogIds: blog.relatedBlogs?.map((item) => item.relatedBlogId) ?? [],
  };
}
async function getOrCreateTags(tagNames: string[]): Promise<Tag[]> {
  const repo = tagRepo();
  const normalized = Array.from(
    new Set(tagNames.map((n) => normalizeTagName(n)).filter(Boolean))
  );
  if (!normalized.length) return [];

  const existing = await repo.find({ where: { name: In(normalized) } });
  const map = new Map(existing.map((t) => [t.name, t]));
  const toCreate = normalized.filter((n) => !map.has(n));

  for (const name of toCreate) {
    const saved = await repo.save(repo.create({ name, slug: slugify(name) }));
    map.set(name, saved);
  }

  return normalized.map((n) => map.get(n)!).filter(Boolean);
}
async function syncTagRelations(blogId: number, tagNames: string[]): Promise<void> {
  const repo = blogTagRepo();
  await repo.delete({ blogId });
  const tags = await getOrCreateTags(tagNames);
  if (!tags.length) return;
  await repo.save(tags.map((tag) => repo.create({ blogId, tagId: tag.id })));
}
async function syncRelatedBlogs(blogId: number, ids: number[]): Promise<void> {
  const repo = relatedBlogRepo();
  await repo.delete({ blogId });
  const cleanIds = Array.from(
    new Set(ids.map(Number).filter((id) => !Number.isNaN(id) && id > 0 && id !== blogId))
  );
  if (!cleanIds.length) return;

  const available = await blogRepo().find({ where: { id: In(cleanIds) }, select: { id: true } });
  const allowed = new Set(available.map((b) => b.id));
  await repo.save(
    cleanIds
      .filter((id) => allowed.has(id))
      .map((relatedBlogId) => repo.create({ blogId, relatedBlogId }))
  );
}
export async function getAllBlogs(_req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const blogs = await blogRepo().find({
      relations: ["blogTags", "blogTags.tag", "relatedBlogs"],
      order: { createdAt: "DESC" },
    });
    reply.send(blogs.map((b) => formatBlog(b as Blog & { blogTags: BlogTag[]; relatedBlogs: RelatedBlog[] })));
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch blogs" });
  }
}
export async function getBlogById(
  req: FastifyRequest<{ Params: BlogIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const blog = await blogRepo().findOne({
      where: { id },
      relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
    });
    if (!blog) { reply.status(404).send({ error: "Blog not found" }); return; }
    reply.send(formatBlog(blog as Blog & { blogTags: BlogTag[]; relatedBlogs: RelatedBlog[] }));
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to fetch blog" });
  }
}
export async function createBlog(
  req: FastifyRequest<{ Body: CreateBlogBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const body = req.body as unknown as Record<string, unknown>;
    const validation = validateCreateBlog(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors });
      return;
    }

    const title = String(body.title).trim();
    const slug = String(body.slug).trim();
    const createdBy = Number(body.createdBy);
    const status: BlogStatus = Object.values(BlogStatus).includes(body?.status as BlogStatus)
      ? (body.status as BlogStatus)
      : BlogStatus.DRAFT;

    const slugExists = await blogRepo().findOne({ where: { slug } });
    if (slugExists) { reply.status(409).send({ error: "Slug already exists" }); return; }

    const blog = blogRepo().create({
      title,
      slug,
      excerpt: toNullableStr(body?.excerpt),
      content: String(body?.content ?? ""),
      coverImage: toNullableStr(body?.coverImage),
      publishedAt: body?.publishedAt ? new Date(body.publishedAt as string) : null,
      status,
      createdBy,
    });

    const saved = await blogRepo().save(blog);
    await syncTagRelations(saved.id, Array.isArray(body?.tags) ? (body.tags as string[]) : []);
    await syncRelatedBlogs(saved.id, Array.isArray(body?.relatedBlogIds) ? (body.relatedBlogIds as number[]) : []);

    const withRelations = await blogRepo().findOne({
      where: { id: saved.id },
      relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
    });
    reply.status(201).send(formatBlog(withRelations as Blog & { blogTags: BlogTag[]; relatedBlogs: RelatedBlog[] }));
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to create blog" });
  }
}

export async function updateBlog(
  req: FastifyRequest<{ Params: BlogIdParam; Body: UpdateBlogBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const body = req.body as unknown as Record<string, unknown>;

    const validation = validateUpdateBlog(body);
    if (!validation.valid) {
      reply.status(400).send({ error: "Validation failed", details: validation.errors });
      return;
    }

    const blog = await blogRepo().findOne({ where: { id } });
    if (!blog) { reply.status(404).send({ error: "Blog not found" }); return; }

    const nextSlug = body?.slug !== undefined ? String(body.slug).trim() : blog.slug;
    if (nextSlug !== blog.slug) {
      const conflict = await blogRepo().findOne({ where: { slug: nextSlug } });
      if (conflict && conflict.id !== id) {
        reply.status(409).send({ error: "Slug already exists" }); return;
      }
    }

    if (body?.title !== undefined) blog.title = String(body.title).trim();
    blog.slug = nextSlug;
    if (body?.excerpt !== undefined) blog.excerpt = toNullableStr(body.excerpt);
    if (body?.content !== undefined) blog.content = String(body.content);
    if (body?.coverImage !== undefined) blog.coverImage = toNullableStr(body.coverImage);
    if (body?.publishedAt !== undefined)
      blog.publishedAt = body.publishedAt ? new Date(body.publishedAt as string) : null;
    if (body?.status !== undefined && Object.values(BlogStatus).includes(body.status as BlogStatus))
      blog.status = body.status as BlogStatus;

    await blogRepo().save(blog);
    if (body?.tags !== undefined)
      await syncTagRelations(blog.id, Array.isArray(body.tags) ? (body.tags as string[]) : []);
    if (body?.relatedBlogIds !== undefined)
      await syncRelatedBlogs(blog.id, Array.isArray(body.relatedBlogIds) ? (body.relatedBlogIds as number[]) : []);

    const withRelations = await blogRepo().findOne({
      where: { id: blog.id },
      relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
    });
    reply.send(formatBlog(withRelations as Blog & { blogTags: BlogTag[]; relatedBlogs: RelatedBlog[] }));
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to update blog" });
  }
}

export async function deleteBlog(
  req: FastifyRequest<{ Params: BlogIdParam }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const blog = await blogRepo().findOne({ where: { id } });
    if (!blog) { reply.status(404).send({ error: "Blog not found" }); return; }
    await blogRepo().remove(blog);
    reply.send({ success: true });
  } catch (err) {
    reply.log.error(err);
    reply.status(500).send({ error: "Failed to delete blog" });
  }
}
