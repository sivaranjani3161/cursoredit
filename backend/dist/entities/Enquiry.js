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
exports.Enquiry = void 0;
const typeorm_1 = require("typeorm");
const EnquiryStatus_1 = require("./enums/EnquiryStatus");
const Course_1 = require("./Course");
let Enquiry = class Enquiry {
    id;
    fullName;
    email;
    phone;
    message;
    courseId;
    course;
    status;
    createdAt;
};
exports.Enquiry = Enquiry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Enquiry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Enquiry.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Enquiry.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", Object)
], Enquiry.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Enquiry.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Object)
], Enquiry.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Course_1.Course, { onDelete: "SET NULL", nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "courseId" }),
    __metadata("design:type", Object)
], Enquiry.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: EnquiryStatus_1.EnquiryStatus, default: EnquiryStatus_1.EnquiryStatus.NEW }),
    __metadata("design:type", String)
], Enquiry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Enquiry.prototype, "createdAt", void 0);
exports.Enquiry = Enquiry = __decorate([
    (0, typeorm_1.Entity)("enquiries")
], Enquiry);
