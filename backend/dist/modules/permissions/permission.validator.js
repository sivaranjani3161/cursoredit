"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdatePermissions = validateUpdatePermissions;
const errorMessages_1 = require("../../shared/constants/errorMessages");
const ok = () => ({ valid: true, errors: [] });
const fail = (e) => ({ valid: false, errors: e });
function validateUpdatePermissions(body) {
    const errors = [];
    const roleId = Number(body?.roleId);
    if (Number.isNaN(roleId) || roleId <= 0)
        errors.push({ field: "roleId", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("roleId") });
    if (body?.permissions === undefined || typeof body.permissions !== "object" || Array.isArray(body.permissions))
        errors.push({ field: "permissions", message: errorMessages_1.ERROR_MESSAGES.INVALID_TYPE("permissions", "object") });
    return errors.length ? fail(errors) : ok();
}
