"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateRole = validateCreateRole;
const errorMessages_1 = require("../../shared/constants/errorMessages");
const ok = () => ({ valid: true, errors: [] });
const fail = (e) => ({ valid: false, errors: e });
function validateCreateRole(body) {
    const errors = [];
    const name = String(body?.name ?? "").trim();
    const code = String(body?.code ?? "").trim();
    if (!name)
        errors.push({ field: "name", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("name") });
    if (!code)
        errors.push({ field: "code", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("code") });
    else if (!/^[a-z0-9_]+$/.test(code))
        errors.push({ field: "code", message: errorMessages_1.ERROR_MESSAGES.INVALID_FORMAT("code", errorMessages_1.ERROR_MESSAGES.ROLE_CODE_FORMAT) });
    return errors.length ? fail(errors) : ok();
}
