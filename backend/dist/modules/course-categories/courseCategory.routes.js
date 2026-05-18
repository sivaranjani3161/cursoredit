"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = courseCategoryRoutes;
const courseCategory_controller_1 = require("./courseCategory.controller");
async function courseCategoryRoutes(app) {
    app.get("/course-categories", courseCategory_controller_1.getAllCategories);
    app.get("/course-categories/with-courses", courseCategory_controller_1.getCategoriesWithCourses);
    app.post("/course-categories", courseCategory_controller_1.createCategory);
    app.put("/course-categories/:id", courseCategory_controller_1.updateCategory);
    app.delete("/course-categories/:id", courseCategory_controller_1.deleteCategory);
}
