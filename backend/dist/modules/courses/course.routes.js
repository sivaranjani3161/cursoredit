"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = courseRoutes;
const course_controller_1 = require("./course.controller");
async function courseRoutes(app) {
    app.get("/courses", course_controller_1.getAllCourses);
    app.get("/courses/active", course_controller_1.getActiveCourses);
    app.get("/courses/slug/:slug", course_controller_1.getCourseBySlug);
    app.get("/courses/:id", course_controller_1.getCourseById);
    app.post("/courses", course_controller_1.createCourse);
    app.put("/courses/:id", course_controller_1.updateCourse);
    app.delete("/courses/:id", course_controller_1.deleteCourse);
}
