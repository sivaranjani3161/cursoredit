"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = blogRoutes;
const blog_controller_1 = require("./blog.controller");
async function blogRoutes(app) {
    app.get("/blogs", blog_controller_1.getAllBlogs);
    app.get("/blogs/:id", blog_controller_1.getBlogById);
    app.post("/blogs", blog_controller_1.createBlog);
    app.put("/blogs/:id", blog_controller_1.updateBlog);
    app.delete("/blogs/:id", blog_controller_1.deleteBlog);
}
