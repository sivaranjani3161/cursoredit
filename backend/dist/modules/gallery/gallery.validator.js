"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateGallery = validateCreateGallery;
const errorMessages_1 = require("../../shared/constants/errorMessages");
const ok = () => ({ valid: true, errors: [] });
const fail = (e) => ({ valid: false, errors: e });
function validateCreateGallery(body) {
    const errors = [];
    const type = body?.type;
    if (type !== "internal" && type !== "external")
        errors.push({ field: "type", message: errorMessages_1.ERROR_MESSAGES.INVALID_ENUM("type", '"internal", "external"') });
    if (type === "external") {
        if (!String(body?.title ?? "").trim())
            errors.push({ field: "title", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("title") });
        if (!String(body?.slug ?? "").trim())
            errors.push({ field: "slug", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("slug") });
        const createdBy = Number(body?.createdBy);
        if (Number.isNaN(createdBy) || createdBy <= 0)
            errors.push({ field: "createdBy", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("createdBy") });
    }
    if (type === "internal" && !String(body?.imageUrl ?? "").trim())
        errors.push({ field: "imageUrl", message: errorMessages_1.ERROR_MESSAGES.REQUIRED("imageUrl") });
    return errors.length ? fail(errors) : ok();
}
