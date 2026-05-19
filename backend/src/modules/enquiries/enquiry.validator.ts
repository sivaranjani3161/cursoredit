import { ERROR_MESSAGES as MSG } from "../../shared/constants/errorMessages";
export interface ValidationError  { field: string; message: string; }
export interface ValidationResult { valid: boolean; errors: ValidationError[]; }
const ok   = (): ValidationResult => ({ valid: true, errors: [] });
const fail = (e: ValidationError[]): ValidationResult => ({ valid: false, errors: e });

export function validateCreateEnquiry(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  const fullName = String(body?.fullName ?? "").trim();
  const email    = String(body?.email    ?? "").trim();
  if (!fullName) errors.push({ field: "fullName", message: MSG.REQUIRED("fullName") });
  if (!email)    errors.push({ field: "email", message: MSG.REQUIRED("email") });
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push({ field: "email", message: MSG.INVALID_FORMAT("email", MSG.EMAIL_FORMAT) });
  return errors.length ? fail(errors) : ok();
}

export function validateUpdateEnquiry(body: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];
  if (body?.email !== undefined) {
    const email = String(body.email).trim();
    if (!email) errors.push({ field: "email", message: MSG.CANNOT_BE_EMPTY("email") });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push({ field: "email", message: MSG.INVALID_FORMAT("email", MSG.EMAIL_FORMAT) });
  }
  return errors.length ? fail(errors) : ok();
}
