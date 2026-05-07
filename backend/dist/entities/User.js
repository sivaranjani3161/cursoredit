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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Role_1 = require("./Role");
const UserStatus_1 = require("./enums/UserStatus");
const Blog_1 = require("./Blog");
const GalleryEvent_1 = require("./GalleryEvent");
const Course_1 = require("./Course");
const Testimonial_1 = require("./Testimonial");
let User = class User {
    id;
    email;
    name;
    // Auth
    password;
    authProvider;
    oauthId;
    // Invite Flow
    inviteToken;
    inviteExpiresAt;
    // Status
    status;
    // Role
    roleId;
    role;
    // Admin Ownership Relations
    blogs;
    galleryEvents;
    courses;
    testimonials;
    // Audit
    createdAt;
    updatedAt;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "authProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "oauthId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, unique: true, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "inviteToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "inviteExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: UserStatus_1.UserStatus, default: UserStatus_1.UserStatus.INVITED }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], User.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Role_1.Role, (role) => role.users),
    (0, typeorm_1.JoinColumn)({ name: "roleId" }),
    __metadata("design:type", Role_1.Role)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Blog_1.Blog, (blog) => blog.user),
    __metadata("design:type", Array)
], User.prototype, "blogs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GalleryEvent_1.GalleryEvent, (event) => event.user),
    __metadata("design:type", Array)
], User.prototype, "galleryEvents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Course_1.Course, (course) => course.user),
    __metadata("design:type", Array)
], User.prototype, "courses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Testimonial_1.Testimonial, (testimonial) => testimonial.user),
    __metadata("design:type", Array)
], User.prototype, "testimonials", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("users")
], User);
