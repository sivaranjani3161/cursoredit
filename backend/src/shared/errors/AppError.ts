export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode    = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundError    extends AppError { constructor(msg = "Not found")             { super(msg, 404); } }
export class BadRequestError  extends AppError { constructor(msg = "Bad request")           { super(msg, 400); } }
export class ConflictError    extends AppError { constructor(msg = "Conflict")              { super(msg, 409); } }
export class ForbiddenError   extends AppError { constructor(msg = "Forbidden")             { super(msg, 403); } }
export class UnauthorizedError extends AppError { constructor(msg = "Unauthorized")          { super(msg, 401); } }
