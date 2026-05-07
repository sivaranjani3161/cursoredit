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
exports.Course = void 0;
const typeorm_1 = require("typeorm");
const CourseHighlight_1 = require("./CourseHighlight");
const CourseStructure_1 = require("./CourseStructure");
const CourseFeature_1 = require("./CourseFeature");
const User_1 = require("./User");
let Course = class Course {
    id;
    title;
    slug;
    description;
    heroImage;
    isActive;
    userId;
    user;
    highlights;
    structures;
    features;
    createdAt;
    updatedAt;
};
exports.Course = Course;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Course.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, unique: true }),
    __metadata("design:type", String)
], Course.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], Course.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true }),
    __metadata("design:type", Object)
], Course.prototype, "heroImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], Course.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Course.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.courses),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", User_1.User)
], Course.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CourseHighlight_1.CourseHighlight, (highlight) => highlight.course),
    __metadata("design:type", Array)
], Course.prototype, "highlights", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CourseStructure_1.CourseStructure, (structure) => structure.course),
    __metadata("design:type", Array)
], Course.prototype, "structures", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CourseFeature_1.CourseFeature, (feature) => feature.course),
    __metadata("design:type", Array)
], Course.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Course.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Course.prototype, "updatedAt", void 0);
exports.Course = Course = __decorate([
    (0, typeorm_1.Entity)("courses")
], Course);
