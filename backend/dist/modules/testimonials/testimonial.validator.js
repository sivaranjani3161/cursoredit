"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateTestimonial = validateCreateTestimonial;
const errorMessages_1 = require("../../shared/constants/errorMessages");
const ok = () => ({ valid: true, errors: [] });
const fail = (e) => ({ valid: false, errors: e });
function validateCreateTestimonial(body) {
    const errors = [];
    const createdBy = Number(body?.createdBy);
    if (Number.isNaN(createdBy) || createdBy <= 0)
        errors.push({ field: "createdBy", message: errorMessages_1.ERROR_MESSAGES.INVALID_ID("createdBy") });
    return errors.length ? fail(errors) : ok();
}
