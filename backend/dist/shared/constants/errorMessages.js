"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = void 0;
exports.ERROR_MESSAGES = {
    REQUIRED: (field) => `${field} is required`,
    CANNOT_BE_EMPTY: (field) => `${field} cannot be empty`,
    INVALID_FORMAT: (field, format) => `${field} must be ${format}`,
    INVALID_ENUM: (field, allowedValues) => `${field} must be one of: ${allowedValues}`,
    INVALID_ID: (field) => `${field} must be a valid id`,
    INVALID_TYPE: (field, expectedType) => `${field} must be an ${expectedType}`,
    MUST_BE_VALID: (field) => `${field} must be valid`,
    SLUG_FORMAT: "lowercase alphanumeric with hyphens",
    EMAIL_FORMAT: "a valid email address",
    ROLE_CODE_FORMAT: "lowercase alphanumeric with underscores",
};
