"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateBlog = validateCreateBlog;
exports.validateUpdateBlog = validateUpdateBlog;
const BlogStatus_1 = require("../../entities/enums/BlogStatus");
const errorMessages_1 = require("../../shared/constants/errorMessages");
const ok = () => ({ valid: true, errors: [] });
const fail = (errors) => ({ valid: false, errors });
function validateCreateBlog(body) {
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
    if (body?.status !== undefined && !Object.values(BlogStatus_1.BlogStatus).includes(body.status))
        errors.push({ field: "status", message: errorMessages_1.ERROR_MESSAGES.INVALID_ENUM("status", Object.values(BlogStatus_1.BlogStatus).join(", ")) });
    return errors.length ? fail(errors) : ok();
}
function validateUpdateBlog(body) {
    const errors = [];
    if (body?.slug !== undefined) {
        const slug = String(body.slug).trim();
        if (!slug)
            errors.push({ field: "slug", message: errorMessages_1.ERROR_MESSAGES.CANNOT_BE_EMPTY("slug") });
        else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
            errors.push({ field: "slug", message: errorMessages_1.ERROR_MESSAGES.INVALID_FORMAT("slug", errorMessages_1.ERROR_MESSAGES.SLUG_FORMAT) });
    }
    if (body?.status !== undefined && !Object.values(BlogStatus_1.BlogStatus).includes(body.status))
        errors.push({ field: "status", message: errorMessages_1.ERROR_MESSAGES.INVALID_ENUM("status", Object.values(BlogStatus_1.BlogStatus).join(", ")) });
    return errors.length ? fail(errors) : ok();
}
