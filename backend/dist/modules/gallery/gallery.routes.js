"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = galleryRoutes;
const gallery_controller_1 = require("./gallery.controller");
async function galleryRoutes(app) {
    app.get("/gallery", gallery_controller_1.getAllGallery);
    app.get("/gallery/:id", gallery_controller_1.getGalleryById);
    app.post("/gallery", gallery_controller_1.createGallery);
    app.put("/gallery/:id", gallery_controller_1.updateGallery);
    app.delete("/gallery/:id", gallery_controller_1.deleteGallery);
}
