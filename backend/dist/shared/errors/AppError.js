"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.ForbiddenError = exports.ConflictError = exports.BadRequestError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(msg = "Not found") { super(msg, 404); }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends AppError {
    constructor(msg = "Bad request") { super(msg, 400); }
}
exports.BadRequestError = BadRequestError;
class ConflictError extends AppError {
    constructor(msg = "Conflict") { super(msg, 409); }
}
exports.ConflictError = ConflictError;
class ForbiddenError extends AppError {
    constructor(msg = "Forbidden") { super(msg, 403); }
}
exports.ForbiddenError = ForbiddenError;
class UnauthorizedError extends AppError {
    constructor(msg = "Unauthorized") { super(msg, 401); }
}
exports.UnauthorizedError = UnauthorizedError;
