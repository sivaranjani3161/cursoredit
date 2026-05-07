"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatedBlog = void 0;
const typeorm_1 = require("typeorm");
const Blog_1 = require("./Blog");
let RelatedBlog = class RelatedBlog {
    blogId;
    relatedBlogId;
    blog;
    relatedBlog;
};
exports.RelatedBlog = RelatedBlog;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], RelatedBlog.prototype, "blogId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], RelatedBlog.prototype, "relatedBlogId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Blog_1.Blog, (blog) => blog.relatedBlogs, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "blogId" }),
    __metadata("design:type", Blog_1.Blog)
], RelatedBlog.prototype, "blog", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Blog_1.Blog, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "relatedBlogId" }),
    __metadata("design:type", Blog_1.Blog)
], RelatedBlog.prototype, "relatedBlog", void 0);
exports.RelatedBlog = RelatedBlog = __decorate([
    (0, typeorm_1.Entity)("related_blogs")
], RelatedBlog);
