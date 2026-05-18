import { In } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { Blog } from "../../entities/Blog";
import { BlogTag } from "../../entities/BlogTag";
import { RelatedBlog } from "../../entities/RelatedBlog";
import { Tag } from "../../entities/Tag";
import { BlogStatus } from "../../entities/enums/BlogStatus";
import { slugify } from "../../shared/utils/slugify";
import { normalizeTagName, toNullableStr } from "../../shared/utils/stringHelpers";
import { CreateBlogBody, UpdateBlogBody } from "./blog.interface";

const blogRepo     = () => AppDataSource.getRepository(Blog);
const blogTagRepo  = () => AppDataSource.getRepository(BlogTag);
const relatedRepo  = () => AppDataSource.getRepository(RelatedBlog);
const tagRepo      = () => AppDataSource.getRepository(Tag);

export function formatBlog(blog: Blog & { blogTags?: BlogTag[]; relatedBlogs?: RelatedBlog[] }) {
  return {
    ...blog,
    tags: blog.blogTags?.map((item) => (item as BlogTag & { tag?: Tag }).tag?.name).filter(Boolean) ?? [],
    relatedBlogIds: blog.relatedBlogs?.map((item) => item.relatedBlogId) ?? [],
  };
}

async function getOrCreateTags(tagNames: string[]): Promise<Tag[]> {
  const repo = tagRepo();
  const normalized = Array.from(new Set(tagNames.map((n) => normalizeTagName(n)).filter(Boolean)));
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
  const repo = relatedRepo();
  await repo.delete({ blogId });
  const cleanIds = Array.from(
    new Set(ids.map(Number).filter((id) => !Number.isNaN(id) && id > 0 && id !== blogId))
  );
  if (!cleanIds.length) return;

  const available = await blogRepo().find({ where: { id: In(cleanIds) }, select: { id: true } });
  const allowed = new Set(available.map((b) => b.id));
  await repo.save(
    cleanIds.filter((id) => allowed.has(id)).map((relatedBlogId) => repo.create({ blogId, relatedBlogId }))
  );
}

const WITH_RELATIONS = ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"];

export const blogService = {
  findAll: async () => {
    const blogs = await blogRepo().find({
      relations: ["blogTags", "blogTags.tag", "relatedBlogs"],
      order: { createdAt: "DESC" },
    });
    return blogs.map((b) => formatBlog(b as Blog & { blogTags: BlogTag[]; relatedBlogs: RelatedBlog[] }));
  },

  findById: async (id: number) => {
    const blog = await blogRepo().findOne({ where: { id }, relations: WITH_RELATIONS });
    return blog ? formatBlog(blog as Blog & { blogTags: BlogTag[]; relatedBlogs: RelatedBlog[] }) : null;
  },

  create: async (body: CreateBlogBody & { createdBy: number }) => {
    const title = String(body.title).trim();
    const slug  = String(body.slug).trim();
    const status: BlogStatus = Object.values(BlogStatus).includes(body.status as BlogStatus)
      ? (body.status as BlogStatus)
      : BlogStatus.DRAFT;

    const slugExists = await blogRepo().findOne({ where: { slug } });
    if (slugExists) return { conflict: true as const };

    const blog = blogRepo().create({
      title,
      slug,
      excerpt:     toNullableStr(body.excerpt),
      content:     String(body.content ?? ""),
      coverImage:  toNullableStr(body.coverImage),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      status,
      createdBy:   body.createdBy,
    });

    const saved = await blogRepo().save(blog);
    await syncTagRelations(saved.id, Array.isArray(body.tags) ? body.tags : []);
    await syncRelatedBlogs(saved.id, Array.isArray(body.relatedBlogIds) ? body.relatedBlogIds : []);

    const withRels = await blogRepo().findOne({ where: { id: saved.id }, relations: WITH_RELATIONS });
    return { data: formatBlog(withRels as Blog & { blogTags: BlogTag[]; relatedBlogs: RelatedBlog[] }) };
  },

  update: async (id: number, body: Partial<UpdateBlogBody>) => {
    const blog = await blogRepo().findOne({ where: { id } });
    if (!blog) return { notFound: true as const };

    const nextSlug = body.slug !== undefined ? String(body.slug).trim() : blog.slug;
    if (nextSlug !== blog.slug) {
      const conflict = await blogRepo().findOne({ where: { slug: nextSlug } });
      if (conflict && conflict.id !== id) return { conflict: true as const };
    }

    if (body.title     !== undefined) blog.title     = String(body.title).trim();
    blog.slug = nextSlug;
    if (body.excerpt   !== undefined) blog.excerpt   = toNullableStr(body.excerpt);
    if (body.content   !== undefined) blog.content   = String(body.content);
    if (body.coverImage !== undefined) blog.coverImage = toNullableStr(body.coverImage);
    if (body.publishedAt !== undefined)
      blog.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    if (body.status !== undefined && Object.values(BlogStatus).includes(body.status as BlogStatus))
      blog.status = body.status as BlogStatus;

    await blogRepo().save(blog);
    if (body.tags !== undefined)           await syncTagRelations(id, Array.isArray(body.tags) ? body.tags : []);
    if (body.relatedBlogIds !== undefined) await syncRelatedBlogs(id, Array.isArray(body.relatedBlogIds) ? body.relatedBlogIds : []);

    const withRels = await blogRepo().findOne({ where: { id }, relations: WITH_RELATIONS });
    return { data: formatBlog(withRels as Blog & { blogTags: BlogTag[]; relatedBlogs: RelatedBlog[] }) };
  },

  delete: async (id: number) => {
    const blog = await blogRepo().findOne({ where: { id } });
    if (!blog) return { notFound: true as const };
    await blogRepo().remove(blog);
    return { success: true as const };
  },
};
