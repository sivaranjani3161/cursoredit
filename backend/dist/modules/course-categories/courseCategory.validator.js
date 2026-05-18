"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateCourseCategory = validateCreateCourseCategory;
const errorMessages_1 = require("../../shared/constants/errorMessages");
const ok = () => ({ valid: true, errors: [] });
const fail = (e) => ({ valid: false, errors: e });
function validateCreateCourseCategory(body) {
    const errors = [];
    const name = String(body?.name ?? "").trim();
    if (!name)
        errors.push({ field: "name", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("name") });
    if (body?.slug !== undefined) {
        const slug = String(body.slug).trim();
        if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
            errors.push({ field: "slug", message: errorMessages_1.ERROR_MESSAGES.INVALID_FORMAT("slug", errorMessages_1.ERROR_MESSAGES.SLUG_FORMAT) });
    }
    return errors.length ? fail(errors) : ok();
}
