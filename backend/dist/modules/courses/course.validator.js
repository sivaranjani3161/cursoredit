"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateCourse = validateCreateCourse;
exports.validateUpdateCourse = validateUpdateCourse;
const errorMessages_1 = require("../../shared/constants/errorMessages");
const ok = () => ({ valid: true, errors: [] });
const fail = (e) => ({ valid: false, errors: e });
function validateCreateCourse(body) {
    const errors = [];
    const title = String(body?.title ?? "").trim();
    const slug = String(body?.slug ?? "").trim();
    const createdBy = Number(body?.createdBy);
    if (!title)
        errors.push({ field: "title", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("title") });
    if (!slug)
        errors.push({ field: "slug", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("slug") });
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
        errors.push({ field: "slug", message: errorMessages_1.ERROR_MESSAGES.INVALID_FORMAT("slug", errorMessages_1.ERROR_MESSAGES.SLUG_FORMAT) });
    if (Number.isNaN(createdBy) || createdBy <= 0)
        errors.push({ field: "createdBy", message: errorMessages_1.ERROR_MESSAGES.INVALID_ID("createdBy") });
    return errors.length ? fail(errors) : ok();
}
function validateUpdateCourse(body) {
    const errors = [];
    if (body?.slug !== undefined) {
        const slug = String(body.slug).trim();
        if (!slug)
            errors.push({ field: "slug", message: errorMessages_1.ERROR_MESSAGES.CANNOT_BE_EMPTY("slug") });
        else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
            errors.push({ field: "slug", message: errorMessages_1.ERROR_MESSAGES.INVALID_FORMAT("slug", errorMessages_1.ERROR_MESSAGES.SLUG_FORMAT) });
    }
    if (body?.title !== undefined && !String(body.title).trim())
        errors.push({ field: "title", message: errorMessages_1.ERROR_MESSAGES.CANNOT_BE_EMPTY("title") });
    return errors.length ? fail(errors) : ok();
}
