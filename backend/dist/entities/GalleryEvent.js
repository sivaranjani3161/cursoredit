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
exports.GalleryEvent = void 0;
const typeorm_1 = require("typeorm");
const GalleryImage_1 = require("./GalleryImage");
const User_1 = require("./User");
let GalleryEvent = class GalleryEvent {
    id;
    title;
    location;
    slug;
    coverImage;
    description;
    eventDate;
    createdBy;
    createdByUser;
    galleryImages;
    createdAt;
    updatedAt;
};
exports.GalleryEvent = GalleryEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GalleryEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], GalleryEvent.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], GalleryEvent.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, unique: true }),
    __metadata("design:type", String)
], GalleryEvent.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true }),
    __metadata("design:type", Object)
], GalleryEvent.prototype, "coverImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], GalleryEvent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Object)
], GalleryEvent.prototype, "eventDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Number)
], GalleryEvent.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.galleryEvents, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "created_by" }),
    __metadata("design:type", User_1.User)
], GalleryEvent.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => GalleryImage_1.GalleryImage, (image) => image.event),
    __metadata("design:type", Array)
], GalleryEvent.prototype, "galleryImages", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GalleryEvent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GalleryEvent.prototype, "updatedAt", void 0);
exports.GalleryEvent = GalleryEvent = __decorate([
    (0, typeorm_1.Entity)("gallery_events")
], GalleryEvent);
