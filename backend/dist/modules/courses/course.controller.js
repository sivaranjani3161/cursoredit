"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCourses = getAllCourses;
exports.getActiveCourses = getActiveCourses;
exports.getCourseBySlug = getCourseBySlug;
exports.getCourseById = getCourseById;
exports.createCourse = createCourse;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
const course_service_1 = require("./course.service");
const course_validator_1 = require("./course.validator");
async function getAllCourses(_req, reply) {
    try {
        reply.send(await course_service_1.courseService.findAll());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch courses" });
    }
}
async function getActiveCourses(_req, reply) {
    try {
        reply.send(await course_service_1.courseService.findActive());
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch active courses" });
    }
}
async function getCourseBySlug(req, reply) {
    try {
        const course = await course_service_1.courseService.findBySlug(req.params.slug);
        if (!course) {
            reply.status(404).send({ error: "Course not found" });
            return;
        }
        reply.send(course);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch course" });
    }
}
async function getCourseById(req, reply) {
    try {
        const course = await course_service_1.courseService.findById(Number(req.params.id));
        if (!course) {
            reply.status(404).send({ error: "Course not found" });
            return;
        }
        reply.send(course);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to fetch course" });
    }
}
async function createCourse(req, reply) {
    try {
        const body = req.body;
        const validation = (0, course_validator_1.validateCreateCourse)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await course_service_1.courseService.create({ ...body, createdBy: Number(body.createdBy) });
        if ("conflict" in result) {
            reply.status(409).send({ error: "Slug already exists" });
            return;
        }
        reply.status(201).send(result.data);
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to create course" });
    }
}
async function updateCourse(req, reply) {
    try {
        const body = req.body;
        const validation = (0, course_validator_1.validateUpdateCourse)(body);
        if (!validation.valid) {
            reply.status(400).send({ error: "Validation failed", details: validation.errors });
            return;
        }
        const result = await course_service_1.courseService.update(Number(req.params.id), body);
        if ("notFound" in result) {
            reply.status(404).send({ error: "Course not found" });
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
        reply.status(500).send({ error: "Failed to update course" });
    }
}
async function deleteCourse(req, reply) {
    try {
        const result = await course_service_1.courseService.delete(Number(req.params.id));
        if ("notFound" in result) {
            reply.status(404).send({ error: "Course not found" });
            return;
        }
        reply.send({ success: true });
    }
    catch (err) {
        reply.log.error(err);
        reply.status(500).send({ error: "Failed to delete course" });
    }
}
