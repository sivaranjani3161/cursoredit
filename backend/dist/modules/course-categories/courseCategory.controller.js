"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = getAllCategories;
exports.getCategoriesWithCourses = getCategoriesWithCourses;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const courseCategory_service_1 = require("./courseCategory.service");
const courseCategory_validator_1 = require("./courseCategory.validator");
async function getAllCategories(_req, reply) {
    try {
        reply.send(await courseCategory_service_1.courseCategoryService.findAll());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch categories" });
    }
}
async function getCategoriesWithCourses(_req, reply) {
    try {
        reply.send(await courseCategory_service_1.courseCategoryService.findAllWithCourses());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch categories" });
    }
}
async function createCategory(req, reply) {
    try {
        const body = req.body;
        const validation = (0, courseCategory_validator_1.validateCreateCourseCategory)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await courseCategory_service_1.courseCategoryService.create(body);
        if ("conflict" in result) {
            reply.status(409).send({ error: "Category with this slug already exists" });
            return;
        }
        reply.status(201).send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to create category" });
    }
}
async function updateCategory(req, reply) {
    try {
        const result = await courseCategory_service_1.courseCategoryService.update(Number(req.params.id), req.body);
        if ("notFound" in result) {
            reply.status(404).send({ error: "Category not found" });
            return;
        }
        reply.send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to update category" });
    }
}
async function deleteCategory(req, reply) {
    try {
        const result = await courseCategory_service_1.courseCategoryService.delete(Number(req.params.id));
        if ("notFound" in result) {
            reply.status(404).send({ error: "Category not found" });
            return;
        }
        reply.send({ success: true });
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to delete category" });
    }
}
