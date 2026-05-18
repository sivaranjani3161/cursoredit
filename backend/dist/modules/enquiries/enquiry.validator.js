"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateEnquiry = validateCreateEnquiry;
exports.validateUpdateEnquiry = validateUpdateEnquiry;
const errorMessages_1 = require("../../shared/constants/errorMessages");
const ok = () => ({ valid: true, errors: [] });
const fail = (e) => ({ valid: false, errors: e });
function validateCreateEnquiry(body) {
    const errors = [];
    const fullName = String(body?.fullName ?? "").trim();
    const email = String(body?.email ?? "").trim();
    if (!fullName)
        errors.push({ field: "fullName", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("fullName") });
    if (!email)
        errors.push({ field: "email", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("email") });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.push({ field: "email", message: errorMessages_1.ERROR_MESSAGES.INVALID_FORMAT("email", errorMessages_1.ERROR_MESSAGES.EMAIL_FORMAT) });
    return errors.length ? fail(errors) : ok();
}
function validateUpdateEnquiry(body) {
    const errors = [];
    if (body?.email !== undefined) {
        const email = String(body.email).trim();
        if (!email)
            errors.push({ field: "email", message: errorMessages_1.ERROR_MESSAGES.CANNOT_BE_EMPTY("email") });
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errors.push({ field: "email", message: errorMessages_1.ERROR_MESSAGES.INVALID_FORMAT("email", errorMessages_1.ERROR_MESSAGES.EMAIL_FORMAT) });
    }
    return errors.length ? fail(errors) : ok();
}
