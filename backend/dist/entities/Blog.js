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
exports.Blog = void 0;
const typeorm_1 = require("typeorm");
const BlogStatus_1 = require("./enums/BlogStatus");
const BlogTag_1 = require("./BlogTag");
const RelatedBlog_1 = require("./RelatedBlog");
const User_1 = require("./User");
let Blog = class Blog {
    id;
    title;
    slug;
    excerpt;
    content;
    coverImage;
    publishedAt;
    status;
    userId;
    user;
    tags;
    relatedBlogs;
    createdAt;
    updatedAt;
};
exports.Blog = Blog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Blog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Blog.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, unique: true }),
    __metadata("design:type", String)
], Blog.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], Blog.prototype, "excerpt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "longtext" }),
    __metadata("design:type", String)
], Blog.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true }),
    __metadata("design:type", Object)
], Blog.prototype, "coverImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], Blog.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: BlogStatus_1.BlogStatus, default: BlogStatus_1.BlogStatus.DRAFT }),
    __metadata("design:type", String)
], Blog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Blog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.blogs),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", User_1.User)
], Blog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BlogTag_1.BlogTag, (blogTag) => blogTag.blog),
    __metadata("design:type", Array)
], Blog.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => RelatedBlog_1.RelatedBlog, (relatedBlog) => relatedBlog.blog),
    __metadata("design:type", Array)
], Blog.prototype, "relatedBlogs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Blog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Blog.prototype, "updatedAt", void 0);
exports.Blog = Blog = __decorate([
    (0, typeorm_1.Entity)("blogs")
], Blog);
