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
exports.CourseStructure = void 0;
const typeorm_1 = require("typeorm");
const Course_1 = require("./Course");
let CourseStructure = class CourseStructure {
    id;
    courseId;
    phaseNumber;
    title;
    description;
    icon;
    sortOrder;
    course;
};
exports.CourseStructure = CourseStructure;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CourseStructure.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], CourseStructure.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CourseStructure.prototype, "phaseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], CourseStructure.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], CourseStructure.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], CourseStructure.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], CourseStructure.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Course_1.Course, (course) => course.structures, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "courseId" }),
    __metadata("design:type", Course_1.Course)
], CourseStructure.prototype, "course", void 0);
exports.CourseStructure = CourseStructure = __decorate([
    (0, typeorm_1.Entity)("course_structure")
], CourseStructure);
