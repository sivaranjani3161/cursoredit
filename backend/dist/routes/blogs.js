"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = blogRoutes;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../config/data-source");
const Blog_1 = require("../entities/Blog");
const BlogTag_1 = require("../entities/BlogTag");
const RelatedBlog_1 = require("../entities/RelatedBlog");
const Tag_1 = require("../entities/Tag");
const BlogStatus_1 = require("../entities/enums/BlogStatus");
const normalizeTagName = (value) => value.trim().toLowerCase().replace(/\s+/g, " ");
const slugify = (value) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
async function blogRoutes(app) {
    const blogRepo = data_source_1.AppDataSource.getRepository(Blog_1.Blog);
    const blogTagRepo = data_source_1.AppDataSource.getRepository(BlogTag_1.BlogTag);
    const relatedBlogRepo = data_source_1.AppDataSource.getRepository(RelatedBlog_1.RelatedBlog);
    const tagRepo = data_source_1.AppDataSource.getRepository(Tag_1.Tag);
    const formatBlog = (blog) => ({
        ...blog,
        tags: blog.blogTags?.map((item) => item.tag?.name).filter(Boolean) ?? [],
        relatedBlogIds: blog.relatedBlogs?.map((item) => item.relatedBlogId) ?? [],
    });
    const getOrCreateTags = async (tagNames) => {
        const normalized = Array.from(new Set(tagNames.map((name) => normalizeTagName(String(name || ""))).filter(Boolean)));
        if (!normalized.length)
            return [];
        const existing = await tagRepo.find({ where: { name: (0, typeorm_1.In)(normalized) } });
        const map = new Map(existing.map((tag) => [tag.name, tag]));
        const toCreate = normalized.filter((name) => !map.has(name));
        for (const name of toCreate) {
            const created = tagRepo.create({ name, slug: slugify(name) });
            const saved = await tagRepo.save(created);
            map.set(name, saved);
        }
        return normalized.map((name) => map.get(name)).filter(Boolean);
    };
    const syncTagRelations = async (blogId, tagNames) => {
        await blogTagRepo.delete({ blogId });
        const tags = await getOrCreateTags(tagNames);
        if (!tags.length)
            return;
        await blogTagRepo.save(tags.map((tag) => blogTagRepo.create({ blogId, tagId: tag.id })));
    };
    const syncRelatedBlogs = async (blogId, ids) => {
        await relatedBlogRepo.delete({ blogId });
        const cleanIds = Array.from(new Set(ids.map(Number).filter((id) => !Number.isNaN(id) && id > 0 && id !== blogId)));
        if (!cleanIds.length)
            return;
        const available = await blogRepo.find({ where: { id: (0, typeorm_1.In)(cleanIds) }, select: { id: true } });
        const allowed = new Set(available.map((item) => item.id));
        await relatedBlogRepo.save(cleanIds
            .filter((id) => allowed.has(id))
            .map((relatedBlogId) => relatedBlogRepo.create({ blogId, relatedBlogId })));
    };
    app.get("/blogs", async (_req, reply) => {
        try {
            const blogs = await blogRepo.find({
                relations: ["blogTags", "blogTags.tag", "relatedBlogs"],
                order: { createdAt: "DESC" },
            });
            return reply.send(blogs.map((blog) => formatBlog(blog)));
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch blogs" });
        }
    });
    app.get("/blogs/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const blog = await blogRepo.findOne({
                where: { id },
                relations: ["blogTags", "blogTags.tag", "relatedBlogs", "relatedBlogs.relatedBlog"],
            });
            if (!blog)
                return reply.status(404).send({ error: "Blog not found" });
            return reply.send(formatBlog(blog));
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to fetch blog" });
        }
    });
    app.post("/blogs", async (req, reply) => {
        try {
            const body = req.body;
            const title = String(body?.title ?? "").trim();
            const slug = String(body?.slug ?? "").trim();
            const createdBy = Number(body?.createdBy);
            const status = Object.values(BlogStatus_1.BlogStatus).includes(body?.status)
                ? body.status
                : BlogStatus_1.BlogStatus.DRAFT;
            if (!title || !slug || Number.isNaN(createdBy)) {
                return reply.status(400).send({ error: "title, slug and createdBy are required" });
            }
            const slugExists = await blogRepo.findOne({ where: { slug } });
            if (slugExists)
                return reply.status(409).send({ error: "Slug already exists" });
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
            return reply.status(201).send(formatBlog(withRelations));
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to create blog" });
        }
    });
    app.put("/blogs/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const body = req.body;
            const blog = await blogRepo.findOne({ where: { id } });
            if (!blog)
                return reply.status(404).send({ error: "Blog not found" });
            const nextSlug = body?.slug !== undefined ? String(body.slug).trim() : blog.slug;
            if (!nextSlug)
                return reply.status(400).send({ error: "slug is required" });
            if (nextSlug !== blog.slug) {
                const slugExists = await blogRepo.findOne({ where: { slug: nextSlug } });
                if (slugExists && slugExists.id !== id) {
                    return reply.status(409).send({ error: "Slug already exists" });
                }
            }
            if (body?.title !== undefined)
                blog.title = String(body.title).trim();
            blog.slug = nextSlug;
            if (body?.excerpt !== undefined)
                blog.excerpt = body.excerpt ? String(body.excerpt) : null;
            if (body?.content !== undefined)
                blog.content = String(body.content);
            if (body?.coverImage !== undefined)
                blog.coverImage = body.coverImage ? String(body.coverImage) : null;
            if (body?.publishedAt !== undefined)
                blog.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
            if (body?.status !== undefined && Object.values(BlogStatus_1.BlogStatus).includes(body.status)) {
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
            return reply.send(formatBlog(withRelations));
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to update blog" });
        }
    });
    app.delete("/blogs/:id", async (req, reply) => {
        try {
            const id = Number(req.params.id);
            const blog = await blogRepo.findOne({ where: { id } });
            if (!blog)
                return reply.status(404).send({ error: "Blog not found" });
            await blogRepo.remove(blog);
            return reply.send({ success: true });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({ error: "Failed to delete blog" });
        }
    });
}
