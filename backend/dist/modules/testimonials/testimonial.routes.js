"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = testimonialRoutes;
const testimonial_controller_1 = require("./testimonial.controller");
async function testimonialRoutes(app) {
    app.get("/testimonials", testimonial_controller_1.getAllTestimonials);
    app.get("/testimonials/:id", testimonial_controller_1.getTestimonialById);
    app.post("/testimonials", testimonial_controller_1.createTestimonial);
    app.put("/testimonials/:id", testimonial_controller_1.updateTestimonial);
    app.delete("/testimonials/:id", testimonial_controller_1.deleteTestimonial);
}
