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
const Enquiry_1 = require("./Enquiry");
const User_1 = require("./User");
const CourseCategory_1 = require("./CourseCategory");
let Course = class Course {
    id;
    title;
    slug;
    description;
    heroImage;
    isActive;
    categoryId;
    category;
    createdBy;
    createdByUser;
    courseHighlights;
    courseStructure;
    courseFeatures;
    enquiries;
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
    (0, typeorm_1.Column)({ name: "category_id", type: "int", nullable: true }),
    __metadata("design:type", Object)
], Course.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CourseCategory_1.CourseCategory, (cat) => cat.courses, { nullable: true, onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "category_id" }),
    __metadata("design:type", Object)
], Course.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "created_by" }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], Course.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.courses, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "created_by" }),
    __metadata("design:type", User_1.User)
], Course.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CourseHighlight_1.CourseHighlight, (highlight) => highlight.course, { cascade: true }),
    __metadata("design:type", Array)
], Course.prototype, "courseHighlights", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CourseStructure_1.CourseStructure, (structure) => structure.course, { cascade: true }),
    __metadata("design:type", Array)
], Course.prototype, "courseStructure", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CourseFeature_1.CourseFeature, (feature) => feature.course, { cascade: true }),
    __metadata("design:type", Array)
], Course.prototype, "courseFeatures", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Enquiry_1.Enquiry, (enquiry) => enquiry.course),
    __metadata("design:type", Array)
], Course.prototype, "enquiries", void 0);
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
