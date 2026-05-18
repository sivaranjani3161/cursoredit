"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateUser = validateCreateUser;
exports.validateUpdateUser = validateUpdateUser;
const errorMessages_1 = require("../../shared/constants/errorMessages");
const ok = () => ({ valid: true, errors: [] });
const fail = (e) => ({ valid: false, errors: e });
function validateCreateUser(body) {
    const errors = [];
    const email = String(body?.email ?? "").trim();
    const name = String(body?.name ?? "").trim();
    const roleId = Number(body?.roleId);
    if (!email)
        errors.push({ field: "email", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("email") });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.push({ field: "email", message: errorMessages_1.ERROR_MESSAGES.MUST_BE_VALID("email") });
    if (!name)
        errors.push({ field: "name", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("name") });
    if (Number.isNaN(roleId) || roleId <= 0)
        errors.push({ field: "roleId", message: errorMessages_1.ERROR_MESSAGES.INVALID_ID("roleId") });
    return errors.length ? fail(errors) : ok();
}
function validateUpdateUser(body) {
    const errors = [];
    if (body?.email !== undefined) {
        const email = String(body.email).trim();
        if (!email)
            errors.push({ field: "email", message: errorMessages_1.ERROR_MESSAGES.CANNOT_BE_EMPTY("email") });
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errors.push({ field: "email", message: errorMessages_1.ERROR_MESSAGES.MUST_BE_VALID("email") });
    }
    if (body?.name !== undefined && !String(body.name).trim())
        errors.push({ field: "name", message: errorMessages_1.ERROR_MESSAGES.CANNOT_BE_EMPTY("name") });
    return errors.length ? fail(errors) : ok();
}
