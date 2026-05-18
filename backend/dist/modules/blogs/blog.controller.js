"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBlogs = getAllBlogs;
exports.getBlogById = getBlogById;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
const blog_service_1 = require("./blog.service");
const blog_validator_1 = require("./blog.validator");
async function getAllBlogs(_req, reply) {
    try {
        reply.send(await blog_service_1.blogService.findAll());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch blogs" });
    }
}
async function getBlogById(req, reply) {
    try {
        const blog = await blog_service_1.blogService.findById(Number(req.params.id));
        if (!blog) {
            reply.status(404).send({ error: "Blog not found" });
            return;
        }
        reply.send(blog);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch blog" });
    }
}
async function createBlog(req, reply) {
    try {
        const body = req.body;
        const validation = (0, blog_validator_1.validateCreateBlog)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await blog_service_1.blogService.create({
            ...body,
            createdBy: Number(body.createdBy),
        });
        if ("conflict" in result) {
            reply.status(409).send({ error: "Slug already exists" });
            return;
        }
        reply.status(201).send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to create blog" });
    }
}
async function updateBlog(req, reply) {
    try {
        const body = req.body;
        const validation = (0, blog_validator_1.validateUpdateBlog)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await blog_service_1.blogService.update(Number(req.params.id), body);
        if ("notFound" in result) {
            reply.status(404).send({ error: "Blog not found" });
            return;
        }
        if ("conflict" in result) {
            reply.status(409).send({ error: "Slug already exists" });
            return;
        }
        reply.send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to update blog" });
    }
}
async function deleteBlog(req, reply) {
    try {
        const result = await blog_service_1.blogService.delete(Number(req.params.id));
        if ("notFound" in result) {
            reply.status(404).send({ error: "Blog not found" });
            return;
        }
        reply.send({ success: true });
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to delete blog" });
    }
}
