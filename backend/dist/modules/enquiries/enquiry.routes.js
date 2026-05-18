"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = enquiryRoutes;
const enquiry_controller_1 = require("./enquiry.controller");
async function enquiryRoutes(app) {
    app.get("/enquiries", enquiry_controller_1.getAllEnquiries);
    app.get("/enquiries/:id", enquiry_controller_1.getEnquiryById);
    app.post("/enquiries", enquiry_controller_1.createEnquiry);
    app.put("/enquiries/:id", enquiry_controller_1.updateEnquiry);
    app.delete("/enquiries/:id", enquiry_controller_1.deleteEnquiry);
}
