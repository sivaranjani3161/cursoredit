"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = void 0;
exports.formatBlog = formatBlog;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../../config/data-source");
const Blog_1 = require("../../entities/Blog");
const BlogTag_1 = require("../../entities/BlogTag");
const RelatedBlog_1 = require("../../entities/RelatedBlog");
const Tag_1 = require("../../entities/Tag");
const BlogStatus_1 = require("../../entities/enums/BlogStatus");
const slugify_1 = require("../../shared/utils/slugify");
const stringHelpers_1 = require("../../shared/utils/stringHelpers");
const blogRepo = () => data_source_1.AppDataSource.getRepository(Blog_1.Blog);
const blogTagRepo = () => data_source_1.AppDataSource.getRepository(BlogTag_1.BlogTag);
const relatedRepo = () => data_source_1.AppDataSource.getRepository(RelatedBlog_1.RelatedBlog);
const tagRepo = () => data_source_1.AppDataSource.getRepository(Tag_1.Tag);
function formatBlog(blog) {
    return {
        ...blog,
        tags: blog.blogTags?.map((item) => item.tag?.name).filter(Boolean) ?? [],
        relatedBlogIds: blog.relatedBlogs?.map((item) => item.relatedBlogId) ?? [],
    };
}
async function getOrCreateTags(tagNames) {
    const repo = tagRepo();
    const normalized = Array.from(new Set(tagNames.map((n) => (0, stringHelpers_1.normalizeTagName)(n)).filter(Boolean)));
    if (!normalized.length)
        return [];
    const existing = await repo.find({ where: { name: (0, typeorm_1.In)(normalized) } });
    const map = new Map(existing.map((t) => [t.name, t]));
    const toCreate = normalized.filter((n) => !map.has(n));
    for (const name of toCreate) {
        const saved = await repo.save(repo.create({ name, slug: (0, slugify_1.slugify)(name) }));
        map.set(name, saved);
    }
    return normalized.map((n) => map.get(n)).filter(Boolean);
}
async function syncTagRelations(blogId, tagNames) {
    const repo = blogTagRepo();
    await repo.delete({ blogId });
    const tags = await getOrCreateTags(tagNames);
    if (!tags.length)
        return;
    await repo.save(tags.map((tag) => repo.create({ blogId, tagId: tag.id })));
}
async function syncRelatedBlogs(blogId, ids) {
    const repo = relatedRepo();
    await repo.delete({ blogId });
    const cleanIds = Array.from(new Set(ids.map(Number).filter((id) => !Number.isNaN(id) && id > 0 && id !== blogId)));
    if (!cleanIds.length)
        return;
    const available = await blogRepo().find({ where: { id: (0, typeorm_1.In)(cleanIds) }, select: { id: true } });
    const allowed = new Set(available.map((b) => b.id));
    await repo.save(cleanIds.filter((id) => allowed.has(id)).map((relatedBlogId) => repo.create({ blogId, relatedBlogId })));
}
const WITH_RELATIONS = ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"];
exports.blogService = {
    findAll: async () => {
        const blogs = await blogRepo().find({
            relations: ["blogTags", "blogTags.tag", "relatedBlogs"],
            order: { createdAt: "DESC" },
        });
        return blogs.map((b) => formatBlog(b));
    },
    findById: async (id) => {
        const blog = await blogRepo().findOne({ where: { id }, relations: WITH_RELATIONS });
        return blog ? formatBlog(blog) : null;
    },
    create: async (body) => {
        const title = String(body.title).trim();
        const slug = String(body.slug).trim();
        const status = Object.values(BlogStatus_1.BlogStatus).includes(body.status)
            ? body.status
            : BlogStatus_1.BlogStatus.DRAFT;
        const slugExists = await blogRepo().findOne({ where: { slug } });
        if (slugExists)
            return { conflict: true };
        const blog = blogRepo().create({
            title,
            slug,
            excerpt: (0, stringHelpers_1.toNullableStr)(body.excerpt),
            content: String(body.content ?? ""),
            coverImage: (0, stringHelpers_1.toNullableStr)(body.coverImage),
            publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
            status,
            createdBy: body.createdBy,
        });
        const saved = await blogRepo().save(blog);
        await syncTagRelations(saved.id, Array.isArray(body.tags) ? body.tags : []);
        await syncRelatedBlogs(saved.id, Array.isArray(body.relatedBlogIds) ? body.relatedBlogIds : []);
        const withRels = await blogRepo().findOne({ where: { id: saved.id }, relations: WITH_RELATIONS });
        return { data: formatBlog(withRels) };
    },
    update: async (id, body) => {
        const blog = await blogRepo().findOne({ where: { id } });
        if (!blog)
            return { notFound: true };
        const nextSlug = body.slug !== undefined ? String(body.slug).trim() : blog.slug;
        if (nextSlug !== blog.slug) {
            const conflict = await blogRepo().findOne({ where: { slug: nextSlug } });
            if (conflict && conflict.id !== id)
                return { conflict: true };
        }
        if (body.title !== undefined)
            blog.title = String(body.title).trim();
        blog.slug = nextSlug;
        if (body.excerpt !== undefined)
            blog.excerpt = (0, stringHelpers_1.toNullableStr)(body.excerpt);
        if (body.content !== undefined)
            blog.content = String(body.content);
        if (body.coverImage !== undefined)
            blog.coverImage = (0, stringHelpers_1.toNullableStr)(body.coverImage);
        if (body.publishedAt !== undefined)
            blog.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
        if (body.status !== undefined && Object.values(BlogStatus_1.BlogStatus).includes(body.status))
            blog.status = body.status;
        await blogRepo().save(blog);
        if (body.tags !== undefined)
            await syncTagRelations(id, Array.isArray(body.tags) ? body.tags : []);
        if (body.relatedBlogIds !== undefined)
            await syncRelatedBlogs(id, Array.isArray(body.relatedBlogIds) ? body.relatedBlogIds : []);
        const withRels = await blogRepo().findOne({ where: { id }, relations: WITH_RELATIONS });
        return { data: formatBlog(withRels) };
    },
    delete: async (id) => {
        const blog = await blogRepo().findOne({ where: { id } });
        if (!blog)
            return { notFound: true };
        await blogRepo().remove(blog);
        return { success: true };
    },
};
